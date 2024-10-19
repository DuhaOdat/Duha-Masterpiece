  // Function to fetch doctor schedule based on user ID stored in local storage
  async function fetchDoctorSchedule() {
    // Fetch the userId from local storage
    const doctorId = localStorage.getItem('userId');

    if (!doctorId) {
        Swal.fire('Error', 'Doctor userId not found in local storage.', 'error');
        return;
    }

    try {
        const response = await fetch(`https://localhost:44396/api/Appointments/GetDoctorSchedule/${doctorId}`);
        const schedule = await response.json();

        if (!response.ok) {
            Swal.fire('Error', schedule, 'error');
            return;
        }

        console.log('Doctor Schedule:', schedule); // Debugging

        // Clear the table before populating
        const tableBody = document.querySelector('#scheduleTable tbody');
        tableBody.innerHTML = '';

        if (schedule.length === 0) {
            Swal.fire('No Schedule', 'No schedule found for this doctor.', 'info');
            return;
        }

        // Populate the table with the schedule data
        schedule.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.dayOfWeek}</td>
                <td>${item.startTime}</td>
                <td>${item.endTime}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching schedule:', error);
        Swal.fire('Error', 'Failed to fetch doctor schedule', 'error');
    }
}