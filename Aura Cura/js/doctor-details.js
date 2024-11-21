document.addEventListener('DOMContentLoaded', () => {
    const doctorId = localStorage.getItem('selectedDoctorId');
    if (doctorId) {
        loadDoctorDetails(doctorId);
    }
});

// Main function to load doctor details
async function loadDoctorDetails(doctorId) {
    const url = `https://localhost:44396/api/Doctors/GetDoctorById/${doctorId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch doctor details");
        }
        const doctor = await response.json();
        console.log(doctor);
        displayDoctorDetails(doctor);
    } catch (error) {
        console.error("Error fetching doctor details:", error);
    }
}

// Function to display doctor details
function displayDoctorDetails(doctor) {
    // Display image
    const imageElement = document.getElementById("doctor-image");
    imageElement.src = `../backend/Auera-Cura/Auera-Cura/Uploads/${doctor.image}`;

    // Display name, specialty, and rating
    document.getElementById("doctor-name").textContent = `Dr. ${doctor.firstName} ${doctor.lastName}`;
    document.getElementById("doctor-specialty").textContent = doctor.specialty;
    displayDoctorRating(doctor.rating);

    // Display experience and availability status
    document.getElementById("doctor-experience").textContent = `${doctor.experienceYears} Years of Experience`;
    displayAvailabilityStatus(doctor.availabilityStatus);

    // Display biography, specialties, education, and working hours
    document.getElementById("doctor-biography").textContent = doctor.biography;
    displayDepartment(doctor.departmentName);
    displaySpecialties(doctor.specialty);
    displayEducation(doctor.education);
    displayWorkingHours(doctor.workingHours);
}

// Function to display rating stars
function displayDoctorRating(rating) {
    const starsContainer = document.getElementById("doctor-rating-stars");
    starsContainer.innerHTML = ''; // Clear previous stars

    for (let i = 1; i <= 5; i++) {
        starsContainer.innerHTML += (i <= Math.floor(rating)) 
            ? '<i class="fas fa-star"></i>' 
            : '<i class="far fa-star"></i>';
    }
    document.getElementById("doctor-rating").textContent = `${rating} out of 5`;
}

// Function to display availability status
function displayAvailabilityStatus(status) {
    const availabilityElement = document.getElementById("doctor-availability");
    const isAvailable = status === 'Available';
    availabilityElement.classList.toggle('bg-success', isAvailable);
    availabilityElement.classList.toggle('bg-danger', !isAvailable);
    availabilityElement.textContent = status;
}



// Function to display Department Name
function displayDepartment(departmentName) {
    const DepartmentNameContainer = document.getElementById("doctor-department");
    DepartmentNameContainer.innerHTML = departmentName
        ? `<li class="list-group-item">${departmentName}</li>` 
        : `<li class="list-group-item">No Department available</li>`;
}
// Function to display specialties
function displaySpecialties(specialty) {
    const specialtiesContainer = document.getElementById("doctor-specialties");
    specialtiesContainer.innerHTML = specialty 
        ? `<li class="list-group-item">${specialty}</li>` 
        : `<li class="list-group-item">No specialties available</li>`;
}

// Function to display education details
function displayEducation(education) {
    const educationContainer = document.getElementById("doctor-education");
    educationContainer.innerHTML = education 
        ? `<li class="list-group-item">${education}</li>`
        : `<li class="list-group-item">No education details available</li>`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const doctorId = localStorage.getItem('selectedDoctorId');
    if (doctorId) {
        loadDoctorSchedule(doctorId);
    }
});

async function loadDoctorSchedule(doctorId) {
    const url = `https://localhost:44396/api/DoctorSchedules/GetSchedulesByDoctor/${doctorId}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch doctor schedule.');
        }
        const schedules = await response.json();

        const workingHoursContainer = document.getElementById("doctor-working-hours");
        workingHoursContainer.innerHTML = '';

        if (schedules.length > 0) {
            schedules.forEach(schedule => {
                workingHoursContainer.innerHTML += `
                    <li class="list-group-item">
                        <strong>${schedule.dayOfWeek}:</strong> ${schedule.startTime} - ${schedule.endTime}
                    </li>
                `;
            });
        } else {
            workingHoursContainer.innerHTML = `<li class="list-group-item">No working hours available</li>`;
        }
    } catch (error) {
        console.error("Error fetching doctor schedule:", error);
    }
}
