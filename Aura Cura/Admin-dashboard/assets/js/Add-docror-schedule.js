// Function to validate the time selection
function validateTimeSelection(startTime, endTime) {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    
    return end > start; // Ensure that end time is greater than start time
}

// Function to handle form submission
async function addDoctorSchedule(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const doctorId = document.getElementById('doctorId').value;
    const dayOfWeek = document.getElementById('dayOfWeek').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    // Validate time selection
    if (!validateTimeSelection(startTime, endTime)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Time Selection',
            text: 'End time must be greater than start time and not equal.',
        });
        return; // Prevent form submission if validation fails
    }

    // Proceed with the API call to add the new schedule
    const formData = new FormData();
    formData.append('DoctorId', doctorId);
    formData.append('DayOfWeek', dayOfWeek);
    formData.append('StartTime', startTime);
    formData.append('EndTime', endTime);

    console.log('DoctorId:', doctorId);
    console.log('DayOfWeek:', dayOfWeek);
    console.log('StartTime:', startTime);
    console.log('EndTime:', endTime);

    if (!doctorId || !dayOfWeek || !startTime || !endTime) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Data',
            text: 'Please ensure all fields are filled in.',
        });
        return; // Stop execution if validation fails
    }

    try {
        const addScheduleResponse = await fetch('https://localhost:44396/api/Doctorschedules/AddDoctorSchedule', {
            method: 'POST',
            body: formData // Send form data
        });

        if (!addScheduleResponse.ok) {
            const errorData = await addScheduleResponse.json(); // Handle cases when there's a valid JSON error response
            Swal.fire({
                icon: 'error',
                title: 'Schedule Conflict',
                text: errorData.message || 'Failed to add doctor schedule due to conflict.',
            });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Doctor schedule added successfully!',
        });

    } catch (error) {
        console.error('Error adding doctor schedule:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while adding the doctor schedule.',
        });
    }
}

// Add event listener to the form's submit event
const form = document.getElementById('doctorScheduleForm');
form.addEventListener('submit', addDoctorSchedule);

// Function to fetch doctor options
async function fetchDoctors() {
    try {
        const response = await fetch('https://localhost:44396/api/Doctors/AllDoctors');
        const doctors = await response.json();

        const doctorSelect = document.getElementById('doctorId');
        doctorSelect.innerHTML = ''; // Clear existing options

        // Add a default placeholder option
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.text = 'Select Doctor';
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        doctorSelect.appendChild(placeholderOption);

        // Populate the doctor dropdown with id as value
        doctors.forEach(doctor => {
            console.log(doctor);
            const option = document.createElement('option');
            option.value = doctor.doctorId; // Use doctorId as value
            option.text = doctor.fullName; // Display fullName in the dropdown
            doctorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}

// Call fetchDoctors to populate doctor dropdown when the page loads
window.onload = fetchDoctors;
