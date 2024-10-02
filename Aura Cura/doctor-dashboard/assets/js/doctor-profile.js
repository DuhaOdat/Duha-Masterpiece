async function loadDoctorProfile() {
    let userId = localStorage.getItem('userId'); // Retrieve the user ID from localStorage
    let token = localStorage.getItem('jwtToken'); // Retrieve the token

    // Ensure the UserId and token exist before fetching data
    if (!userId || !token) {
        console.error("User ID or token missing");
        return;
    }

    let url = `https://localhost:44396/api/Doctors/GetDoctorByUserId/${userId}`; // Correct API URL

    try {
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Include the JWT token in the request
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching Doctor profile: ${response.statusText}`);
        }

        let data = await response.json();
        console.log(data);

        // Populate the profile data in HTML
        document.getElementById('doctor-first-name').textContent = data.firstName || 'N/A';
        document.getElementById('doctor-last-name').textContent = data.lastName || 'N/A';
        document.getElementById('email').textContent = data.email || 'N/A';
        document.getElementById('doctor-biography').textContent = data.biography || 'N/A';
        document.getElementById('doctor-specialty').textContent = data.specialty || 'N/A';
        document.getElementById('doctor-rating').textContent = data.rating || 'N/A';
        document.getElementById('doctor-experience').textContent = data.experienceYears || 'N/A';
        document.getElementById('doctor-education').textContent = data.education || 'N/A';
        document.getElementById('doctor-availability').textContent = data.availabilityStatus ? 'Available' : 'Not Available';

        // Store doctorId for use when updating, check if it's correct
        document.getElementById('editDoctorId').value = data.doctorId;

    } catch (error) {
        console.error("Error fetching doctor data:", error);
    }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", loadDoctorProfile);

// Function to open the modal and load current data into it
function openEditModal() {
    // Load the current values into the modal
    document.getElementById('editFirstName').value = document.getElementById('doctor-first-name').textContent;
    document.getElementById('editLastName').value = document.getElementById('doctor-last-name').textContent;
    document.getElementById('editEmail').value = document.getElementById('email').textContent;
    document.getElementById('editBiography').value = document.getElementById('doctor-biography').textContent;
    document.getElementById('editSpecialty').value = document.getElementById('doctor-specialty').textContent;
    document.getElementById('editRating').value = document.getElementById('doctor-rating').textContent;
    document.getElementById('editExperience').value = document.getElementById('doctor-experience').textContent;
    document.getElementById('editEducation').value = document.getElementById('doctor-education').textContent;
    document.getElementById('editAvailability').value = document.getElementById('doctor-availability').textContent === 'Available' ? 'true' : 'false';

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('editDoctorModal'));
    modal.show();
}

// Function to save changes after editing
document.getElementById('saveDoctorChanges').addEventListener('click', async function() {
    const doctorId = document.getElementById('editDoctorId').value; // Get the doctorId from the hidden input field
    const token = localStorage.getItem('jwtToken'); // Assuming token is saved in localStorage

    const updatedDoctor = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        biography: document.getElementById('editBiography').value,
        specialty: document.getElementById('editSpecialty').value,
        rating: document.getElementById('editRating').value,
        experienceYears: document.getElementById('editExperience').value,
        education: document.getElementById('editEducation').value,
        availabilityStatus: document.getElementById('editAvailability').value === 'true'
    };

    try {
        if (doctorId) {
            let response = await fetch(`https://localhost:44396/api/Doctors/EditDoctor/${doctorId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedDoctor)
            });

            if (response.ok) {
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editDoctorModal'));
                modal.hide();

                // Update the displayed profile data with the new information
                document.getElementById('doctor-first-name').textContent = updatedDoctor.firstName;
                document.getElementById('doctor-last-name').textContent = updatedDoctor.lastName;
                document.getElementById('email').textContent = updatedDoctor.email;
                document.getElementById('doctor-biography').textContent = updatedDoctor.biography;
                document.getElementById('doctor-specialty').textContent = updatedDoctor.specialty;
                document.getElementById('doctor-rating').textContent = updatedDoctor.rating;
                document.getElementById('doctor-experience').textContent = updatedDoctor.experienceYears;
                document.getElementById('doctor-education').textContent = updatedDoctor.education;
                document.getElementById('doctor-availability').textContent = updatedDoctor.availabilityStatus ? 'Available' : 'Not Available';

                alert('Doctor profile updated successfully!');
            } else {
                alert('Failed to update doctor profile.');
            }
        } else {
            console.error("Doctor ID is undefined");
            alert('An error occurred while updating the doctor profile.');
        }
    } catch (error) {
        console.error('Error updating doctor profile:', error);
        alert('An error occurred while updating the doctor profile.');
    }
});
