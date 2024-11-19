// Define the API endpoint
const apiEndpoint = 'https://localhost:44396/api/Technicians/GetAllLabTestOrders';

// Function to fetch and display lab test orders in the table
// async function displayLabTestOrders() {
//     const tableBody = document.querySelector('#labTestTable tbody'); // Select the table body

//     try {
//         const response = await fetch(apiEndpoint, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`Error: ${response.status}`);
//         }

//         const labOrders = await response.json();

//         // Check if there are lab orders
//         if (labOrders.length === 0) {
//             tableBody.innerHTML = '<tr><td colspan="8">No lab orders found.</td></tr>';
//         } else {
//             // Clear any existing rows
//             tableBody.innerHTML = '';

//             // Loop through each lab order and add a row to the table
//             labOrders.forEach((order, index) => {
//                 const isCompleted = order.status === 'Completed';
//                 const uploadButton = isCompleted
//                     ? '<button class="btn btn-primary btn-sm" disabled>Upload Result</button>'
//                     : `<button class="btn btn-primary btn-sm" onclick="openUploadModal(${order.orderId})">Upload Result</button>`;
                
//                 const viewButton = isCompleted 
//                     ? `<button class="btn btn-secondary btn-sm" onclick="openViewResultModal(${order.orderId})">View Result</button>` 
//                     : '';

//                 // Use += to append each row's content to the table body
//                 tableBody.innerHTML += `
//                     <tr>
//                         <td>${index + 1}</td>
//                         <td>${order.orderId}</td>
//                         <td>${order.patientName}</td>
//                         <td>${order.testName}</td>
//                         <td>${order.doctorName}</td>
//                         <td>${new Date(order.orderDate).toLocaleDateString()}</td>
//                         <td>${order.status}</td>
//                         <td>${uploadButton} ${viewButton}</td>
//                     </tr>
//                 `;
//             });
//         }
//     } catch (error) {
//         console.error('Error fetching lab test orders:', error);
//         tableBody.innerHTML = `<tr><td colspan="8">Error fetching lab test orders: ${error.message}</td></tr>`;
//     }
// }

async function displayLabTestOrders() {
    const tableBody = document.querySelector('#labTestTable tbody');

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const labOrders = await response.json();

        tableBody.innerHTML = labOrders.length === 0
            ? '<tr><td colspan="8">No lab orders found.</td></tr>'
            : '';

        labOrders.forEach((order, index) => {
            const isCompleted = order.status === 'Completed';
            const isPending = order.status === 'Pending';

            const setInProgressButton = isPending 
                ? `<button class="btn btn-warning btn-sm" onclick="setOrderInProgress(${order.orderId})">Set In Progress</button>`
                : '';

            const uploadButton = isCompleted
                ? '<button class="btn btn-primary btn-sm" disabled>Upload Result</button>'
                : `<button class="btn btn-primary btn-sm" onclick="openUploadModal(${order.orderId})">Upload Result</button>`;

            const viewButton = isCompleted
                ? `<button class="btn btn-secondary btn-sm" onclick="openViewResultModal(${order.orderId})">View Result</button>`
                : '';

            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${order.orderId}</td>
                    <td>${order.patientName}</td>
                    <td>${order.testName}</td>
                    <td>${order.doctorName}</td>
                    <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>${order.status}</td>
                    <td>
                        ${setInProgressButton} 
                        ${uploadButton} 
                        ${viewButton}
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error fetching lab test orders:', error);
        tableBody.innerHTML = `<tr><td colspan="8">Error fetching lab test orders: ${error.message}</td></tr>`;
    }
}




// Call the function when the page loads or when needed
document.addEventListener('DOMContentLoaded', displayLabTestOrders);


// Function to open the upload modal with the correct Order ID and fill Lab Technician ID
function openUploadModal(orderId) {
    // Set the OrderId in the hidden input field of the modal
    document.getElementById('orderIdInput').value = orderId;

    // Get the Lab Technician ID from localStorage
    const labTechnicianId = localStorage.getItem('userId'); // Replace 'userId' with your actual key if different

    // Set the Lab Technician ID in the input field
    document.getElementById('labTechnicianId').value = labTechnicianId;

    // Disable the upload button initially
    document.getElementById('uploadResultButton').disabled = true;

    // Show the modal (Bootstrap 5 modal)
    var uploadModal = new bootstrap.Modal(document.getElementById('uploadResultModal'));
    uploadModal.show();
}

// Handle form submission to upload lab test result with confirmation
document.getElementById('uploadResultForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Ask for confirmation before uploading the result
    const confirmation = confirm('Are you sure you want to upload the result?');
    if (!confirmation) {
        return; // If the user cancels, do not proceed
    }

    const formData = new FormData(this); // Collect the form data
    for (var pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]); 
    }

    try {
        // Make the POST request to upload the result
        const response = await fetch('https://localhost:44396/api/labTest/UploadLabTestResult', {
            method: 'POST',
            body: formData // Send the form data as multipart/form-data
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        alert('Lab test result uploaded successfully.');

        // Optionally, reload the table or update the UI
        displayLabTestOrders(); // Assuming this function refreshes the lab orders

    } catch (error) {
        console.error('Error uploading lab test result:', error);
        alert('Failed to upload the result.');
    }
});

// Enable the upload button once the result input is filled
document.getElementById('resultInput').addEventListener('input', function () {
    const resultValue = this.value.trim();
    const uploadButton = document.getElementById('uploadResultButton');

    // Enable the button only if the result input is not empty
    if (resultValue.length > 0) {
        uploadButton.disabled = false;
    } else {
        uploadButton.disabled = true;
    }
});
///////////////////////////////////////////////////////////////////////////////////

// Function to open the modal and load lab test result
async function openViewResultModal(orderId) {
    try {
        // Fetch the lab test result based on the OrderId
        const response = await fetch(`https://localhost:44396/api/labTest/GetLabTestResultByOrderId/${orderId}`, {
            method: 'GET',
            headers: {
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

            // Initialize and show the Bootstrap modal
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
