// Function to fetch all rewards and populate the reward cards dynamically
async function fetchRewards() {
    try {
        // Make a GET request to your API to get all rewards
        const response = await fetch('https://localhost:44396/api/bloodDonation/getAllRewards', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the JSON response
        const rewards = await response.json();

        // Log the API response to inspect its structure
        console.log('Rewards API Response:', rewards);

        // Populate the reward cards with fetched rewards
        renderRewards(rewards);
    } catch (error) {
        console.error('Error fetching rewards:', error);
    }
}

// Function to dynamically populate the reward cards
function renderRewards(rewards) {
    const rewardsContainer = document.getElementById('rewardsContainer');

    // Clear the container before adding new rewards
    rewardsContainer.innerHTML = '';

    // Iterate through the rewards array and populate the reward cards
    rewards.forEach((reward) => {
        const rewardCard = `
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-body text-center">
                        <h5 class="card-title">${reward.rewardName}</h5>
                        <p class="card-text">${reward.description}</p>
                        <p class="text-primary">Points Required: ${reward.pointsRequired}</p>
                        <button class="btn btn-warning" onclick="openEditModal(${reward.rewardId}, '${reward.rewardName}', '${reward.description}', ${reward.pointsRequired})">Edit</button>
                        <button class="btn btn-danger" onclick="openDeleteModal(${reward.rewardId})">Delete</button>
                    </div>
                </div>
            </div>
        `;

        // Append the reward card to the container
        rewardsContainer.innerHTML += rewardCard;
    });
}

// Call the function when the page loads to fetch and display rewards
document.addEventListener("DOMContentLoaded", fetchRewards);

// Function to open the edit modal and populate it with reward data
function openEditModal(rewardId, rewardName, description, pointsRequired) {
    // Populate the modal input fields with reward data
    document.getElementById('rewardId').value = rewardId;
    document.getElementById('editRewardName').value = rewardName;
    document.getElementById('editDescription').value = description;
    document.getElementById('editPointsRequired').value = pointsRequired;

    // Show the edit modal
    const editModal = new bootstrap.Modal(document.getElementById('editRewardModal'));
    editModal.show();
}

// Function to open the delete modal
function openDeleteModal(rewardId) {
    // Set the rewardId in a hidden input or button to handle the delete
    document.getElementById('deleteRewardId').value = rewardId;

    // Show the delete confirmation modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteRewardModal'));
    deleteModal.show();
}


 // Prevent default form submission and trigger the updateReward function
 document.getElementById('editRewardForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from submitting and reloading the page
    await updateReward();   // Call the update function
  });

  // Function to handle updating the reward
  async function updateReward() {
    const rewardId = document.getElementById('rewardId').value;
    const rewardName = document.getElementById('editRewardName').value;
    const description = document.getElementById('editDescription').value;
    const pointsRequired = document.getElementById('editPointsRequired').value;

    if (!rewardName || !description || !pointsRequired || isNaN(pointsRequired)) {
        alert("Please fill in all fields with valid values.");
        return;
    }

    try {
        // Create FormData object to send the updated data
        const formData = new FormData();
        formData.append('RewardName', rewardName);
        formData.append('Description', description);
        formData.append('PointsRequired', pointsRequired);

        // Make the PUT request to update the reward
        const response = await fetch(`https://localhost:44396/api/bloodDonation/updateReward/${rewardId}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        alert(result.message);

        // Optionally close the modal after update
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editRewardModal'));
        editModal.hide();

        // Refresh the reward list after update
        fetchRewards();
    } catch (error) {
        console.error('Error updating reward:', error);
        alert('Failed to update the reward.');
    }
  }



// Function to handle deleting the reward
async function deleteReward() {
    const rewardId = document.getElementById('deleteRewardId').value;

    try {
        // Make the DELETE request to remove the reward
        const response = await fetch(`https://localhost:44396/api/bloodDonation/deleteReward/${rewardId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        alert(result.message);

        // Optionally close the modal after delete
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteRewardModal'));
        deleteModal.hide();

        // Refresh the reward list after delete
        fetchRewards();
    } catch (error) {
        console.error('Error deleting reward:', error);
        alert('Failed to delete the reward.');
    }
}
