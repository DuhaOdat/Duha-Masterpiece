async function loadDoctorProfile() {
    const userId = localStorage.getItem('userId'); // Retrieve the user ID from localStorage
    const token = localStorage.getItem('jwtToken'); // Retrieve the token

    // Ensure the userId and token exist before fetching data
    if (!userId || !token) {
        console.error("User ID or token missing");
        return;
    }

    const url = `https://localhost:44396/api/Doctors/GetDoctorByUserId/${userId}`; // Correct API URL

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Include the JWT token in the request
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching Doctor profile: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        // Populate the profile data in HTML
        const fullName = `${data.firstName} ${data.lastName}`;
        document.getElementById('doctor-full-name').textContent = fullName; // Show the full name
        document.getElementById('doctor-name-header').innerHTML = fullName;
        document.getElementById('email').textContent = data.email || 'N/A';
        document.getElementById('doctor-biography').textContent = data.biography || 'N/A';
        document.getElementById('doctor-specialty').textContent = data.specialty || 'N/A';
        document.getElementById('doctor-experience').textContent = data.experienceYears || 'N/A';
        document.getElementById('doctor-education').textContent = data.education || 'N/A';

        // Display doctor image (refactored)
        const doctorImage = document.getElementById('doctor-profile-image');
        const doctorImage2 = document.getElementById('doctor-profile-image2');
        const imageUrl = data.image 
            ? `../../../../backend/Auera-Cura/Auera-Cura/Uploads/${data.image}` 
            : 'default-image-path.jpg';

        if (doctorImage) doctorImage.src = imageUrl;
        if (doctorImage2) doctorImage2.src = imageUrl;

        // Display stars based on the rating
        const rating = data.rating || 0;
        const maxStars = 5;
        const ratingStarsDiv = document.getElementById('doctor-rating-stars');
        ratingStarsDiv.innerHTML = '';

        for (let i = 1; i <= maxStars; i++) {
            const star = document.createElement('i');
            star.classList.add(i <= rating ? 'fas' : 'far', 'fa-star', 'text-warning', 'me-1');
            ratingStarsDiv.appendChild(star);
        }

        ratingStarsDiv.classList.add('d-block', 'mt-2'); // Add margin and block display

        // Store doctorId for later use
        const editDoctorIdElement = document.getElementById('editDoctorId');
        if (editDoctorIdElement) {
            editDoctorIdElement.value = data.doctorId;
        }

    } catch (error) {
        console.error("Error fetching doctor data:", error);
    }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", loadDoctorProfile);


// Function to fetch doctor schedule based on user ID stored in local storage
async function fetchDoctorSchedule() {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    const token = localStorage.getItem('jwtToken'); // Assuming you're using JWT tokens for authorization

    if (!userId || !token) {
        Swal.fire('Error', 'User ID or token not found in local storage.', 'error');
        return;
    }

    try {
        // First, get the doctorId using the userId
        const doctorIdResponse = await fetch(`https://localhost:44396/api/Doctors/GetDoctorByUserId/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include JWT token
                'Content-Type': 'application/json'
            }
        });

        const doctorData = await doctorIdResponse.json();
        const doctorId = doctorData.doctorId; // Assuming the response contains doctorId

        if (!doctorIdResponse.ok) {
            Swal.fire('Error', 'Failed to fetch doctorId.', 'error');
            return;
        }

        // Now, use the doctorId to fetch the doctor's schedule
        const scheduleResponse = await fetch(`https://localhost:44396/api/Appointments/GetDoctorScheduleByDoctorId/${doctorId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include JWT token
                'Content-Type': 'application/json'
            }
        });

        const scheduleData = await scheduleResponse.json();

        if (!scheduleResponse.ok) {
            Swal.fire('Error', 'Failed to fetch doctor schedule.', 'error');
            return;
        }

        console.log('Doctor Schedule:', scheduleData);

        // Clear the schedule table
        const tableBody = document.querySelector('#scheduleTable tbody');
        tableBody.innerHTML = ''; // Clear the table

        if (scheduleData.length === 0) {
            Swal.fire('No Schedule', 'No schedule found for this doctor.', 'info');
            return;
        }

        // Populate the schedule table
        scheduleData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.dayOfWeek}</td>
                <td>${item.startTime}</td>
                <td>${item.endTime}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching schedule:', error);
        Swal.fire('Error', 'Failed to fetch doctor schedule.', 'error');
    }
}

// Call this function to fetch the schedule when the page loads or when needed
document.addEventListener("DOMContentLoaded", fetchDoctorSchedule);
