// Function to fetch Patient ID using User ID from localStorage
async function getPatientId() {
    const userId = localStorage.getItem('userId');
    console.log("User ID from localStorage:", userId); 
    if (!userId) {
        console.error("User ID not found in localStorage.");
        return null;
    }

    try {
        const response = await fetch(`https://localhost:44396/api/Appointments/GetPatientIdByUserId/${userId}`);
        console.log("API Response Status:", response.status); 
        if (!response.ok) {
            throw new Error(`Error fetching patient ID: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data from API:", data); 
        return data.patientId; 
    } catch (error) {
        console.error("Error fetching patient ID:", error);
        return null;
    }
}


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
async function fetchPastAppointments(patientId) {
    console.log("Fetching past appointments for Patient ID:", patientId);
    try {
        const response = await fetch(`https://localhost:44396/api/Appointments/GetPastAppointments/${patientId}`);
        
        // إذا كانت الحالة 404، عرض الرسالة الافتراضية
        if (response.status === 404) {
            console.warn('No past appointments found.');
            const pastAppointmentsDiv = document.getElementById('past-appointments');
            pastAppointmentsDiv.innerHTML = `
                <div class="no-appointments-message">
                    <p>No past appointments found.</p>
                </div>
            `;
            return;
        }

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const pastAppointments = await response.json();
        const pastAppointmentsDiv = document.getElementById('past-appointments');
        pastAppointmentsDiv.innerHTML = ''; // Clear previous content

        if (pastAppointments.length > 0) {
            pastAppointments.forEach(appointment => {
                const appointmentElement = document.createElement('div');
                appointmentElement.classList.add('appointment-card');
                appointmentElement.innerHTML = `
                    <p><strong>Doctor:</strong> ${appointment.doctorName || 'N/A'}</p>
                    <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleString()}</p>
                    <p><strong>Notes:</strong> ${appointment.notes || 'No notes available'}</p>
                `;
                pastAppointmentsDiv.appendChild(appointmentElement);
            });
        } else {
            // Add a default message when no appointments exist
            pastAppointmentsDiv.innerHTML = `
                <div class="no-appointments-message">
                    <p>No past appointments found.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching past appointments:', error);
    }
}


// Function to fetch and display upcoming appointments
async function fetchUpcomingAppointments(patientId) {
    console.log("Fetching upcoming appointments for Patient ID:", patientId);
    try {
        const response = await fetch(`https://localhost:44396/api/Appointments/GetUpcomingAppointments/${patientId}`);
        
        // إذا كانت الحالة 404، عرض الرسالة الافتراضية
        if (response.status === 404) {
            console.warn('No upcoming appointments found.');
            const upcomingAppointmentsDiv = document.getElementById('upcoming-appointments');
            upcomingAppointmentsDiv.innerHTML = `
                <div class="no-appointments-message">
                    <p>No upcoming appointments found.</p>
                </div>
            `;
            return;
        }

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const upcomingAppointments = await response.json();
        const upcomingAppointmentsDiv = document.getElementById('upcoming-appointments');
        upcomingAppointmentsDiv.innerHTML = ''; // Clear previous content

        if (upcomingAppointments.length > 0) {
            upcomingAppointments.forEach(appointment => {
                const appointmentElement = document.createElement('div');
                appointmentElement.classList.add('appointment-card');
                appointmentElement.innerHTML = `
                    <p><strong>Doctor:</strong> ${appointment.doctorName || 'N/A'}</p>
                    <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleString()}</p>
                    <p><strong>Notes:</strong> ${appointment.notes || 'No notes available'}</p>
                `;
                upcomingAppointmentsDiv.appendChild(appointmentElement);
            });
        } else {
            // Add a default message when no appointments exist
            upcomingAppointmentsDiv.innerHTML = `
                <div class="no-appointments-message">
                    <p>No upcoming appointments found.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching upcoming appointments:', error);
    }
}

// Call the fetch functions automatically when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const patientId = await getPatientId();
        if (patientId) {
            console.log("Patient ID successfully retrieved:", patientId);
            // Pass patientId to fetchPastAppointments and fetchUpcomingAppointments
            await fetchPastAppointments(patientId);
            await fetchUpcomingAppointments(patientId);
        } else {
            console.error("Unable to fetch patient ID. Appointments cannot be loaded.");
        }
    } catch (error) {
        console.error("An error occurred while loading appointments:", error);
    }
});
