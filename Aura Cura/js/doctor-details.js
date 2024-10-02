document.addEventListener('DOMContentLoaded', (event) => {
    let doctorId = localStorage.getItem('selectedDoctorId');
    if (doctorId) {
        getDoctorDetails(doctorId);
    }
});


async function getDoctorDetails(doctorId) {
    let url = `https://localhost:44396/api/Doctors/GetDoctorById/${doctorId}`;

    try {
        let request = await fetch(url);
        if (!request.ok) {
            throw new Error("Failed to fetch doctor details");
        }
        let doctor = await request.json();
         console.log(doctor);
   
        document.getElementById("doctor-image").src = `../backend/Auera-Cura/Auera-Cura/Uploads/${doctor.image}`;
  
        document.getElementById("doctor-name").textContent = `Dr. ${doctor.firstName} ${doctor.lastName}`;
        document.getElementById("doctor-specialty").textContent = doctor.specialty;

  
        let starsContainer = document.getElementById("doctor-rating-stars");
        let rating = Math.floor(doctor.rating); 
       
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsContainer.innerHTML += '<i class="fas fa-star"></i>';
            } else {
                starsContainer.innerHTML += '<i class="far fa-star"></i>';
            }
        }
        document.getElementById("doctor-rating").textContent = `${doctor.rating} out of 5`;

        document.getElementById("doctor-experience").textContent = `${doctor.experienceYears} Years of Experience`;

      
        let availability = doctor.availabilityStatus === 'Available' ? 'bg-success' : 'bg-danger';
        document.getElementById("doctor-availability").classList.remove('bg-success', 'bg-danger');
        document.getElementById("doctor-availability").classList.add(availability);
        document.getElementById("doctor-availability").textContent = doctor.availabilityStatus;

      
        document.getElementById("doctor-biography").textContent = doctor.biography;


        let specialtiesContainer = document.getElementById("doctor-specialties");
        if (doctor.specialty && doctor.specialty.length > 0) {
            specialtiesContainer.innerHTML = `<li class="list-group-item">${doctor.specialty}</li>`;
        } else {
            specialtiesContainer.innerHTML = `<li class="list-group-item">No specialties available</li>`;
        }
        
        

        let educationContainer = document.getElementById("doctor-education");
        educationContainer.innerHTML = '';
        if (doctor.education && doctor.education.length > 0) {
            educationContainer.innerHTML = `<li class="list-group-item">${doctor.education}</li>`;
        } else {
            educationContainer.innerHTML = `<li class="list-group-item">No education details available</li>`;
        }
        
        
     

        let workingHoursContainer = document.getElementById("doctor-working-hours");
        workingHoursContainer.innerHTML = '';
        if (doctor.workingHours && doctor.workingHours.length > 0) {
            doctor.workingHours.forEach(day => {
                workingHoursContainer.innerHTML += `<li class="list-group-item"><strong>${day.day}:</strong> ${day.hours}</li>`;
            });
        } else {
            workingHoursContainer.innerHTML = `<li class="list-group-item">No working hours available</li>`;
        }
        
    } catch (error) {
        console.error("Error fetching doctor details:", error);
    }
}