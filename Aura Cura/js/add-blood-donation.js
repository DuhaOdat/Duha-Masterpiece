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
        document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger"> Please Fill all field.</div>`;
    }
});

// Handle form submission
document.getElementById('bloodDonationForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission

    const donationDate = document.getElementById('donationDate').value;
    const notes = document.getElementById('comments')?.value || ''; // Add additional info or comments if needed
    const patientId = localStorage.getItem('userId'); // Assume user is logged in and ID is in localStorage

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('PatientId', patientId);
    formData.append('PreferredDonationDate', donationDate);
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

        // Display success message
        document.getElementById('responseMessage').innerHTML = `<div class="alert alert-success">Blood donation request submitted successfully! Request ID: ${data.requestId}</div>`;
    } catch (error) {
        // Display error message
        document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
});
