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
            // Check for a 404 response (not found) to show a clear message
            if (response.status === 404) {
                document.getElementById('approvedRequestsBody').innerHTML = '<tr><td colspan="6">No previous  requests found for this user.</td></tr>';
                return;
            }
            throw new Error('Failed to fetch approved requests.');
        }

        const approvedRequests = await response.json();

        // Get the table body element
        const tableBody = document.getElementById('approvedRequestsBody');

        if (approvedRequests.length === 0) {
            // No approved requests
            tableBody.innerHTML = '<tr><td colspan="6">No previous requests found.</td></tr>';
        } else {
            // Populate table with approved requests
            approvedRequests.forEach(request => {
                const row = `
                    <tr>
                        <td>${new Date(request.requestDate).toLocaleDateString()}</td>
                        <td>${request.donationDate ? new Date(request.donationDate).toLocaleDateString() : 'Invalid Date'}</td>
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
