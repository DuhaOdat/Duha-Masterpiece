async function loadTechnicianProfile() {
    let userId = localStorage.getItem('userId'); // Retrieve the user ID from localStorage
    let token = localStorage.getItem('jwtToken'); // Retrieve the token

    // Ensure the UserId exists before fetching data
    if (!userId || !token) {
        console.error("User ID or token missing");
        return;
    }

    let url = `https://localhost:44396/api/Technicians/GetTechnicianProfile/${userId}`; 

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
                // Update the Technician name in multiple places
     document.getElementById('Technician-name-header').textContent = fullName;
    document.getElementById('Technician-name-sidebar').textContent = fullName;
    document.getElementById('Technician-first-name').textContent = firstName;
    document.getElementById('Technician-last-name').textContent = lastName; //;
  

  document.getElementById('email').textContent = data.email || 'N/A';
           
        } else {
            console.error("Technician data is missing or undefined");
        }

    } catch (error) {
        console.error("Error fetching Technician data:", error);
    }
}

// Call the function when the page is loaded
document.addEventListener("DOMContentLoaded", loadTechnicianProfile);




