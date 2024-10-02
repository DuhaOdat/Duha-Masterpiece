let url = "https://localhost:44396/api/Admin/Show-Lab-Test";

async function getLabTest() {
    try {
        let request = await fetch(url);
        
        // Check if the request was successful
        if (!request.ok) {
            throw new Error(`Error: ${request.statusText}`);
        }

        let data = await request.json(); // Parse the response as JSON
        let container = document.getElementById("labTestTable");

        // Clear the table content before appending new rows
        container.innerHTML = '';

        data.forEach(test => {
            container.innerHTML += ` 
                <tr>
                    <td>${test.testId}</td>
                    <td>${test.testName}</td>
                    <td>${test.description}</td>
                    <td>${test.createdBy}</td>
                    <td>${new Date(test.createdDate).toLocaleDateString()}</td> <!-- Format date -->
                    <td>${test.isAvailable ? "Yes" : "No"}</td>
                    <td>
                        <button class="btn btn-warning" onclick="openEditModal(${test.testId})">Update</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error fetching lab tests:", error);
    }
}

// Call the function to load the lab tests when the page loads
document.addEventListener("DOMContentLoaded", getLabTest);
