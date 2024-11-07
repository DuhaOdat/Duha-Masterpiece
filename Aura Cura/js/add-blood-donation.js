
document.addEventListener('DOMContentLoaded', async function () {
    const userId = localStorage.getItem('userId'); // Assume the user's ID is stored in local storage
    const token = localStorage.getItem('jwtToken'); // Assume token is stored for authentication

    try {
        // Fetch user and patient profile data using the GetUserProfile API
        const response = await fetch(`https://localhost:44396/api/bloodDonation/GetUserProfile/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Unable to fetch user data');
        }

        const userData = await response.json();
        
        // Prefill the form with user's full name, blood type, and email
        document.getElementById('fullName').value = userData.fullName;
        document.getElementById('bloodType').value = userData.bloodType;
        document.getElementById('emailAddress').value = userData.email;

    } catch (error) {
        console.error('Error fetching user data:', error);
        
        // Use SweetAlert to display the error message
        // Swal.fire({
        //     icon: 'error',
        //     title: 'Oops...',
        //     text: 'Unable to load user information. Please try again.',
        //     confirmButtonText: 'OK'
        // });
    }
});


// Handle form submission
document.getElementById('bloodDonationForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission

    const notes = document.getElementById('comments')?.value || ''; // Add additional info or comments if needed
    const patientId = localStorage.getItem('userId'); // Assume user is logged in and ID is in localStorage

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('PatientId', patientId);
    formData.append('Notes', notes);

    try {
        // Send the blood donation request
        const response = await fetch('https://localhost:44396/api/bloodDonation/SubmitBloodDonationRequest', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error submitting the request');
        }

        // Use SweetAlert to show the success message with a confirmation button
        Swal.fire({
            icon: 'success',
            title: 'Request Submitted!',
            html: `Blood donation request submitted successfully!<br> Request ID: ${data.requestId}.<br>Your preferred donation date is <strong>${data.preferredDonationDate}</strong>.`,
            confirmButtonText: 'OK'
        });

    } catch (error) {
        // Use SweetAlert to display the error message
        Swal.fire({
            icon: 'error',
            title: 'Submission Failed!',
            text: error.message || 'An error occurred. Please try again.',
            confirmButtonText: 'OK'
        });
    }
});
