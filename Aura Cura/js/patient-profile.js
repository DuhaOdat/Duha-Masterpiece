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
              // Fill out patient details in the modal
              document.getElementById('address-edit').value = data.profile?.address || '';
             

              document.getElementById('phone-edit').value = data.profile?.phone || '';
              document.getElementById('weight-edit').value = data.profile?.weight || '';
              document.getElementById('status-edit').value = data.profile?.status || '';
              document.getElementById('gender-edit').value = data.profile?.gender || '';
              document.getElementById('Birth-edit').value = data.profile?.dateOfBirth || '';
               // Fill in the blood type field
            if (data.profile.bloodType) {
                // Loop through the select options and set the selected option based on blood type ID
                const bloodTypeSelect = document.getElementById('blood-type-edit');
                for (let i = 0; i < bloodTypeSelect.options.length; i++) {
                    if (bloodTypeSelect.options[i].text === data.profile.bloodType) {
                        bloodTypeSelect.selectedIndex = i;
                        break;
                    }
                }
            } else {
                document.getElementById('blood-type-edit').value = ''; // If no blood type, set it to blank
            }
            
            if (data.profile) {
                document.getElementById('blood-type').textContent = data.profile.bloodType || 'N/A';
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

