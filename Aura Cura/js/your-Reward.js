// Function to load claimed rewards for the current user
async function loadClaimedRewards() {
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');

    try {
        // Fetch claimed rewards data from API
        const response = await fetch(`https://localhost:44396/api/bloodDonation/getClaimedRewards/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Handle 404 response (No rewards found)
            if (response.status === 404) {
                const tbody = document.getElementById('claimedRewardsTableBody');
                tbody.innerHTML = '<tr><td colspan="6">No claimed rewards found.</td></tr>';
                return;
            }
            throw new Error('Failed to fetch claimed rewards.');
        }

        const claimedRewards = await response.json();
        const tbody = document.getElementById('claimedRewardsTableBody');
        tbody.innerHTML = ''; // Clear existing rows

        // Check if there are no claimed rewards
        if (claimedRewards.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No claimed rewards found.</td></tr>';
            return;
        }

        // Populate the table with claimed rewards
        claimedRewards.forEach((claim, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${claim.rewardName}</td>
                <td>${claim.description}</td>
                <td>${claim.pointsRequired}</td>
                <td>${claim.collectedDate ? new Date(claim.collectedDate).toLocaleDateString() : 'N/A'}</td>
                <td>${claim.isCollected ? 'Collected' : 'Pending Collection'}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading claimed rewards:', error);
        const tbody = document.getElementById('claimedRewardsTableBody');
        tbody.innerHTML = '<tr><td colspan="6">Failed to load claimed rewards. Please try again later.</td></tr>';
    }
}

// Load claimed rewards on page load
document.addEventListener('DOMContentLoaded', loadClaimedRewards);
