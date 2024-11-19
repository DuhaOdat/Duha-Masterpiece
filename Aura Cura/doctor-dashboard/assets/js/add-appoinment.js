// Function to fetch all patients from the API
async function fetchPatients() {
    try {
        const response = await fetch('https://localhost:44396/api/Appointments/GetAllPatients');
        const patients = await response.json();

        const patientSelect = document.getElementById('patientSelect');

        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.patientId;
            option.text = `${patient.firstName} ${patient.lastName}`;
            patientSelect.add(option);
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
        Swal.fire('Error', 'Failed to fetch patients', 'error');
    }
}

// Call the fetchPatients function on page load
window.onload = function() {
    fetchPatients();

    // Get today's date and add one day to it
    const today = new Date();
    today.setDate(today.getDate() + 1); // Add one day to today
    const minDate = today.toISOString().split('T')[0]; // Format the date as yyyy-mm-dd

    // Set the minimum date for the appointmentDate input to tomorrow
    document.getElementById('appointmentDate').setAttribute('min', minDate);
};

// Function to fetch DoctorID based on the UserID stored in localStorage
async function getDoctorIdFromUserId(userId) {
    const token = localStorage.getItem('jwtToken'); // Assuming you're using JWT tokens for authorization
    try {
        const response = await fetch(`https://localhost:44396/api/Appointments/GetDoctorByUserId/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const doctorData = await response.json();
            console.log('Doctor data:', doctorData); // Log the fetched doctor data
            return doctorData.doctorId; // Get the correct DoctorID
        } else {
            throw new Error('Failed to fetch DoctorID');
        }
    } catch (error) {
        console.error('Error fetching DoctorID:', error);
        return null;
    }
}

// Function to populate time slots based on the doctor's schedule, excluding booked times
function populateTimeSlots(schedule, bookedTimes) {
    const timeSlotSelect = document.getElementById('timeSlotSelect');
    timeSlotSelect.innerHTML = ''; // Clear old options

    // Assume startTime and endTime are the working hours and need to be split into intervals
    let startTime = new Date(`1970-01-01T${schedule.startTime}`);
    let endTime = new Date(`1970-01-01T${schedule.endTime}`);

    // Add time intervals to the list based on the doctor's schedule
    while (startTime < endTime) {
        const timeString = startTime.toTimeString().slice(0, 5); // Format as HH:mm

        // Check if the time is in the booked times, skip it if it is
        if (!bookedTimes.includes(timeString)) {
            const option = document.createElement('option');
            option.value = timeString;
            option.text = timeString;
            timeSlotSelect.add(option);
        }

        // Increment by 30 minutes
        startTime.setMinutes(startTime.getMinutes() + 30);
    }
}

// Function to clear time slots if no schedule is available
function clearTimeSlots() {
    const timeSlotSelect = document.getElementById('timeSlotSelect');
    timeSlotSelect.innerHTML = ''; // Clear options
}

// Function to fetch doctor's schedule and booked times
async function fetchDoctorSchedule(doctorId, selectedDate) {
    console.log('Fetching schedule for doctorId:', doctorId); // Log doctorId to ensure it's correct

    try {
        // Fetch the doctor's full schedule
        const response = await fetch(`https://localhost:44396/api/Appointments/GetDoctorScheduleByDoctorId/${doctorId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch doctor schedule');
        }

        const schedule = await response.json();
        console.log('Fetched schedule:', schedule); // Log the fetched schedule

        // Filter the schedule for the selected day of the week
        const dayOfWeek = new Date(selectedDate).toLocaleString('en-us', { weekday: 'long' });
        console.log('Selected day of week:', dayOfWeek); // Log selected day of week
        const doctorSchedule = schedule.find(s => s.dayOfWeek === dayOfWeek);
        console.log('Doctor schedule for selected day:', doctorSchedule); // Log doctor's schedule for that day

        if (doctorSchedule) {
            // Fetch booked times for the selected date
            const bookedResponse = await fetch(`https://localhost:44396/api/Appointments/GetBookedTimes/${doctorId}/${selectedDate}`);
            
            if (!bookedResponse.ok) {
                throw new Error('Failed to fetch booked times');
            }

            const bookedTimes = await bookedResponse.json();
            console.log('Booked times:', bookedTimes); // Log booked times

            // Populate time slots excluding the booked ones
            populateTimeSlots(doctorSchedule, bookedTimes);
        } else {
            Swal.fire('Unavailable', 'Doctor is not available on this day.', 'info');
            clearTimeSlots();
        }
    } catch (error) {
        console.error('Error fetching doctor schedule:', error);
        Swal.fire('Error', 'Failed to fetch doctor schedule', 'error');
    }
}

