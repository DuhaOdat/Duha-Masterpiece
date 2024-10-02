document.addEventListener('DOMContentLoaded', (event) => {
    let doctorId = localStorage.getItem('selectedDoctorId');
    if (doctorId) {
        getDoctorDetails(doctorId);
    }
});

let departmentId = localStorage.getItem("selectedDepartmentId");
console.log("Department ID:", departmentId); // to ensure the take is correct

let url="https://localhost:44396/api/Departments/allDepartments";

async function getAllDepartments()
{
    try {
        let request = await fetch(url);

        // If the response is not okay, handle the error
        if (!request.ok) {
            throw new Error("Failed to fetch data");
        }
        let data = await request.json();

        let container = document.getElementById("departments-container"); // make sure 'department-container' exists in your HTML
        
        // Check if data is empty
        if (!data || data.length === 0) {
            console.log("No departments found");
            return;
        }
 
    data.forEach(department => {

        container.innerHTML+=`

           <div class="col-lg-4 wow fadeIn" data-wow-delay="0.3s">
                    <div class="case-item position-relative overflow-hidden rounded mb-2 fixed-size">
                        <img class="img-fluid" src="../backend/Auera-Cura/Auera-Cura/Uploads/${department.image}" alt="${department.departmentName}">
                        <a onclick="storeDepartmentId(${department.departmentId})" class="case-overlay text-decoration-none" href="department-details.html?id=${department.departmentId}">
                            <small>${department.departmentName}</small>
                            <span class="btn btn-square btn-primary"><i class="fa fa-arrow-right"></i></span>
                        </a>
                    </div>
                </div>
        
        
        `
        
    });
}catch (error) {
    console.error("Error fetching departments", error);
}

}
getAllDepartments();


function storeDepartmentId(departmentId) {
    localStorage.setItem("selectedDepartmentId", departmentId); }// تخزين الـ departmentId
/************************************* */


let url2="https://localhost:44396/api/Doctors/AllDoctors";

async function getAllDoctors()
{
    try {
        let request = await fetch(url2);

        // If the response is not okay, handle the error
        if (!request.ok) {
            throw new Error("Failed to fetch data");
        }
        let data = await request.json();

        let container = document.getElementById("doctors-container"); 
        
        // Check if data is empty
        if (!data || data.length === 0) {
            console.log("No doctor found");
            return;
        }
        let limitedDoctors = data.slice(0, 4); // Display only the first 4 doctors
        limitedDoctors.forEach(doctor => {

        container.innerHTML+=`
                 
        <div class="col-md-3 wow fadeIn mb-4" data-wow-delay="0.1s">
                        <div class="team-item bg-white text-center rounded p-4 pt-0">
                            <img class="img-fluid rounded-circle p-4" src="../backend/Auera-Cura/Auera-Cura/Uploads/${doctor.image}" alt="${doctor.firstName}">
                            <h5 class="mb-0">${doctor.firstName} ${doctor.lastName}</h5>
                            <small>${doctor.specialty}</small>
                            <div class="d-flex justify-content-center mt-3">
                                <a onclick="storeDoctorId(${doctor.doctorId})"class="btn btn-link" href="doctor-details.html?id=${doctor.doctorId}">More Details</a>
                            </div>
                        </div>
                    </div>
         
        
        
        `
        
    });
}catch (error) {
    console.error("Error fetching doctors", error);
}

}
getAllDoctors();

function storeDoctorId(doctorId) {
    localStorage.setItem('selectedDoctorId', doctorId);
}


/************************************* */


let url3="https://localhost:44396/api/Services/GetAllServices";

async function GetAllServices()
{
    try {
        let request = await fetch(url3);

        // If the response is not okay, handle the error
        if (!request.ok) {
            throw new Error("Failed to fetch data");
        }
        let data = await request.json();
        console.log("Services data:", data); 
        let container = document.getElementById("services-container"); 
        
        // Check if data is empty
        if (!data || data.length === 0) {
            console.log("No services found");
            return;
        }

        data.forEach(service => {
            console.log(service);  // طباعة الخدمة للتحقق من البيانات
        container.innerHTML+=`
                 

           <div class="col-md-4 wow fadeIn" data-wow-delay="0.3s">
                        <div class="service-item d-flex flex-column justify-content-center text-center rounded" style="min-height: 350px; max-height: 350px;">
                            <div class="service-icon btn-square">
                                <i class="material-icons">${service.serviceIcon}</i>
                            </div>
                            <h5 class="mb-3">${service.serviceName}</h5>
                            <p class="mt-2">${service.serviceDescription}</p>
                            <a class="btn px-3 mt-auto mx-auto" href="${service.serviceLink}">Read More</a>
                        </div>
                    </div>
        
        
        `
        
    });
}catch (error) {
    console.error("Error fetching services", error);
}

}
GetAllServices();