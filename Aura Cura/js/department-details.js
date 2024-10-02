
// document.addEventListener('DOMContentLoaded', (event) => {
//     let doctorId = localStorage.getItem('selectedDoctorId');
//     if (doctorId) {
//         getDoctorDetails(doctorId);
//     }
// });


// let departmentId = localStorage.getItem("selectedDepartmentId");
// console.log("Department ID:", departmentId); // to ensure the take is correct

// let url=`https://localhost:44396/api/Departments/GetDepartmentById/${departmentId}`;


// async function getDepartmentDetails(departmentId) 
// {

//     try {
//         let response = await fetch(url);

//         // تحقق مما إذا كان الطلب ناجحاً
//         if (!response.ok) {
//             throw new Error("Failed to fetch department details");
//         }

//         let data = await response.json();
//         document.getElementById("department-name2").textContent = `Doctors in ${data.departmentName} Department`;
//         console.log(data);

//         // تحديث HTML بالبيانات المسترجعة
//         document.getElementById("department-image").src = `../backend/Auera-Cura/Auera-Cura/Uploads/${data.image}`;
//         document.getElementById("department-name").textContent = data.departmentName;
//         document.getElementById("department-description").textContent = data.departmentDescription;
//         document.getElementById("head-doctor").textContent = `Head: ${data.headDoctor}`;
//         document.getElementById("phone").textContent = `Phone: ${data.phone}`;
//         document.getElementById("rooms").textContent = `Number of Rooms: ${data.numberOfRooms}`;
//         document.getElementById("beds").textContent = `Number of Beds: ${data.numberOfBeds}`;
  
//     } catch (error) {
//         console.error("Error fetching department details:", error);
//     }
// }

// // استدعاء الدالة لجلب بيانات القسم
// getDepartmentDetails();


// /******************************************************* */

// let departmentId2 = localStorage.getItem("selectedDepartmentId"); // استرجاع الـ departmentId من الـ localStorage
// let url2 = `https://localhost:44396/api/Doctors/GetDoctorByDepartmentId/${departmentId2}`;

// async function getDoctorsByDepartmentId() {
//     try {
//         let response = await fetch(url2);

//         if (!response.ok) {
//             throw new Error("Failed to fetch doctors");
//         }

//         let data = await response.json();
//         console.log(data); 
//         let container = document.getElementById("doctors-container");

    

//         // عرض كل طبيب في الـ HTML
//         data.forEach(doctor => {
          
//             container.innerHTML += `
//                 <div class="col-md-3 wow fadeIn mb-4" data-wow-delay="0.1s">
//                     <div class="team-item bg-white text-center rounded p-4 pt-0">
//                         <img class="img-fluid rounded-circle p-4" src="../backend/Auera-Cura/Auera-Cura/Uploads/${doctor.image}" alt="${doctor.firstName}">
//                         <h5 class="mb-0">${doctor.firstName} ${doctor.lastName}</h5>
//                         <small>${doctor.specialty}</small>
//                         <div class="d-flex justify-content-center mt-3">
//                              <a onclick="storeDoctorId(${doctor.doctorId})"href="doctor-details.html?id=${doctor.doctorId}" class="btn btn-primary rounded-pill">View Profile</a>
//                         </div>
//                     </div>
//                 </div>
//             `;
//         });
//     } catch (error) {
//         console.error("Error fetching doctors:", error);
//     }
// }


// getDoctorsByDepartmentId();


// function storeDoctorId(doctorId) {
//     localStorage.setItem('selectedDoctorId', doctorId);
// }


document.addEventListener('DOMContentLoaded', (event) => {
    let doctorId = localStorage.getItem('selectedDoctorId');
    if (doctorId) {
        getDoctorDetails(doctorId);
    }

    let departmentId = localStorage.getItem("selectedDepartmentId");
    if (departmentId) {
        getDepartmentDetails(departmentId); 
        getDoctorsByDepartmentId(departmentId); // Only call if departmentId exists
    }
});

/******************************************************* */

async function getDepartmentDetails(departmentId) 
{
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
