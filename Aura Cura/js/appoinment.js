const patientId = localStorage.getItem('userId');

// Toggle between Past and Future Appointments
function toggleAppointments(type) {
    const pastSection = document.getElementById('past-appointments-section');
    const futureSection = document.getElementById('future-appointments-section');
    const pastBtn = document.getElementById('pastBtn');
    const futureBtn = document.getElementById('futureBtn');

    if (type === 'past') {
        pastSection.classList.add('active');
        futureSection.classList.remove('active');
        pastBtn.classList.add('active');
        futureBtn.classList.remove('active');
    } else {
        pastSection.classList.remove('active');
        futureSection.classList.add('active');
        pastBtn.classList.remove('active');
        futureBtn.classList.add('active');
    }
}

// Function to fetch and display past appointments
async function fetchPastAppointments() {
    try {
        const response = await fetch(`https://localhost:44396/api/Appointments/GetPastAppointments/${patientId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const pastAppointments = await response.json();
        const pastAppointmentsDiv = document.getElementById('past-appointments');
        pastAppointmentsDiv.innerHTML = '';

        if (pastAppointments.length > 0) {
            pastAppointments.forEach(appointment => {
                const appointmentElement = document.createElement('div');
                appointmentElement.classList.add('appointment-card');
                appointmentElement.innerHTML = `
                    <p><strong>Doctor:</strong> ${appointment.doctorName || 'N/A'}</p>
                    <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleString()}</p>
                    <p><strong>Status:</strong> ${appointment.status}</p>
                    <p><strong>Notes:</strong> ${appointment.notes || 'No notes available'}</p>
                `;
                pastAppointmentsDiv.appendChild(appointmentElement);
            });
        } else {
            pastAppointmentsDiv.innerHTML = '<p class="no-appointments">No past appointments found.</p>';
        }
    } catch (error) {
        console.error('Error fetching past appointments:', error);
    }
}

// Function to fetch and display upcoming appointments
async function fetchUpcomingAppointments() {
    try {
        const response = await fetch(`https://localhost:44396/api/Appointments/GetUpcomingAppointments/${patientId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const upcomingAppointments = await response.json();
        const upcomingAppointmentsDiv = document.getElementById('upcoming-appointments');
        upcomingAppointmentsDiv.innerHTML = '';

        if (upcomingAppointments.length > 0) {
            upcomingAppointments.forEach(appointment => {
                const appointmentElement = document.createElement('div');
                appointmentElement.classList.add('appointment-card');
                appointmentElement.innerHTML = `
                    <p><strong>Doctor:</strong> ${appointment.doctorName || 'N/A'}</p>
                    <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleString()}</p>
                    <p><strong>Status:</strong> ${appointment.status}</p>
                    <p><strong>Notes:</strong> ${appointment.notes || 'No notes available'}</p>
                `;
                upcomingAppointmentsDiv.appendChild(appointmentElement);
            });
        } else {
            upcomingAppointmentsDiv.innerHTML = '<p class="no-appointments">No upcoming appointments found.</p>';
        }
    } catch (error) {
        console.error('Error fetching upcoming appointments:', error);
    }
}

// Call the fetch functions automatically when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    await fetchPastAppointments();
    await fetchUpcomingAppointments();
});