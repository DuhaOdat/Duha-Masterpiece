document.addEventListener("DOMContentLoaded", () => {
    fetchAllServices();
});

async function fetchAllServices() {
    const response = await fetch("https://localhost:44396/api/Services/GetAllServices"); 
    if (response.ok) {
        const data = await response.json();
        displayServices(data);
    } else {
        console.error("Network response was not ok: " + response.statusText);
    }
}

function displayServices(services) {
    const tableBody = document.getElementById("servicesTable");
    tableBody.innerHTML = ""; // Clear existing rows

    services.forEach(service => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${service.serviceId}</td>
            <td>${service.serviceName}</td>
            <td>${service.serviceDescription}</td>
            <td>${service.serviceIcon}</td>
            <td>${service.serviceLink}</td>
            <td>${new Date(service.createdDate).toLocaleDateString()}</td>
            <td>${service.isActive ? "Yes" : "No"}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openEditModal(${service.serviceId})">Edit</button>
                 <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${service.serviceId})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Function to open the delete confirmation modal
function openDeleteModal(serviceId) {
    // Store the serviceId in the modal's confirm button
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    confirmDeleteButton.onclick = () => deleteService(serviceId);

    // Show the modal
    const deleteModal = new bootstrap.Modal(document.getElementById("deleteServiceModal"));
    deleteModal.show();
}

// Function to delete a service
async function deleteService(serviceId) {
    const response = await fetch(`https://localhost:44396/api/Services/DeleteService/${serviceId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Service deleted successfully.');
        fetchAllServices(); // Re-fetch the list to reflect the deleted item
    } else {
        alert('Failed to delete the service.');
    }

    // Close the modal after deletion
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteServiceModal"));
    deleteModal.hide();
}



// Function to open the edit modal and populate fields with current service data
async function openEditModal(serviceId) {
    const response = await fetch(`https://localhost:44396/api/Services/GetService/${serviceId}`); // Assuming a GetService endpoint exists
    if (response.ok) {
        const service = await response.json();

        // Populate modal fields
        document.getElementById("editServiceId").value = service.serviceId;
        document.getElementById("editServiceName").value = service.serviceName;
        document.getElementById("editServiceDescription").value = service.serviceDescription;
        document.getElementById("editServiceIcon").value = service.serviceIcon;
        document.getElementById("editServiceLink").value = service.serviceLink;
        document.getElementById("editIsActive").value = service.isActive ? "1" : "0";

        // Show the modal
        const editModal = new bootstrap.Modal(document.getElementById("editServiceModal"));
        editModal.show();
    } else {
        console.error("Failed to fetch service data for editing:", response.statusText);
    }
}

// Function to save the changes made in the edit modal
document.getElementById("saveServiceChangesButton").addEventListener("click", saveServiceChanges);

async function saveServiceChanges() {
    // Gather updated data from the modal
    const serviceId = document.getElementById("editServiceId").value;
    const serviceData = {
        ServiceName: document.getElementById("editServiceName").value,
        ServiceDescription: document.getElementById("editServiceDescription").value,
        ServiceIcon: document.getElementById("editServiceIcon").value,
        ServiceLink: document.getElementById("editServiceLink").value,
        IsActive: document.getElementById("editIsActive").value === "1" // Convert "1"/"0" to true/false
    };

    // Send the PUT request
    const response = await fetch(`https://localhost:44396/api/Services/EditService/${serviceId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(serviceData)
    });

    if (response.ok) {
        alert("Service updated successfully!");
        fetchAllServices(); // Refresh the service list to show updated data

        // Close the modal
        const editModal = bootstrap.Modal.getInstance(document.getElementById("editServiceModal"));
        editModal.hide();
    } else {
        alert("Failed to update service.");
        console.error("Failed to update service:", response.statusText);
    }
}