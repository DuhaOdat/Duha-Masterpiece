// Function to fetch all patients and populate the table
async function fetchPatients() {
    try {
        const response = await fetch('https://localhost:44396/api/PatientProfile/GetAllPatients');
        if (!response.ok) {
            throw new Error('Failed to fetch patients data');
        }

        const patients = await response.json();
        displayPatients(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}

// Function to display patients in the table
function displayPatients(patients) {
    const patientsList = document.querySelector('tbody'); // Target the table body
    patientsList.innerHTML = ''; // Clear the existing rows

    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.patientId}</td>
            <td>${patient.fullName.split(' ')[0]}</td> <!-- Extracting First Name -->
            <td>${patient.fullName.split(' ')[1]}</td> <!-- Extracting Last Name -->
            <td>${patient.dateOfBirth || 'N/A'}</td>
            <td>${patient.address || 'N/A'}</td>
            <td>${patient.email || 'N/A'}</td>
            <td>${patient.phone || 'N/A'}</td>
            <td>${patient.bloodType || 'N/A'}</td>
            <td>${patient.rewardPoints || 0}</td>
            <td>
                <button class="btn btn-danger delete-btn" data-patient-id="${patient.patientId}">Delete</button>
            </td>
        `;
        patientsList.appendChild(row);
    });

    // Add event listeners to the delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const patientId = this.getAttribute('data-patient-id');
            deletePatient(patientId);
        });
    });
}


// Call the function to fetch and display patients when the page loads
window.onload = fetchPatients;
// Function to delete patient
async function deletePatient(patientId) {
    try {
        // تأكيد الحذف
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this patient?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            // إذا أكد المستخدم الحذف
            const response = await fetch(`https://localhost:44396/api/PatientProfile/DeletePatient/${patientId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                // إذا كان هناك مشكلة في الحذف مثل وجود مواعيد أو طلبات مرتبطة
                const errorData = await response.json();
                await Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: errorData.message || 'Failed to delete patient!',
                });
            } else {
                // إذا تم الحذف بنجاح
                await Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Patient deleted successfully.',
                    showConfirmButton: false,
                    timer: 1500
                });

                // تحديث الجدول بعد الحذف
                fetchPatients(); // لإعادة تحميل بيانات المرضى وتحديث الجدول
            }
        }
    } catch (error) {
        console.error('Error deleting patient:', error);
        await Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while deleting the patient.',
        });
    }
}
