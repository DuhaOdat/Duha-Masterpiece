let allDoctorsUrl = "https://localhost:44396/api/Doctors/AllDoctors"; // رابط جلب كل الأطباء
let searchUrl = "https://localhost:44396/api/Doctors/Search"; // رابط البحث عن الأطباء

// Function to fetch and display doctors
async function fetchDoctors(url, query = "") {
    try {
        let response = await fetch(`${url}${query}`);

        if (!response.ok) {
            throw new Error("Failed to fetch doctors");
        }

        let doctors = await response.json();
        console.log(doctors);

        let container = document.getElementById("doctors-container");
        container.innerHTML = ""; // Clear existing content

        // Check if no results were found
        if (!doctors || doctors.length === 0) {
            container.innerHTML = `<p class="text-center">No doctors found</p>`;
            return;
        }

        // Render each doctor
        doctors.forEach(doctor => {
            container.innerHTML += `
                <div class="col-md-3 wow fadeIn mb-4" data-wow-delay="0.1s">
                    <div class="team-item bg-white text-center rounded p-4 pt-0">
                        <img class="img-fluid rounded-circle p-4" src="../backend/Auera-Cura/Auera-Cura/Uploads/${doctor.image}" alt="${doctor.fullName}">
                        <h5 class="mb-0">${doctor.fullName}</h5>
                        <small>${doctor.departmentName}</small>
                        <div class="d-flex justify-content-center mt-3">
                            <a class="btn btn-link" href="doctor-details.html?id=${doctor.doctorId}" onclick="storeDoctorId(${doctor.doctorId})">More Details</a>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching doctors:", error);
    }
}

// Store DoctorId in localStorage
function storeDoctorId(doctorId) {
    localStorage.setItem("selectedDoctorId", doctorId);
}

// Load departments into the dropdown
async function loadDepartments() {
    const departmentSelect = document.getElementById("department-select");

    try {
        const response = await fetch("https://localhost:44396/api/Doctors/api/departments");
        const departments = await response.json();

        departmentSelect.innerHTML = '<option value="">Select Department</option>'; // Reset options

        departments.forEach(department => {
            const option = document.createElement("option");
            option.value = department.departmentName; // Use department name as the value
            option.textContent = department.departmentName;
            departmentSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching departments:", error);
    }
}

// Handle search form submission
document.getElementById("search-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload

    const doctorName = document.getElementById("doctor-name").value.trim();
    const departmentName = document.getElementById("department-select").value;

    // Construct query parameters for the search API
    let query = "?";
    if (doctorName) query += `name=${encodeURIComponent(doctorName)}&`;
    if (departmentName) query += `department=${encodeURIComponent(departmentName)}`;

    // Fetch filtered results from the search API
    await fetchDoctors(searchUrl, query);
});

// Handle clear button
document.getElementById("clear-btn").addEventListener("click", async function () {
    // Clear the search inputs
    document.getElementById("doctor-name").value = "";
    document.getElementById("department-select").value = "";

    // Fetch all doctors again
    await fetchDoctors(allDoctorsUrl);
});

// Fetch all doctors and load departments on page load
document.addEventListener("DOMContentLoaded", async () => {
    await fetchDoctors(allDoctorsUrl); // Fetch all doctors
    await loadDepartments(); // Load departments
});
