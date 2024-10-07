document.addEventListener('DOMContentLoaded', async function () {
    const userId = localStorage.getItem('userId'); // Get the UserId from localStorage
    const token = localStorage.getItem('jwtToken');

    try {
        // Fetch patient's points from the API
        const response = await fetch(`https://localhost:44396/api/bloodDonation/GetPatientPointByUserId/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Check if the API response is OK
        if (!response.ok) {
            throw new Error('Failed to fetch points data.');
        }

        const data = await response.json();
        const currentPoints = data.currentPoints;
        console.log('Current Points:', currentPoints);

        // Show rewards based on points
        displayRewardsBasedOnPoints(currentPoints);

    } catch (error) {
        console.error(error);
        alert('Failed to load points data.');
    }
});

// Function to show/hide rewards based on points
function displayRewardsBasedOnPoints(points) {
    // Rewards thresholds
    const rewardThresholds = [
        { id: 'reward1', pointsRequired: 100 },
        { id: 'reward2', pointsRequired: 150 },
        { id: 'reward3', pointsRequired: 200 },
        { id: 'reward4', pointsRequired: 250 },
        { id: 'reward5', pointsRequired: 500 },
        { id: 'reward6', pointsRequired: 600 },
    ];

    // Iterate over each reward and show/hide based on points
    rewardThresholds.forEach(reward => {
        const rewardElement = document.getElementById(reward.id);
        if (points >= reward.pointsRequired) {
            rewardElement.style.opacity = 1; // Show reward (fully visible)
        } else {
            rewardElement.style.opacity = 0.5; // Dim or hide reward (not available)
            rewardElement.querySelector('.card-body').innerHTML += '<p class="text-muted">Not enough points</p>';
        }
    });
}
