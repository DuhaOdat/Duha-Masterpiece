async function loadPatientProfile() {
    let userId = localStorage.getItem('userId'); // Retrieve the user ID from localStorage
    let token = localStorage.getItem('jwtToken'); // Retrieve the token

    // Ensure the UserId exists before fetching data
    if (!userId || !token) {
        console.error("User ID or token missing");
        return;
    }

    let url = `https://localhost:44396/api/PatientProfile/${userId}`; // Replace with your actual API URL

    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching patient profile: ${response.statusText}`);
        }

        let data = await response.json();
        console.log(data);

        // Check if data and profile exist before assigning
        if (data) {
            document.getElementById('patient-name').textContent = `${data.firstName} ${data.lastName}`;
            document.getElementById('email').textContent = data.email || 'N/A';
            
            if (data.profile) {
                document.getElementById('blood-type').textContent = data.profile.bloodTypeId || 'N/A';
                document.getElementById('gender').textContent = data.profile.gender || 'N/A';
                document.getElementById('weight').textContent = data.profile.weight || 'N/A';
                document.getElementById('dob').textContent = data.profile.dateOfBirth || 'N/A';
                document.getElementById('phone').textContent = data.profile.phone || 'N/A';
                document.getElementById('address').textContent = data.profile.address || 'N/A';
                document.getElementById('status').textContent = data.profile.status || 'N/A';
            } else {
                console.error("Profile data is missing or undefined");
            }
        } else {
            console.error("Patient data is missing or undefined");
        }

    } catch (error) {
        console.error("Error fetching patient data:", error);
    }
}

// Call the function when the page is loaded
document.addEventListener("DOMContentLoaded", loadPatientProfile);





/********************************** */
async function saveChanges(event) {
    event.preventDefault();  // منع إعادة تحميل الصفحة

    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('jwtToken');

    if (!userId || !token) {
        alert("User not logged in");
        return;
    }

    let url2 = `https://localhost:44396/api/PatientProfile/UpdatePatientProfile/${userId}`;

    // استخدام FormData لجمع البيانات من النموذج
    let form = document.getElementById('editPatientForm');
    let formData = new FormData(form);

    try {
        let response = await fetch(url2, {
            method: 'POST', // POST أو PUT حسب الـ API
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData // إرسال البيانات مباشرةً بدون تحويلها إلى JSON
        });

        if (response.ok) {
            alert("Profile updated successfully");
            window.location.reload();  // إعادة تحميل الصفحة بعد الحفظ
        } else {
            alert("Failed to update profile");
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred while updating the profile");
    }
}

// ربط النموذج بفعل الحفظ عند تقديمه
document.getElementById('editPatientForm').addEventListener('submit', saveChanges);

