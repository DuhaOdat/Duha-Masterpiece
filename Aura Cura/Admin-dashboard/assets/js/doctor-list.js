
 // Async function to fetch doctor data
async function fetchDoctors() {
    try {
        // Make a request to your API endpoint (replace with your actual API URL)
        const response = await fetch('https://localhost:44396/api/Doctors/AllDoctors');

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the response data as JSON
        const doctors = await response.json();
        console.log('Doctor API Response:', doctors);

        // Select the table body where you want to display the data
        const doctorList = document.getElementById('doctor-list');

        // Clear any existing rows
        doctorList.innerHTML = '';

        // Loop through each doctor and create a new row in the table
        doctors.forEach((doctor) => {
            const row = `
              <tr>
                  <td>${doctor.doctorId}</td>
                  <td><img src="../../../../backend/Auera-Cura/Auera-Cura/Uploads/${doctor.image}" alt="${doctor.fullName}" width="50" height="50"></td>
                  <td>${doctor.fullName}</td>
                  <td>${doctor.phone}</td>
                  <td>${doctor.email}</td>
                  <td>${doctor.departmentName}</td>
                  <td>${doctor.availabilityStatus}</td>
                  <td>
                      <button class="btn btn-info" onclick="viewSchedule(${doctor.doctorId})">View Schedule</button>
                  </td>
                  <td>
                      <button class="btn btn-secondary" onclick="viewDetails(${doctor.doctorId})">View Details</button>
                  </td>
                  <td>
                      <button class="btn btn-primary" onclick="openUpdateModal(${doctor.doctorId})">Update</button>
                      <button class="btn btn-danger" onclick="openDeleteModal(${doctor.doctorId})">Delete</button>
                  </td>
              </tr>
            `;

            // Append the row to the table body
            doctorList.innerHTML += row;
        });
    } catch (error) {
        console.error('Failed to fetch doctor data:', error);
    }
}

// Function to open the delete modal and pass the doctorId
function openDeleteModal(doctorId) {
    // Store the doctorId in the modal's data attribute
    document.getElementById('deleteDoctorModal').setAttribute('data-doctor-id', doctorId);
    
    // Show the modal (using Bootstrap)
    $('#deleteDoctorModal').modal('show');
}

// Event listener for the "Yes, Delete" button in the modal
document.getElementById('confirmDeleteDoctor').addEventListener('click', async function () {
    // Get the stored doctorId from the modal's data attribute
    const doctorId = document.getElementById('deleteDoctorModal').getAttribute('data-doctor-id');

    if (doctorId) {
        await deleteDoctor(doctorId);

        // Close the modal after the doctor is deleted
        $('#deleteDoctorModal').modal('hide');
    } else {
        console.error('Doctor ID is undefined or null');
    }
});

