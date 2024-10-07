document.addEventListener('DOMContentLoaded', async function () {
    const userId = localStorage.getItem('userId'); // احصل على الـ UserId من localStorage
    const token = localStorage.getItem('jwtToken');

    // Load Patient Points and Donation Requests
    loadPatientPoints(userId, token);
    loadPendingDonationRequests(userId, token);
});

// Load Patient Points
async function loadPatientPoints(userId, token) {
    try {
        const response = await fetch(`https://localhost:44396/api/bloodDonation/GetPatientPointByUserId/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch points data.');
        }

        const data = await response.json();
        console.log(data);

        if (data && data.currentPoints !== undefined && data.totalPoints !== undefined) {
            document.getElementById('currentPoints').innerText = `Your Current Points: ${data.currentPoints} / ${data.totalPoints}`;
            const progressPercentage = (data.currentPoints / data.totalPoints) * 100;
            document.getElementById('progress').style.width = `${progressPercentage}%`;
        } else {
            document.getElementById('currentPoints').innerText = 'Points data is unavailable.';
        }

    } catch (error) {
        console.error(error);
        document.getElementById('currentPoints').innerText = 'Failed to load points data.';
    }
}

// Load Pending Donation Requests
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

        if (requests.length === 0) {
            container.innerHTML = '<p class="no-requests">No pending requests found.</p>';
        } else {
            requests.forEach(request => {
                const preferredDate = request.preferredDonationDate
                    ? new Date(request.preferredDonationDate).toLocaleDateString()
                    : 'Not specified'; // If the preferred donation date is not set
                
                const card = `
                    <div class="request-card">
                        <div class="request-header">Request Date: ${new Date(request.requestDate).toLocaleDateString()}</div>
                        <div class="request-info">
                            <p><strong>Blood Type:</strong> ${request.bloodType}</p>
                            <p><strong>Preferred Donation Date:</strong> ${preferredDate}</p>
                            <p><strong>Status:</strong> <span class="status pending">${request.status}</span></p>
                            <p><strong>Notes:</strong> ${request.notes ? request.notes : 'No additional notes'}</p>
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

