const token = localStorage.getItem('jwtToken'); // Get token from localStorage

// Function to fetch all lab test orders for all doctors
async function fetchLabTestOrders() {
    try {
        // Make a request to your API to get lab test orders for all doctors
        const response = await fetch(`https://localhost:44396/api/labTest/getAllTestOrder`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Assuming you're using JWT for authorization
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch lab test orders.");
        }

        // Parse the response data
        const labOrders = await response.json();

        // Dynamically update the table with fetched data
        renderLabTestOrders(labOrders);
    } catch (error) {
        console.error("Error fetching lab test orders:", error);
    }
}


// Function to dynamically populate the table with lab test orders
function renderLabTestOrders(labOrders) {
    const labTestTableBody = document.querySelector("#labTestTable tbody");
    labTestTableBody.innerHTML = ''; // Clear the table body before adding new rows

    labOrders.forEach((order, index) => {
        const row = document.createElement("tr");

        // Determine the view result button visibility (only show for Completed status)
        const viewButton = order.status === 'Completed' 
            ? `<button class="btn btn-secondary" onclick="openViewResultModal(${order.orderId})">View Result</button>`
            : ''; // No view button if the order is not completed

        // Insert the row with buttons based on the order status
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.orderId}</td>
            <td>${order.patientName}</td>
            <td>${order.testName}</td>
            <td>Dr. ${order.doctorName}</td>
            <td>${new Date(order.orderDate).toLocaleDateString()}</td>
            <td>${order.status}</td>
            <td>${viewButton}</td>
        `;

        labTestTableBody.appendChild(row);
    });
}


// Function to open the modal and load lab test result
async function openViewResultModal(orderId) {
    try {
        // Fetch the lab test result based on the OrderId
        const response = await fetch(`https://localhost:44396/api/labTest/GetLabTestResultByOrderId/${orderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();

        // Check if result exists
        if (result) {
            // Populate the modal with the fetched data
            document.getElementById('labTestResult').textContent = result.result;
            document.getElementById('labTechnicianName').textContent = result.labTechnicianName;
            document.getElementById('uploadDate').textContent = new Date(result.uploadDate).toLocaleDateString();
            document.getElementById('completeDate').textContent = new Date(result.completeDate).toLocaleDateString();

            // Show the modal
            const viewModal = new bootstrap.Modal(document.getElementById('viewResultModal'));
            viewModal.show();
        } else {
            alert('No result found for this order.');
        }
    } catch (error) {
        console.error('Error fetching lab test result:', error);
        alert('Failed to fetch the result.');
    }
}


// Fetch and display lab test orders when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchLabTestOrders(); // Fetch all orders from all doctors when the page loads
});
