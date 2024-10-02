async function loadAdminProfile() {
    let userId = localStorage.getItem('userId'); // Retrieve the user ID from localStorage
    let token = localStorage.getItem('jwtToken'); // Retrieve the token

    // Ensure the UserId exists before fetching data
    if (!userId || !token) {
        console.error("User ID or token missing");
        return;
    }

    let url = `https://localhost:44396/api/Admin/${userId}`; // Replace with your actual API URL

    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching Admin profile: ${response.statusText}`);
        }

        let data = await response.json();
        console.log(data);

        // Check if data and profile exist before assigning
        if (data) {
            // Assuming you have `data.firstName` and `data.lastName`
    const firstName = data.firstName;  // Replace with actual data (e.g., fetched from API)
    const lastName = data.lastName;    // Replace with actual data (e.g., fetched from API)
    const fullName = `${firstName} ${lastName}`; 
                // Update the admin name in multiple places
     document.getElementById('admin-name-header').textContent = fullName;
    document.getElementById('admin-name-sidebar').textContent = fullName;
    document.getElementById('admin-first-name').textContent = firstName;
    document.getElementById('admin-last-name').textContent = lastName; //;
  

  document.getElementById('email').textContent = data.email || 'N/A';
           
        } else {
            console.error("Admin data is missing or undefined");
        }

    } catch (error) {
        console.error("Error fetching Admin data:", error);
    }
}

// Call the function when the page is loaded
document.addEventListener("DOMContentLoaded", loadAdminProfile);




