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

        if (!response.ok) throw new Error('Failed to fetch claimed rewards.');

        const claimedRewards = await response.json();
        const tbody = document.getElementById('claimedRewardsTableBody');
        tbody.innerHTML = ''; // Clear existing rows

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
        alert('Failed to load claimed rewards.');
    }
}

// Load claimed rewards on page load
document.addEventListener('DOMContentLoaded', loadClaimedRewards);