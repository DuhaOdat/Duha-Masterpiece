async function fetchRewards() {
    try {
        const response = await fetch("https://localhost:44396/api/bloodDonation/getAllRewards");
        const rewards = await response.json();

        // Check if the API returned data
        if (!rewards || rewards.length === 0) {
            console.log("No rewards found.");
            return;
        }

        // Render rewards
        renderRewards(rewards);
    } catch (error) {
        console.error("Error fetching rewards:", error);
    }
}

function renderRewards(rewards) {
    const rewardsContainer = document.getElementById("rewards-container");

    // Clear any existing content in the container
    rewardsContainer.innerHTML = "";

    rewards.forEach(reward => {
        // Create a reward card
        const rewardCard = document.createElement("div");
        rewardCard.classList.add("col-lg-4", "col-md-6", "mb-4");

        rewardCard.innerHTML = `
            <div class="card border-0 shadow-sm h-100">
                <img class="card-img-top fixed-image-size" src="img/reward${reward.rewardId}.png" alt="${reward.rewardName}">
                <div class="card-body text-center">
                    <h5 class="card-title">${reward.rewardName}</h5>
                    <p class="card-text">${reward.description}</p>
                    <p class="text-primary">Points Required: ${reward.pointsRequired}</p>
                </div>
            </div>
        `;

        // Append the card to the rewards container
        rewardsContainer.appendChild(rewardCard);
    });
}

// Call the fetchRewards function to load the rewards dynamically
fetchRewards();
async function fetchBloodTypes() {
    try {
        const response = await fetch("https://localhost:44396/api/bloodDonation/getAllBloodTypes");
        const bloodTypes = await response.json();

        // Check if the API returned data
        if (!bloodTypes || bloodTypes.length === 0) {
            console.log("No blood types found.");
            return;
        }

        // Render blood type cards
        renderBloodTypes(bloodTypes);
    } catch (error) {
        console.error("Error fetching blood types:", error);
    }
}

function renderBloodTypes(bloodTypes) {
    const bloodTypesContainer = document.getElementById("blood-types-container");

    // Clear any existing content in the container
    bloodTypesContainer.innerHTML = "";

    bloodTypes.forEach(bloodType => {
        // Create a card for each blood type
        const bloodTypeCard = document.createElement("div");
        bloodTypeCard.classList.add("col-lg-3", "col-md-6");

        bloodTypeCard.innerHTML = `
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body text-center">
                    <div class="icon-box bg-primary text-white mb-4">
                        <i class="fas fa-tint fa-3x"></i>
                    </div>
                    <h5 class="card-title">${bloodType.bloodType} Blood Type</h5>
                    <p class="card-text text-muted">Earn ${bloodType.pointsPerDonation} points per donation.</p>
                </div>
            </div>
        `;

        // Append the card to the container
        bloodTypesContainer.appendChild(bloodTypeCard);
    });
}

// Call the fetchBloodTypes function to load the blood type data dynamically
fetchBloodTypes();


function getColorClass(bloodType) {
    switch (bloodType) {
        case "O+":
            return "bg-primary";
        case "O-":
            return "bg-danger";
        case "A+":
            return "bg-success";
        case "A-":
            return "bg-warning";
        case "B+":
            return "bg-info";
        case "B-":
            return "bg-secondary";
        case "AB+":
            return "bg-purple"; // Define this color in your CSS
        case "AB-":
            return "bg-dark";
        default:
            return "bg-secondary";
    }
}

function renderBloodTypes(bloodTypes) {
    const bloodTypesContainer = document.getElementById("blood-types-container");
    bloodTypesContainer.innerHTML = "";

    bloodTypes.forEach(bloodType => {
        const colorClass = getColorClass(bloodType.bloodType);

        const bloodTypeCard = document.createElement("div");
        bloodTypeCard.classList.add("col-lg-3", "col-md-6");

        bloodTypeCard.innerHTML = `
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body text-center">
                    <div class="icon-box ${colorClass} text-white mb-4">
                        <i class="fas fa-tint fa-3x"></i>
                    </div>
                    <h5 class="card-title">${bloodType.bloodType} Blood Type</h5>
                    <p class="card-text text-muted">Earn ${bloodType.pointsPerDonation} points per donation.</p>
                </div>
            </div>
        `;

        bloodTypesContainer.appendChild(bloodTypeCard);
    });
}
