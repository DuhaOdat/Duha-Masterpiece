
// let url="https://localhost:44396/api/Doctors/AllDoctors";

// async function getAllDoctors()
// {
//     try {
//         let request = await fetch(url);

//         // If the response is not okay, handle the error
//         if (!request.ok) {
//             throw new Error("Failed to fetch data");
//         }
//         let data = await request.json();

//         let container = document.getElementById("doctors-container"); 
        
//         // Check if data is empty
//         if (!data || data.length === 0) {
//             console.log("No doctor found");
//             return;
//         }
 
//     data.forEach(doctor => {

//         container.innerHTML+=`
                 
//         <div class="col-md-3 wow fadeIn mb-4" data-wow-delay="0.1s">
//                         <div class="team-item bg-white text-center rounded p-4 pt-0">
//                             <img class="img-fluid rounded-circle p-4" src="../backend/Auera-Cura/Auera-Cura/Uploads/${doctor.image}" alt="${doctor.firstName}">
//                             <h5 class="mb-0">${doctor.firstName} ${doctor.lastName}</h5>
//                             <small>${doctor.specialty}</small>
//                             <div class="d-flex justify-content-center mt-3">
//                                 <a class="btn btn-link" href="doctor-details.html?id=${doctor.doctorId}"  onclick="storeDoctorId(${doctor.doctorId})">More Details</a>
//                             </div>
//                         </div>
//                     </div>
         
        
        
//         `
        
//     });
// }catch (error) {
//     console.error("Error fetching doctors", error);
// }

// }
// getAllDoctors();

// // store DoctorId في localStorage
// function storeDoctorId(doctorId) {
//     localStorage.setItem('selectedDoctorId', doctorId);
// }


let url = "https://localhost:44396/api/Doctors/AllDoctors";

async function getAllDoctors() {
    try {
        let request = await fetch(url);

        // Handle response errors
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

        // Loop through each doctor and populate the container
        data.forEach(doctor => {
            container.innerHTML += `
                <div class="col-md-3 wow fadeIn mb-4" data-wow-delay="0.1s">
                    <div class="team-item bg-white text-center rounded p-4 pt-0">
                        <img class="img-fluid rounded-circle p-4" src="../backend/Auera-Cura/Auera-Cura/Uploads/${doctor.image}" alt="${doctor.firstName}">
                        <h5 class="mb-0">${doctor.firstName} ${doctor.lastName}</h5>
                        <small>${doctor.specialty}</small>
                        <div class="d-flex justify-content-center mt-3">
                            <a class="btn btn-link" href="doctor-details.html?id=${doctor.doctorId}" onclick="storeDoctorId(${doctor.doctorId})">More Details</a>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching doctors", error);
    }
}

getAllDoctors();

// Store DoctorId in localStorage
function storeDoctorId(doctorId) {
    localStorage.setItem('selectedDoctorId', doctorId);
}
