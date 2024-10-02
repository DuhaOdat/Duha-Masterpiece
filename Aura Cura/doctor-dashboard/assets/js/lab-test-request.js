// Fetch available patients (role = 'Patient') and populate the dropdown
async function loadPatients() {
    let patientSelect = document.getElementById('patient-select');
    try {
        let response = await fetch('https://localhost:44396/api/LabTest/GetPatients');
        if (response.ok) {
            let patients = await response.json();
            patients.forEach(patient => {
                let option = document.createElement('option');
                option.value = patient.id;
                option.text = `${patient.firstName} ${patient.lastName}`;
                patientSelect.add(option);
            });
        } else {
            alert("No patients found.");
        }
    } catch (error) {
        console.error("Error fetching patients:", error);
    }
}

// Fetch available lab tests and populate the dropdown
async function loadLabTests() {
    let testSelect = document.getElementById('test-select');
    try {
        let response = await fetch('https://localhost:44396/api/LabTest/GetLabTests');
        if (response.ok) {
            let labTests = await response.json();
            labTests.forEach(test => {
                let option = document.createElement('option');
                option.value = test.testId;
                option.text = test.testName;
                testSelect.add(option);
            });
        } else {
            alert("No lab tests available.");
        }
    } catch (error) {
        console.error("Error fetching lab tests:", error);
    }
}

// Call these functions when the page loads to populate the dropdowns
document.addEventListener('DOMContentLoaded', () => {
    loadPatients();
    loadLabTests();
});


async function createLabTestOrder() {
    debugger;
    const token = localStorage.getItem('jwtToken'); // Get token from localStorage
    const doctorUserId = localStorage.getItem('userId'); // Get logged-in doctor's UserID from localStorage
    const patientUserId = document.getElementById('patient-select').value; // Get patient ID from select
    const testId = document.getElementById('test-select').value; // Get test ID from select

    if (!doctorUserId) {
        alert('Doctor ID is missing. Please log in again.');
        return;
    }

    // Prepare FormData to send
    const formData = new FormData();
    formData.append('TestId', testId);
    formData.append('PatientId', patientUserId);
    formData.append('DoctorId', doctorUserId); // Pass the DoctorUserID from localStorage

    try {
        let response = await fetch('https://localhost:44396/api/LabTest/CreateLabTestOrder', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}` // Include JWT token in the request
            },
            body: formData // Send FormData object
        });

        if (response.ok) {
            let result = await response.json();
            alert('Lab Test Order Created Successfully! Order ID: ' + result.orderId);
        } else {
            alert('Failed to create lab test order.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating lab test order.');
    }
}
