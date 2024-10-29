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

// Function to fetch and display appointments using async/await
async function fetchDoctorAppointments() {
    try {
        // Assuming the userId is stored in local storage
        const userId = localStorage.getItem('userId'); 

        // Fetch DoctorID based on UserID
        const doctorId = await getDoctorIdFromUserId(userId);
        if (!doctorId) {
            console.error('DoctorID not found');
            return;
        }

        // Fetch appointments using DoctorID
        const response = await fetch(`https://localhost:44396/api/Appointments/GetAllDoctorAppointmentsBydoctorId/${doctorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log(data);

        const tableBody = document.querySelector('#appointmentTable tbody');
        tableBody.innerHTML = ''; // Clear any existing rows

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center">No appointments found</td></tr>';
            return;
        }

        data.forEach((appointment, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${appointment.appointmentId}</td>
                <td>${appointment.patientName}</td>
                <td>${appointment.doctorName}</td>
                <td>${new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                <td>${appointment.status}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="confirmDelete(${appointment.appointmentId})">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}

// Function to confirm delete and show the modal
async function confirmDelete(appointmentId) {
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteAppointmentModal'), {});
    deleteModal.show();

    const confirmButton = document.querySelector('#deleteAppointmentModal .btn-danger');
    confirmButton.onclick = async function() {
        await deleteAppointment(appointmentId);
        deleteModal.hide();
    };
}

// Function to delete the appointment using async/await
async function deleteAppointment(appointmentId) {
    try {
        const response = await fetch(`https://localhost:44396/api/Appointments/DeleteAppointment/${appointmentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        
        alert('Appointment deleted successfully!');
        location.reload(); // Reload the page to refresh the table
    } catch (error) {
        console.error('Error deleting appointment:', error);
    }
}

// Call the function to fetch and display appointments when the page loads
fetchDoctorAppointments();
