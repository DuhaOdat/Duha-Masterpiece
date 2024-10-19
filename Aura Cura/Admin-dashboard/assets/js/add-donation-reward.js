 // Function to handle form submission for adding a reward
 document.getElementById('rewardForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const rewardName = document.getElementById('rewardName').value;
    const pointsRequired = document.getElementById('pointsRequired').value;
    const rewardDescription = document.getElementById('rewardDescription').value;

    // Validate form inputs
    if (!rewardName || !pointsRequired || isNaN(pointsRequired)) {
        alert('Please fill in all required fields with valid values.');
        return;
    }

    try {
        // Create FormData object
        const formData = new FormData();
        formData.append('RewardName', rewardName);
        formData.append('Description', rewardDescription);
        formData.append('PointsRequired', pointsRequired);

        // Make the POST request to add the reward
        const response = await fetch('https://localhost:44396/api/bloodDonation/addReward', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        alert(result.message);

        // Optionally, reset the form after successful submission
        document.getElementById('rewardForm').reset();

        // Optionally, refresh the reward list if displayed
        // fetchRewards(); // Uncomment this line if you want to reload the rewards list

    } catch (error) {
        console.error('Error adding reward:', error);
        alert('Failed to add the reward.');
    }
  });