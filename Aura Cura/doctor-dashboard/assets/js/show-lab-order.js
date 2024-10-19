const token = localStorage.getItem('jwtToken'); // Get token from localStorage
const doctorId = localStorage.getItem('userId'); // Get logged-in doctor's UserID from localStorage

// Function to fetch lab test orders for the doctor
async function fetchLabTestOrders(doctorId) {
    try {
        // Make a request to your API to get lab test orders
        const response = await fetch(`https://localhost:44396/api/labTest/GetAllLabTestOrdersForDoctor/${doctorId}`, {
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
// Function to dynamically populate the table with lab test orders
function renderLabTestOrders(labOrders) {
    const labTestTableBody = document.querySelector("#labTestTable tbody");
    labTestTableBody.innerHTML = ''; // Clear the table body before adding new rows

    labOrders.forEach((order, index) => {
        const row = document.createElement("tr");

        // Determine the delete button visibility (only show for Pending status)
        const deleteButton = order.status === 'Pending' 
            ? `<button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteTestModal" onclick="setOrderToDelete(${order.orderId})">Delete</button>`
            : ''; // No delete button if the order is completed

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
            <td>${deleteButton} ${viewButton}</td>
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



// Function to set the order ID to be deleted (for the modal)
function setOrderToDelete(orderId) {
    const deleteButton = document.querySelector("#deleteTestModal .btn-danger");
    deleteButton.setAttribute("data-order-id", orderId); // Set the order ID to the button
}

// Function to delete a lab test order
async function deleteLabTestOrder() {
    const deleteButton = document.querySelector("#deleteTestModal .btn-danger");
    const orderId = deleteButton.getAttribute("data-order-id"); // Get the order ID from the button

    try {
        // Send DELETE request to API
        const response = await fetch(`https://localhost:44396/api/labTest/DeleteOrder/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Use the JWT token for authentication
            }
        });

        if (!response.ok) {
            throw new Error("Failed to delete lab test order.");
        }

        // Re-fetch the lab test orders to update the table
        fetchLabTestOrders(doctorId);

        // Close the modal
        document.querySelector("#deleteTestModal .btn-close").click();
    } catch (error) {
        console.error("Error deleting lab test order:", error);
    }
}

// Event listener for delete confirmation
document.querySelector("#deleteTestModal .btn-danger").addEventListener('click', deleteLabTestOrder);

// Fetch and display lab test orders when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const doctorId = localStorage.getItem('userId'); // Doctor ID from localStorage
    if (doctorId) {
        fetchLabTestOrders(doctorId);
    } else {
        console.error("Doctor ID is missing");
    }
});
