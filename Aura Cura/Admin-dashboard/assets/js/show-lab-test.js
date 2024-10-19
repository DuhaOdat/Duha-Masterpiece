// Function to populate the form fields in the modal with the selected test details
function openEditModal(testId) {
    const selectedTest = document.getElementById(`test-row-${testId}`).dataset;
    
    // Populate the form fields with old values (keep the old values if not changed)
    document.getElementById('editTestId').value = selectedTest.testId;
    document.getElementById('editTestName').value = selectedTest.testName || '';  // Keep the old value
    document.getElementById('editDescription').value = selectedTest.description || '';  // Keep the old value
    document.getElementById('editIsAvailable').value = selectedTest.isAvailable === "true" ? '1' : '0';
    document.getElementById('normalRangeField').value = selectedTest.normalRange || '';  // Keep the old value
    document.getElementById('unitField').value = selectedTest.unit || '';  // Keep the old value

    // Show the modal
    const editModal = new bootstrap.Modal(document.getElementById('editTestModal'));
    editModal.show();
}

// Function to handle saving the changes
document.getElementById('saveChangesButton').addEventListener('click', async () => {
    console.log('Button clicked'); 
    // Collect form data
    const testId = document.getElementById('editTestId').value;
    const testName = document.getElementById('editTestName').value;
    const description = document.getElementById('editDescription').value;
    const isAvailable = document.getElementById('editIsAvailable').value === '1' ? true : false;
    const createdBy = localStorage.getItem('userId');  // Assuming the userId is stored in localStorage
    const normalRange = document.getElementById('normalRangeField').value;
    const unit = document.getElementById('unitField').value;

    // Debug: Log all form data before sending
    console.log("Form Data:");
    console.log("Test ID:", testId);
    console.log("Test Name:", testName);
    console.log("Description:", description);
    console.log("Is Available:", isAvailable);
    console.log("Created By:", createdBy);
    console.log("Normal Range:", normalRange);
    console.log("Unit:", unit);

    // Create FormData to send as a request payload
    const formData = new FormData();
    formData.append('testName', testName || '');  // Keep old value if not changed
    formData.append('description', description || '');  // Keep old value if not changed
    formData.append('isAvailable', isAvailable || '');  // Ensure this is either '1' or '0'
    formData.append('createdBy', createdBy || '');  // Ensure CreatedBy exists
    formData.append('normalRange', normalRange || '');  // Keep old value if not changed
    formData.append('unit', unit || '');  // Keep old value if not changed

    for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }
    

    try {
        const testId = document.getElementById('editTestId').value;
        console.log('Test ID:', testId);  // Ensure that the testId is valid before proceeding
        const response = await fetch(`https://localhost:44396/api/Admin/update-lab-test/${testId}`, {
            method: 'PUT',
            body: formData,
            
        });
        

        if (!response.ok) {
            throw new Error('Failed to update lab test');
        }

        const result = await response.json();
        alert("Update successfully");  // Display success message

        // Close the modal
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editTestModal'));
        editModal.hide(); 
        
        // Refresh the table or reload the data
        getLabTest();
    } catch (error) {
        console.error('Error updating lab test:', error);
        alert('An error occurred while updating the lab test.');
    }
});

// Function to fetch and display lab test data in the table
async function getLabTest() {
    try {
        const response = await fetch("https://localhost:44396/api/Admin/Show-Lab-Test");

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        const container = document.getElementById("labTestTable");

        // Clear the table content before appending new rows
        container.innerHTML = '';

        data.forEach(test => {
            container.innerHTML += `
                <tr id="test-row-${test.testId}" 
                    data-test-id="${test.testId}" 
                    data-test-name="${test.testName || ''}" 
                    data-description="${test.description || ''}" 
                    data-is-available="${test.isAvailable || ''}" 
                    data-normal-range="${test.normalRange || ''}" 
                    data-unit="${test.unit || ''}">
                    <td>${test.testId}</td>
                    <td>${test.testName || ''}</td>
                    <td>${test.description || ''}</td>
                    <td>${test.normalRange || 'N/A'}</td>
                    <td>${test.unit || 'N/A'}</td>
                    <td>${test.createdBy || 'N/A'}</td>
                    <td>${new Date(test.createdDate).toLocaleDateString()}</td>
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

// Load lab tests when the page is loaded
document.addEventListener("DOMContentLoaded", getLabTest);