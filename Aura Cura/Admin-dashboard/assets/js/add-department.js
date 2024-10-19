document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form elements
    const departmentName = document.getElementById('departmentName').value;
    const description = document.getElementById('description').value;
    const beds = document.getElementById('beds').value;
    const numberOfRooms = document.getElementById('numberOfRooms').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const image = document.getElementById('image').files[0]; // Get the file object

    // Create a FormData object to hold form data
    const formData = new FormData();
    formData.append('DepartmentName', departmentName);
    formData.append('DepartmentDescription', description);
    formData.append('NumberOfBeds', beds);
    formData.append('NumberOfRooms', numberOfRooms);
    formData.append('Phone', phoneNumber);
    formData.append('Image', image); // Image file

    try {
        // Send the form data via a POST request to your API
        const response = await fetch('https://localhost:44396/api/departments/AddNewDepartment', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to add department');
        }

        const data = await response.json();
        alert('Department added successfully!');
        // Optionally: clear the form or redirect to another page
        document.querySelector('form').reset(); // Reset form
    } catch (error) {
        console.error('Error adding department:', error);
        alert('Failed to add department');
    }
});
