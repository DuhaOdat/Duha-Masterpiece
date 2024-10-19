// Global variable to store department ID
let selectedDepartmentId = null;

// Function to fetch all departments and populate the table
async function fetchDepartments() {
    try {
        const response = await fetch('https://localhost:44396/api/departments/allDepartmentsWithHead'); // Adjust URL accordingly
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const departments = await response.json();
        displayDepartments(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
    }
}

// Function to display departments in the table
function displayDepartments(departments) {
    const departmentsList = document.getElementById('departments-list');
    departmentsList.innerHTML = ''; // Clear existing rows

    departments.forEach((department, index) => {
        const row = document.createElement('tr');
        const imageUrl = `../../../../backend/Auera-Cura/Auera-Cura/Uploads/${department.image}`;
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${imageUrl}" alt="Department Image" style="width:50px;height:50px;"></td>
            <td>${department.departmentName}</td>
            <td>${department.departmentDescription || 'N/A'}</td>
            <td>${department.phone || 'N/A'}</td>
            <td>${department.numberOfRooms || 'N/A'}</td>
            <td>${department.numberOfBeds || 'N/A'}</td>
            <td><button class="btn btn-info" onclick="showHeadOfDepartment('${department.Head?.fullName}', '${department.Head?.image}')">Head</button></td>
            <td><button class="btn btn-info" onclick="showDoctorsInDepartment(${department.departmentId})">Doctors</button></td>
            <td>
                <button class="btn btn-warning" onclick="openUpdateModal(${department.departmentId})">Update</button>
                <button class="btn btn-danger" onclick="openDeleteModal(${department.departmentId})">Delete</button>
            </td>
        `;
        departmentsList.appendChild(row);
    });
}

// Open delete modal and set department ID
function openDeleteModal(departmentId) {
    selectedDepartmentId = departmentId; // Store the department ID
    $('#deleteDepartmentModal').modal('show'); // Show the delete modal
}

// Open update modal and set department ID
function openUpdateModal(departmentId) {
    selectedDepartmentId = departmentId; // Store the department ID
    // Here, you could also populate the modal fields with the department's current details
    $('#updateDepartmentModal').modal('show'); // Show the update modal
}

// Function to show head of department
function showHeadOfDepartment(fullName, image) {
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <h5>Head of Department</h5>
        <img src="../../../../backend/Auera-Cura/Auera-Cura/Uploads/${image}" alt="Head Image" style="width:100px;height:100px;">
        <p><strong>Dr:</strong> ${fullName || 'N/A'}</p>
    `;
    $('#departmentModal').modal('show');
}

// Function to show doctors in the department
async function showDoctorsInDepartment(departmentId) {
    try {
        const response = await fetch(`https://localhost:44396/api/departments/doctorsInDepartment/${departmentId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch doctors');
        }

        const doctors = await response.json();
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = '<h5>Doctors of Department</h5>';

        if (doctors.length > 0) {
            doctors.forEach(doctor => {
                const doctorImageUrl = `../../../../backend/Auera-Cura/Auera-Cura/Uploads/${doctor.image}`;
                modalContent.innerHTML += `
                    <div class="doctor-info">
                        <img src="${doctorImageUrl}" alt="Doctor Image" style="width:50px;height:50px; object-fit:cover; margin-right: 10px;">
                        <span><strong>Dr:</strong> ${doctor.fullName}</span>
                    </div>
                `;
            });
        } else {
            modalContent.innerHTML += '<p>No doctors found for this department.</p>';
        }

        $('#departmentModal').modal('show');
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}
// Open delete modal and check if department can be deleted
async function openDeleteModal(departmentId) {
    selectedDepartmentId = departmentId; // Store the department ID

    // Send a request to check if the department can be deleted
    try {
        const response = await fetch(`https://localhost:44396/api/departments/CanDeleteDepartment/${selectedDepartmentId}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            // إذا كان القسم يحتوي على أطباء أو فحوصات مرتبطة، تظهر الرسالة باستخدام SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Cannot delete department',
                text: errorData.message || "Related doctors or test orders prevent deletion.",
            });
        } else {
            // إذا لم يكن هناك ارتباطات، يتم إظهار نافذة التأكيد باستخدام SweetAlert
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Call the delete function if confirmed
                    deleteDepartment();
                }
            });
        }
    } catch (error) {
        console.error('Error checking department:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while checking the department status.',
        });
    }
}

// Delete department function
async function deleteDepartment() {
    if (!selectedDepartmentId) {
        Swal.fire('Error', 'No department selected.', 'error');
        return;
    }

    try {
        const response = await fetch(`https://localhost:44396/api/departments/DeleteDepartment/${selectedDepartmentId}`, {
            method: 'DELETE'
        });

        // Check if the delete was successful
        if (response.ok) {
            Swal.fire('Deleted!', 'Department has been deleted.', 'success');
            fetchDepartments(); // Refresh the department list
        } else {
            const errorData = await response.json();
            Swal.fire('Error', errorData.message || 'Failed to delete department', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'An error occurred while deleting the department.', 'error');
    }
}






// Open update modal and populate fields with existing department data
async function openUpdateModal(departmentId) {
    selectedDepartmentId = departmentId; // Store the department ID

    // Fetch the department data based on the ID
    try {
        const response = await fetch(`https://localhost:44396/api/Departments/GetDepartmentById/${departmentId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch department data');
        }

        const department = await response.json();

        // Populate modal fields with the current department data
        document.getElementById('updateDepartmentName').value = department.departmentName;
        document.getElementById('updateDepartmentDescription').value = department.departmentDescription;
        document.getElementById('updatePhone').value = department.phone;
        document.getElementById('updateNumberOfBeds').value = department.numberOfBeds;
        document.getElementById('updateNumberOfRooms').value = department.numberOfRooms;

        // Display current image in modal
        const currentImageUrl = `../../../../backend/Auera-Cura/Auera-Cura/Uploads/${department.image}`;
        document.getElementById('currentImage').src = currentImageUrl;

        // Open the modal
        $('#updateDepartmentModal').modal('show');
    } catch (error) {
        console.error('Error fetching department data:', error);
        alert('Failed to fetch department data');
    }
}

// Handle the department update form submission
document.getElementById('updateDepartmentForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    if (!selectedDepartmentId) {
        alert('No department selected.');
        return;
    }

    const formData = new FormData();
    formData.append('DepartmentName', document.getElementById('updateDepartmentName').value);
    formData.append('DepartmentDescription', document.getElementById('updateDepartmentDescription').value);
    formData.append('Phone', document.getElementById('updatePhone').value);
    formData.append('NumberOfBeds', document.getElementById('updateNumberOfBeds').value);
    formData.append('NumberOfRooms', document.getElementById('updateNumberOfRooms').value);
    
    const imageInput = document.getElementById('updateImage').files[0];
    if (imageInput) {
        formData.append('Image', imageInput); // Append the new image if uploaded
    }

    try {
        const response = await fetch(`https://localhost:44396/api/departments/UpdateDepartment/${selectedDepartmentId}`, {
            method: 'PUT',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Failed to update department');
        }
        alert('Department updated successfully');
        $('#updateDepartmentModal').modal('hide');
        fetchDepartments(); // Refresh the department list
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update department');
    }
});


// Fetch and display departments when the page loads
window.onload = fetchDepartments;
