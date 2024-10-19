
// Function to fetch all patients from the API
async function fetchPatients() {
    try {
        const response = await fetch('https://localhost:44396/api/Appointments/GetAllPatients');
        const patients = await response.json();
        
        const patientSelect = document.getElementById('patientSelect');
        
        patients.forEach(patient => {
            console.log(patient);
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

// Function to fetch doctor's schedule and populate available time slots
async function fetchDoctorSchedule(userId, selectedDate) {
    try {
        const response = await fetch(`https://localhost:44396/api/Appointments/GetDoctorSchedule/${userId}`);
        const schedule = await response.json();
        
        console.log('Doctor Schedule:', schedule);  // Log the response for debugging
        
        // Filter the schedule for the selected day of the week
        const dayOfWeek = new Date(selectedDate).toLocaleString('en-us', { weekday: 'long' });
        const doctorSchedule = schedule.find(s => s.dayOfWeek === dayOfWeek);
        
        if (doctorSchedule) {
            console.log('Doctor schedule for the day:', doctorSchedule);  // Log the specific schedule
            populateTimeSlots(doctorSchedule);
        } else {
            Swal.fire('Unavailable', 'Doctor is not available on this day.', 'info');
            clearTimeSlots();
        }
    } catch (error) {
        console.error('Error fetching doctor schedule:', error);
        Swal.fire('Error', 'Failed to fetch doctor schedule', 'error');
    }
}

// Function to populate available time slots based on doctor's schedule
function populateTimeSlots(doctorSchedule) {
    const timeSlotSelect = document.getElementById('timeSlotSelect');
    timeSlotSelect.innerHTML = ''; // Clear previous options

    if (!doctorSchedule.startTime || !doctorSchedule.endTime) {
        console.error('Invalid doctor schedule:', doctorSchedule);
        Swal.fire('Error', 'Unable to load time slots. Please try again later.', 'error');
        return;
    }

    // Parsing startTime and endTime (expected format: HH:mm:ss)
    const startTime = parseInt(doctorSchedule.startTime.split(':')[0], 10); // Parse start hour
    const endTime = parseInt(doctorSchedule.endTime.split(':')[0], 10);     // Parse end hour

    console.log('Available time range:', startTime, 'to', endTime);  // Log the time range

    for (let hour = startTime; hour < endTime; hour++) {
        // Format the hour to always have 2 digits (e.g., 09:00 instead of 9:00)
        const formattedHour = hour.toString().padStart(2, '0');
        const option = document.createElement('option');
        option.value = `${formattedHour}:00`;
        option.text = `${formattedHour}:00 - ${hour + 1}:00`;
        timeSlotSelect.add(option);
    }
}

// Function to clear the time slots
function clearTimeSlots() {

    debugger;
    const timeSlotSelect = document.getElementById('timeSlotSelect');
    timeSlotSelect.innerHTML = ''; // Clear options
}

// Event listener for date change to fetch available time slots
document.getElementById('appointmentDate').addEventListener('change', function () {
    const selectedDate = this.value;

    // Fetch the userId from localStorage
    const userId = localStorage.getItem('userId'); // Assuming 'userId' is the key used to store the doctor's userId

    if (!userId) {
        Swal.fire('Error', 'Doctor userId not found in local storage.', 'error');
        return;
    }

    fetchDoctorSchedule(userId, selectedDate);
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

    // Sending the appointment data to the API to book the appointment
    const data = new FormData();
    data.append("DoctorID", userId);
    data.append("PatientID", patientId);
    data.append("AppointmentDate", appointmentDateTime);
    data.append("Notes", notes);

    try {
        const response = await fetch('https://localhost:44396/api/Appointments/CreateAppointment', {
            method: 'POST',
            body: data
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire('Success', result.message || 'Appointment created successfully.', 'success');

            // Remove the selected time slot after successful booking
            const timeSlotSelect = document.getElementById('timeSlotSelect');
            const selectedOption = timeSlotSelect.options[timeSlotSelect.selectedIndex];
            selectedOption.remove();
        } else {
            Swal.fire('Error', result.message || 'Failed to create appointment.', 'error');
        }

    } catch (error) {
        console.error('Error creating appointment:', error);
        Swal.fire('Error', 'not available', 'error');
    }
});
