document.addEventListener('DOMContentLoaded', async function () {
    const userId = localStorage.getItem('userId'); // احصل على الـ UserId من localStorage
    const token = localStorage.getItem('jwtToken');

    // Load  Donation Requests
   
    loadPendingDonationRequests(userId, token);
});



async function loadPendingDonationRequests(userId, token) {
    try {
        const response = await fetch(`https://localhost:44396/api/bloodDonation/GetPendingBloodDonationRequests/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch donation requests.');
        }

        const requests = await response.json();
        const container = document.getElementById('donationRequests');
        container.innerHTML = ''; // Clear any previous entries

        if (requests.length === 0) {
            container.innerHTML = '<p class="no-requests">No pending requests found.</p>';
        } else {
            requests.forEach(request => {
                const preferredDate = request.preferredDonationDate
                    ? new Date(request.preferredDonationDate).toLocaleDateString()
                    : 'Not specified';

                const card = `
                    <div class="request-card">
                        <div class="request-header">Request Date: ${new Date(request.requestDate).toLocaleDateString()}</div>
                        <div class="request-info">
                            <p><strong>Blood Type:</strong> ${request.bloodType}</p>
                            <p><strong>Preferred Donation Date:</strong> ${preferredDate}</p>
                            <p><strong>Status:</strong> <span class="status pending">${request.status}</span></p>
                            <button class="btn btn-danger btn-sm" onclick="deleteRequest(${request.requestId})">Delete</button>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });
        }

    } catch (error) {
        console.error('Error fetching donation requests:', error);
        document.getElementById('donationRequests').innerHTML = '<p class="no-requests">Failed to load requests. Please try again later.</p>';
    }
}



async function deleteRequest(requestId) {
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');
    console.log("Attempting to delete request with ID:", requestId); // Log to verify

    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete this pending request?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`https://localhost:44396/api/bloodDonation/DeleteBloodDonationRequest/${requestId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete the request.');
            }

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Your pending request has been deleted.',
                confirmButtonText: 'OK'
            });

            loadPendingDonationRequests(userId, token); // Reload the list to reflect deletion

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'An error occurred. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    }
}







document.addEventListener('DOMContentLoaded', async function () {
    const userId = localStorage.getItem('userId'); // Get the UserId from localStorage
    const token = localStorage.getItem('jwtToken'); // Get JWT Token

    try {
        // Fetch approved blood donation requests from the API
        const response = await fetch(`https://localhost:44396/api/bloodDonation/GetApprovedBloodDonationRequests/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch approved requests.');
        }

        const approvedRequests = await response.json();

        // Get the table body element
        const tableBody = document.getElementById('approvedRequestsBody');

        if (approvedRequests.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">No approved requests found.</td></tr>';
        } else {
            approvedRequests.forEach(request => {
                const row = `
                    <tr>
                        <td>${new Date(request.requestDate).toLocaleDateString()}</td>
                       
                        <td>${request.donationDate ? new Date(request.donationDate).toLocaleDateString() : 'Invalid Date'}</td>
                        <td><span class="status approved">${request.status}</span></td>
                        <td>${request.notes ? request.notes : 'No comments'}</td>
                        <td>${request.rewardPoints}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }

    } catch (error) {
        console.error('Error fetching approved requests:', error);
        document.getElementById('approvedRequestsBody').innerHTML = '<tr><td colspan="6">Failed to load approved requests. Please try again later.</td></tr>';
    }
});

