document.addEventListener('DOMContentLoaded', (event) => {
    let departmentId = localStorage.getItem("selectedDepartmentId");
    console.log("Loaded Department ID:", departmentId); // للتحقق

    if (departmentId) {
        getDepartmentDetails(departmentId); 
        getDoctorsByDepartmentId(departmentId);
    } else {
        console.error("No department selected in localStorage.");
        document.getElementById("doctors-container").innerHTML = "<p>No department selected. Please choose a department.</p>";
    }
});

/******************************************************* */

async function getDepartmentDetails(departmentId) {
    let url = `https://localhost:44396/api/Departments/GetDepartmentById/${departmentId}`;
    try {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch department details");
        }

        let data = await response.json();
        document.getElementById("department-name2").textContent = `Doctors in ${data.departmentName} Department`;

        // Update HTML with the fetched data
        document.getElementById("department-image").src = `../backend/Auera-Cura/Auera-Cura/Uploads/${data.image}`;
        document.getElementById("department-name").textContent = data.departmentName;
        document.getElementById("department-description").textContent = data.departmentDescription;
        document.getElementById("head-doctor").textContent = `Head: ${data.headDoctor}`;
        document.getElementById("phone").textContent = `Phone: ${data.phone}`;
        document.getElementById("rooms").textContent = `Number of Rooms: ${data.numberOfRooms}`;
        document.getElementById("beds").textContent = `Number of Beds: ${data.numberOfBeds}`;

    } catch (error) {
        console.error("Error fetching department details:", error);
    }
}

/******************************************************* */

async function getDoctorsByDepartmentId(departmentId) {
    let url = `https://localhost:44396/api/Doctors/GetDoctorByDepartmentId/${departmentId}`;
    try {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch doctors");
        }

        let data = await response.json();
        let container = document.getElementById("doctors-container");

        // Clear any existing doctors before adding new ones
        container.innerHTML = '';

        // Check if no doctors are returned
        if (!data || data.length === 0) {
            container.innerHTML = "<p>No doctors available in this department.</p>";
            return;
        }

        // Display each doctor in the HTML
        data.forEach(doctor => {
            container.innerHTML += `
                <div class="col-md-3 wow fadeIn mb-4" data-wow-delay="0.1s">
                    <div class="team-item bg-white text-center rounded p-4 pt-0">
                        <img class="img-fluid rounded-circle p-4" src="../backend/Auera-Cura/Auera-Cura/Uploads/${doctor.image}" alt="${doctor.firstName}">
                        <h5 class="mb-0">${doctor.firstName} ${doctor.lastName}</h5>
                        <small>${doctor.specialty}</small>
                        <div class="d-flex justify-content-center mt-3">
                             <a onclick="storeDoctorId(${doctor.doctorId})" href="doctor-details.html?id=${doctor.doctorId}" class="btn btn-primary rounded-pill">View Profile</a>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching doctors:", error);
    }
}

/******************************************************* */

function storeDoctorId(doctorId) {
    localStorage.setItem('selectedDoctorId', doctorId);
}
