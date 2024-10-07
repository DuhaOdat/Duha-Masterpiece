document.getElementById('createAppointmentForm').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent the default form submission

    const formData = new FormData(event.target);  // Create FormData from the form

    try {
        const response = await fetch('https://localhost:44396/api/Appointments/CreateAppointment', {
            method: 'POST',
            body: formData  // Use FormData directly in the body
        });

        const data = await response.json();  // Parse JSON response

        if (response.ok) {
            alert(data.message);  // Show success message
        } else {
            alert('Error: ' + data.message);  // Handle error case
        }
    } catch (error) {
        console.error('Error:', error);  // Log errors
        alert('Failed to create appointment.');
    }
});
