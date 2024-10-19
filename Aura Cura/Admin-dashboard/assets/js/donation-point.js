// Function to fetch all blood types and populate the table
async function fetchBloodTypes() {
    try {
        // Make a GET request to your API to get all blood types
        const response = await fetch('https://localhost:44396/api/bloodDonation/getAllBloodTypes', {
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
        const bloodTypes = await response.json();

        // Log the API response to inspect its structure
        console.log('Blood Types API Response:', bloodTypes);
        
        // Populate the table with fetched blood types
        renderBloodTypes(bloodTypes);
    } catch (error) {
        console.error('Error fetching blood types:', error);
    }
}

// Function to dynamically populate the table with blood types
function renderBloodTypes(bloodTypes) {
    const tableBody = document.querySelector("#bloodTypeTable tbody");

    // Check if the table body exists
    if (!tableBody) {
        console.error("Table body not found. Ensure the table structure and ID are correct.");
        return;
    }

    tableBody.innerHTML = ''; // Clear the table body before adding new rows

    // Iterate through the bloodTypes array and populate the table
    bloodTypes.forEach((bloodType, index) => {
        const row = document.createElement("tr");

        // Check the property names in the bloodType object match your API response
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${bloodType.bloodType}</td> <!-- Ensure this property name matches the API -->
            <td>${bloodType.pointsPerDonation}</td> <!-- Ensure this property name matches the API -->
            <td><button class="btn btn-warning" onclick="openEditModal(${bloodType.bloodTypeId})">Edit</button></td> <!-- Pass bloodTypeId to openEditModal -->
        `;

        tableBody.appendChild(row);
    });
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchBloodTypes);

// Function to open the modal and populate it with data
function openEditModal(bloodTypeId) {
    // Set the bloodTypeId in the hidden field
    document.getElementById('bloodTypeId').value = bloodTypeId;

    // Optionally clear any previous input
    document.getElementById('pointsPerDonation').value = '';
    
    // Show the modal (in case it’s triggered elsewhere)
    const updateModal = new bootstrap.Modal(document.getElementById('updatePointsModal'));
    updateModal.show();
}

// Function to handle the submission of the updated points
async function submitPointsUpdate() {
    const bloodTypeId = document.getElementById('bloodTypeId').value;
    const pointsPerDonation = document.getElementById('pointsPerDonation').value;

    if (!pointsPerDonation || isNaN(pointsPerDonation)) {
        alert("Please enter a valid number for points.");
        return;
    }

    try {
        // Create a FormData object
        const formData = new FormData();
        formData.append('PointsPerDonation', pointsPerDonation);

        // Make the PUT request to update the points
        const response = await fetch(`https://localhost:44396/api/bloodDonation/updatePointsPerDonation/${bloodTypeId}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        alert(result.message);

        // Optionally, close the modal
        const updateModal = bootstrap.Modal.getInstance(document.getElementById('updatePointsModal'));
        updateModal.hide();

        // Refresh the blood types table or data
        fetchBloodTypes();
    } catch (error) {
        console.error('Error updating points per donation:', error);
        alert('Failed to update points per donation.');
    }
}
