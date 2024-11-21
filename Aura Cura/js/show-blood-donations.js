document.addEventListener('DOMContentLoaded', function () {
    loadDonationRequests('pending'); // Default to loading pending requests
});

async function loadDonationRequests(status) {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    const token = localStorage.getItem('jwtToken'); // Get JWT Token
    const container = document.getElementById('donationRequests'); // Container to display requests

    if (!container) {
        console.error('Container with ID "donationRequests" not found.');
        return;
    }

    container.innerHTML = '<p>Loading...</p>';

    let apiEndpoint = '';
    if (status === 'pending') {
        apiEndpoint = `https://localhost:44396/api/bloodDonation/GetPendingBloodDonationRequests/${userId}`;
    } else if (status === 'approved') {
        apiEndpoint = `https://localhost:44396/api/bloodDonation/GetApprovedBloodDonationRequestswithoutConfirm/${userId}`;
    } else if (status === 'rejected') {
        apiEndpoint = `https://localhost:44396/api/bloodDonation/GetRejectedBloodDonationRequests/${userId}`;
    } else {
        console.error('Invalid status type.');
        return;
    }

    try {
        const response = await fetch(apiEndpoint, {
            headers: {
                
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${status} requests.`);
        }

        const requests = await response.json();
        container.innerHTML = '';

        if (requests.length === 0) {
            container.innerHTML = `<p class="no-requests">No ${status} requests found.</p>`;
            return;
        }

        requests.forEach((request) => {
            const preferredDate = request.preferredDonationDate
                ? new Date(request.preferredDonationDate).toLocaleDateString()
                : 'Not specified';

            const deleteButton =
                status === 'pending'
                    ? `<button class="btn btn-danger btn-sm" onclick="deleteRequest(${request.requestId})">Delete</button>`
                    : '';

            const card = `
                <div class="request-card">
                    <div class="request-header">Request Date: ${new Date(request.requestDate).toLocaleDateString()}</div>
                    <div class="request-info">
                        <p><strong>Blood Type:</strong> ${request.bloodType || 'Unknown'}</p>
                        <p><strong>Preferred Donation Date:</strong> ${preferredDate}</p>
                        <p><strong>Status:</strong> <span class="status ${status}">${request.status}</span></p>
                        <p><strong>Notes:</strong> ${request.notes || 'No notes available'}</p>
                        ${deleteButton}
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error(`Error loading ${status} donation requests:`, error);
        container.innerHTML = `<p class="no-requests">No ${status} requests Found.</p>`;
    }
}

async function deleteRequest(requestId) {
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');

    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this pending request?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`https://localhost:44396/api/bloodDonation/DeleteBloodDonationRequest/${requestId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete the request.');
            }

            Swal.fire('Deleted!', 'Your pending request has been deleted.', 'success');
            loadDonationRequests('pending'); // Reload pending requests
        } catch (error) {
            Swal.fire('Error!', 'An error occurred. Please try again.', 'error');
        }
    }
}
