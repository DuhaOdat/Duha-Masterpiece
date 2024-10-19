// Function to fetch doctor options and populate the dropdown
async function fetchDoctors() {
    try {
        const response = await fetch('https://localhost:44396/api/Doctors/AllDoctors');
        const doctors = await response.json();

        const doctorSelect = document.getElementById('doctorId');
        if (!doctorSelect) {
            console.error('Doctor select element not found');
            return;
        }

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
            const option = document.createElement('option');
            option.value = doctor.doctorId; // Use doctorId as value
            option.text = doctor.fullName; // Display fullName in the dropdown
            doctorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}

// Function to fetch and display doctor schedules
async function fetchDoctorSchedules() {
    try {
        const response = await fetch('https://localhost:44396/api/Doctorschedules/GetDoctorSchedules');
        const schedules = await response.json();

        const scheduleTableBody = document.getElementById('scheduleTableBody');
        if (!scheduleTableBody) {
            console.error('Schedule table body element not found');
            return;
        }

        scheduleTableBody.innerHTML = ''; // Clear existing rows

        // Iterate through the fetched schedules and add them to the table
        schedules.forEach(schedule => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${schedule.doctor?.fullName || 'Doctor not available'}</td>
                <td>${schedule.dayOfWeek}</td>
                <td>${schedule.startTime}</td>
                <td>${schedule.endTime}</td>
                <td>
                    <button class="btn btn-warning" onclick="openEditModal(${schedule.scheduleId})">Edit</button>
                    <button class="btn btn-danger" onclick="openDeleteModal(${schedule.scheduleId})">Delete</button>
                </td>
            `;
            scheduleTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching doctor schedules:', error);
    }
}

// Example of how to open the edit modal and populate the fields with current values
async function openEditModal(scheduleId) {
    try {
        const response = await fetch(`https://localhost:44396/api/Doctorschedules/GetDoctorSchedule/${scheduleId}`);
        const schedule = await response.json();
        console.log(schedule); // Ensure the schedule is being logged correctly

        // Access the doctorFullName field from the schedule object
        if (schedule.doctorFullName) {
            document.getElementById('editDoctorName').value = schedule.doctorFullName; // Display doctor name
        } else {
            document.getElementById('editDoctorName').value = 'Doctor information not available';
        }

        document.getElementById('editDayOfWeek').value = schedule.dayOfWeek; // Display day of the week (readonly)
        document.getElementById('editStartTime').value = schedule.startTime; // Editable start time
        document.getElementById('editEndTime').value = schedule.endTime; // Editable end time
        document.getElementById('editScheduleId').value = scheduleId; // Hidden input to store schedule ID

        // Show the modal
        $('#editScheduleModal').modal('show');
    } catch (error) {
        Swal.fire('Error', 'Failed to fetch schedule details for editing.', 'error');
        console.error('Error fetching schedule:', error);
    }
}



// Form submission logic for editing the schedule
document.getElementById('editScheduleForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    const scheduleId = document.getElementById('editScheduleId').value;
    const startTime = document.getElementById('editStartTime').value;
    const endTime = document.getElementById('editEndTime').value;

    // Ensure times are valid
    if (!startTime || !endTime) {
        Swal.fire('Error', 'Please provide valid start and end times.', 'error');
        return;
    }

    // Create FormData to send the updated data
    const formData = new FormData();
    formData.append('StartTime', startTime);
    formData.append('EndTime', endTime);

    try {
        const response = await fetch(`https://localhost:44396/api/Doctorschedules/UpdateDoctorSchedule/${scheduleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const responseData = await response.json();
        console.log('API Response:', responseData);
        if (response.ok) {
            Swal.fire('Success', 'Doctor schedule updated successfully!', 'success');
            $('#editScheduleModal').modal('hide'); // Hide the modal
            fetchDoctorSchedules(); // Refresh the schedule list
        } else {
            const errorData = await response.json(); // Get error message
            Swal.fire('Error', errorData.message || 'Failed to update doctor schedule', 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'An error occurred while updating the schedule.', 'error');
        console.error('Error updating schedule:', error);
    }
});

// Function to open the delete confirmation modal
function openDeleteModal(scheduleId) {
    scheduleToDelete = scheduleId; // Store the schedule ID
    $('#deleteScheduleModal').modal('show'); // Show the delete confirmation modal
}

// Function to handle schedule deletion
async function deleteSchedule() {
    if (!scheduleToDelete) {
        Swal.fire('Error', 'No schedule selected for deletion.', 'error');
        return;
    }

    try {
        const response = await fetch(`https://localhost:44396/api/Doctorschedules/DeleteDoctorSchedule/${scheduleToDelete}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            Swal.fire('Success', 'Doctor schedule deleted successfully!', 'success');
            $('#deleteScheduleModal').modal('hide'); // Hide the modal after deletion
            fetchDoctorSchedules(); // Refresh the schedule list after deletion
        } else {
            throw new Error('Failed to delete doctor schedule');
        }
    } catch (error) {
        Swal.fire('Error', 'An error occurred while deleting the schedule.', 'error');
        console.error('Error deleting schedule:', error);
    }
}

// Attach event listener to the confirm delete button
document.getElementById('confirmDeleteButton').addEventListener('click', deleteSchedule);

// Call fetchDoctors and fetchDoctorSchedules when the page loads to display the schedules and populate the dropdown
window.onload = () => {
    console.log(document.getElementById('doctorId')); // Check if element is found
    fetchDoctors(); // Fetch doctors for the dropdown
    fetchDoctorSchedules(); // Fetch and display doctor schedules
};