// Function to delete doctor using the API
async function deleteDoctor(doctorId) {
    try {
        const response = await fetch(`https://localhost:44396/api/Doctors/DeleteDoctor/${doctorId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete doctor');
        }

        alert('Doctor deleted successfully!');
        fetchDoctors(); // Refresh the list of doctors after deletion
    } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('Error deleting doctor');
    }
}

// Call the fetchDoctors function to load the data when the page loads
document.addEventListener('DOMContentLoaded', fetchDoctors);


////////////////////////////////////////////////////////////////////

 // Function to open the modal and fetch doctor details
function viewDetails(doctorId) {
    fetchDoctorDetails(doctorId);
}
// Function to fetch doctor details from API
async function fetchDoctorDetails(doctorId) {
    try {
        const response = await fetch(`https://localhost:44396/api/Doctors/GetDoctorById/${doctorId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch doctor details');
        }

        const doctor = await response.json();
        // Log the doctor object to verify the data from the API
        console.log(doctor);

        // Populate the modal with the doctor's details
        document.getElementById('detail-doctorId').textContent = doctor.doctorId;
        document.getElementById('detail-firstName').textContent = doctor.firstName;
        document.getElementById('detail-lastName').textContent = doctor.lastName;
        document.getElementById('detail-email').textContent = doctor.email;
        document.getElementById('detail-phone').textContent = doctor.Phone;
        document.getElementById('detail-specialty').textContent = doctor.specialty;
        document.getElementById('detail-biography').textContent = doctor.biography;
        document.getElementById('detail-experience').textContent = doctor.experienceYears;
        document.getElementById('detail-education').textContent = doctor.education;
        document.getElementById('detail-availability').textContent = doctor.availabilityStatus;
        document.getElementById('detail-rating').textContent = doctor.rating;
        document.getElementById('detail-isHead').textContent = doctor.isHead ? 'Yes' : 'No';

        // Check if the image exists, otherwise use a placeholder image
        const imagePath = doctor.image ? `../../../../backend/Auera-Cura/Auera-Cura/Uploads/${doctor.image}` : 'path/to/placeholder/image.png';
        document.getElementById('detail-image').src = imagePath;

        // Show the modal
        $('#doctorDetailsModal').modal('show');
    } catch (error) {
        console.error('Error fetching doctor details:', error);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////


// Function to open the update modal and pre-fill it with the doctor's current data
function openUpdateModal(doctorId) {
    
    fetchDoctorDetailsForUpdate(doctorId);

    fetchDepartments(); // Fetch the departments for dropdown
}

// Fetch current doctor details for pre-filling the form
async function fetchDoctorDetailsForUpdate(doctorId) {
    try {
        const response = await fetch(`https://localhost:44396/api/Doctors/GetDoctorById/${doctorId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch doctor details');
        }

        const doctor = await response.json();

        // تعبئة الحقول بالقيم الموجودة للطبيب
        document.getElementById('update-doctorId').value = doctor.doctorId;
        document.getElementById('update-isHead').value = doctor.isHead ? 'true' : 'false';
        document.getElementById('update-specialty').value = doctor.specialty || '';
        document.getElementById('update-biography').value = doctor.biography || '';
        document.getElementById('update-phone').value = doctor.phone || '';
        document.getElementById('update-rating').value = doctor.rating || '';
        document.getElementById('update-experience').value = doctor.experienceYears || '';
        document.getElementById('update-availability').value = doctor.availabilityStatus || '';
        document.getElementById('update-education').value = doctor.education || '';


           // تعبئة القائمة المنسدلة للحالة (Availability Status)
           const availabilityDropdown = document.getElementById('update-availability');
           availabilityDropdown.value = doctor.availabilityStatus || '';
        // تعبئة القائمة المنسدلة للقسم
        await fetchDepartments(doctor.departmentId);

        // عرض الصورة الحالية
        const imagePath = doctor.image
            ? `../../../../backend/Auera-Cura/Auera-Cura/Uploads/${doctor.image}`
            : 'path/to/placeholder/image.png';
        document.getElementById('update-image-preview').src = imagePath;

        // عرض المودال
        $('#doctorUpdateModal').modal('show');
    } catch (error) {
        console.error('Error fetching doctor details for update:', error);
    }
}


// Fetch departments for the dropdown list
async function fetchDepartments() {
    try {
        const response = await fetch('https://localhost:44396/api/Departments/allDepartments');
        if (!response.ok) {
            throw new Error('Failed to fetch departments');
        }

        const departments = await response.json();
        const dropdown = document.getElementById('update-department');

        // Clear existing options
        dropdown.innerHTML = '';

        // Add default empty option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select Department --';
        dropdown.appendChild(defaultOption);

        // Populate dropdown with departments
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.departmentId;
            option.textContent = department.departmentName;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching departments:', error);
    }
}

// Handle form submission for updating the doctor
document.getElementById('doctorUpdateForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission

    const doctorId = document.getElementById('update-doctorId').value;

    // Create FormData to send only filled data
    const formData = new FormData();

    const fields = [
        { id: 'update-isHead', key: 'isHead' },
        { id: 'update-specialty', key: 'specialty' },
        { id: 'update-biography', key: 'biography' },
        { id: 'update-phone', key: 'phone' },
        { id: 'update-rating', key: 'rating' },
        { id: 'update-experience', key: 'experienceYears' },
        { id: 'update-availability', key: 'availabilityStatus' },
        { id: 'update-education', key: 'education' },
        { id: 'update-department', key: 'departmentId' },
    ];

    fields.forEach(field => {
        const value = document.getElementById(field.id).value;
        if (value) {
            formData.append(field.key, value);
        }
    });

    // Check if a new image is selected
    const imageFile = document.getElementById('update-image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch(`https://localhost:44396/api/Doctors/EditDoctor/${doctorId}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to update doctor');
        }

        const updatedDoctor = await response.json();
        alert('Doctor updated successfully!');
        $('#doctorUpdateModal').modal('hide'); // Hide the modal after a successful update

        fetchDoctors(); // Refresh the list of doctors to show updated data
    } catch (error) {
        console.error('Error updating doctor:', error);
        alert('Error updating doctor');
    }
});




// Function to fetch and display the schedules of a specific doctor
async function viewSchedule(doctorId) {
    try {
        const response = await fetch(`https://localhost:44396/api/Doctorschedules/GetSchedulesByDoctor/${doctorId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch doctor schedules');
        }

        const schedules = await response.json();

        // Check if there are no schedules
        if (!schedules || schedules.length === 0) {
            alert('No schedules have been added for this doctor yet.'); // Custom message
            return; // Exit the function
        }

        // Select the table body or the modal body where you want to display the schedules
        const scheduleList = document.getElementById('schedule-list');

        // Clear any existing schedule data
        scheduleList.innerHTML = '';

        // Loop through the schedules and display them
        schedules.forEach((schedule) => {
            const row = `
                <tr>
                    <td>${schedule.dayOfWeek}</td>
                    <td>${schedule.startTime}</td>
                    <td>${schedule.endTime}</td>
                </tr>
            `;
            scheduleList.innerHTML += row;
        });

        // Show the modal (using Bootstrap)
        $('#doctorScheduleModal').modal('show');
    } catch (error) {
        console.error('Error fetching schedules:', error);
        alert('No schedules have been added for this doctor yet.'); // Custom message for error
    }
}