// Event listener for date change to fetch available time slots
document.getElementById('appointmentDate').addEventListener('change', async function () {
    const selectedDate = this.value;
    const userId = localStorage.getItem('userId'); // Get userId from localStorage

    if (!userId) {
        Swal.fire('Error', 'Doctor userId not found in local storage.', 'error');
        return;
    }

    const doctorId = await getDoctorIdFromUserId(userId); // Get the DoctorID from the UserID

    if (!doctorId) {
        Swal.fire('Error', 'Could not retrieve DoctorID.', 'error');
        return;
    }

    // Check if doctorId is being fetched and passed correctly
    console.log('DoctorID retrieved:', doctorId); 

    fetchDoctorSchedule(doctorId, selectedDate);
});


// Function to validate and submit appointment
document.getElementById('submitAppointment').addEventListener('click', async () => {
    const patientId = document.getElementById('patientSelect').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const selectedTime = document.getElementById('timeSlotSelect').value;
    const notes = document.getElementById('notes').value;

    if (!selectedTime) {
        Swal.fire('Warning', 'Please select a valid time slot.', 'warning');
        return;
    }

    // Combine the date and time for the appointment, ensuring time format is consistent (HH:mm)
    const appointmentDateTime = `${appointmentDate}T${selectedTime}:00`;

    // Fetch the userId from localStorage
    const userId = localStorage.getItem('userId'); // Get userId from localStorage

    if (!userId) {
        Swal.fire('Error', 'Doctor userId not found in local storage.', 'error');
        return;
    }

    const doctorId = await getDoctorIdFromUserId(userId); // Get the DoctorID

    if (!doctorId) {
        Swal.fire('Error', 'Could not retrieve DoctorID.', 'error');
        return;
    }

    // Check if doctorId is being fetched and passed correctly
    console.log('DoctorID being submitted:', doctorId);

    // Sending the appointment data to the API to book the appointment
    const data = new FormData();
    data.append("DoctorID", doctorId);
    data.append("PatientID", patientId);
    data.append("AppointmentDate", appointmentDateTime);
    data.append("Notes", notes);

    try {
        const response = await fetch('https://localhost:44396/api/Appointments/CreateAppointment', {
            method: 'POST',
            body: data
        });

        const result = await response.json();
        console.log('Data being submitted:', {
            DoctorID: doctorId,
            PatientID: patientId,
            AppointmentDate: appointmentDateTime,
            Notes: notes
        });
        
        if (response.ok) {
            Swal.fire('Success', result.message || 'Appointment created successfully.', 'success');

            // Remove the selected time slot after successful booking
            const timeSlotSelect = document.getElementById('timeSlotSelect');
            const selectedOption = timeSlotSelect.options[timeSlotSelect.selectedIndex];

            if (selectedOption) {
                selectedOption.remove(); // إزالة الوقت المحجوز من القائمة
            }
        } else {
            Swal.fire('Error', result.message || 'Failed to create appointment.', 'error');
        }

    } catch (error) {
        console.error('Error creating appointment:', error);
        Swal.fire('Error', 'Failed to create appointment.', 'error');
    }
});
