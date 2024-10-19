using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly MyDbContext _db;
        public DoctorsController(MyDbContext db)
        {
            _db = db;
        }
        [HttpGet("AllDoctors")]
        public IActionResult GetAllDoctors()
        {
            var doctors = _db.Doctors
                .Include(d => d.User) // Include related User entity for first name and last name
                .Include(d => d.Department) // Include related Department entity for department name
                .Select(d => new
                {
                    d.DoctorId,
                    FullName = d.User != null ? d.User.FirstName + " " + d.User.LastName : "N/A", // Null check for User entity
                    d.Specialty,
                    d.Biography,
                    d.Phone,
                    d.Email,
                    d.ExperienceYears,
                    d.Education,
                    d.AvailabilityStatus,
                    d.IsHead,
                    d.Image,
                    DepartmentName = d.Department != null ? d.Department.DepartmentName : "N/A", // Department name or N/A if null
                    d.DoctorSchedules, // Include doctor schedules if needed
                    IsActive = d.AvailabilityStatus == "Active"
                })
                .ToList();

            if (!doctors.Any())
            {
                return NotFound("No doctors found");
            }

            return Ok(doctors);
        }




        [HttpPut("EditDoctor/{id}")]
        public async Task<IActionResult> EditDoctor(int id, [FromForm] editDoctorDTO editDoctorDTO)
        {
            // Find the existing doctor by Id
            var doctor = await _db.Doctors.FindAsync(id);
            if (doctor == null)
            {
                return NotFound("Doctor not found");
            }

            // Update doctor's fields
            doctor.IsHead = editDoctorDTO.IsHead ?? doctor.IsHead;
            doctor.Specialty = editDoctorDTO.Specialty ?? doctor.Specialty;
            doctor.Biography = editDoctorDTO.Biography ?? doctor.Biography;
            doctor.Phone = editDoctorDTO.Phone ?? doctor.Phone;
            doctor.Rating = editDoctorDTO.Rating ?? doctor.Rating;
            doctor.ExperienceYears = editDoctorDTO.ExperienceYears ?? doctor.ExperienceYears;
            doctor.AvailabilityStatus = editDoctorDTO.AvailabilityStatus ?? doctor.AvailabilityStatus;
            doctor.Education = editDoctorDTO.Education ?? doctor.Education;
            doctor.DepartmentId = editDoctorDTO.DepartmentId ?? doctor.DepartmentId;

            // Handle the image upload
            if (editDoctorDTO.Image != null)
            {
                var imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                if (!Directory.Exists(imagesFolder))
                {
                    Directory.CreateDirectory(imagesFolder);
                }

                var imageFile = Path.Combine(imagesFolder, editDoctorDTO.Image.FileName);
                using (var stream = new FileStream(imageFile, FileMode.Create))
                {
                    await editDoctorDTO.Image.CopyToAsync(stream);
                }
                doctor.Image = editDoctorDTO.Image.FileName;
            }

            // Update the doctor in the database
            _db.Doctors.Update(doctor);
            await _db.SaveChangesAsync();

            return Ok(doctor);
        }

        [HttpGet("GetDoctorByDepartmentId/{departmentId}")]
        public IActionResult GetDoctorByDepartmentId(int departmentId)
        {
            // Check if the department exists
            var department = _db.Departments.Find(departmentId);
            if (department == null)
            {
                return NotFound("Department not found");
            }

            // Get doctors in this department along with their user information
            var doctors = _db.Doctors
                .Where(d => d.DepartmentId == departmentId)
                .Select(d => new
                {
                    d.DoctorId,
                    d.Specialty,
                    d.Email,
                    d.Phone,
                    d.IsHead,
                    d.Image,
                    FirstName = d.User.FirstName, // Assuming User is the navigation property to Users table
                    LastName = d.User.LastName    // Assuming User is the navigation property to Users table
                })
                .ToList();

            // Check if there are any doctors in this department
            if (doctors == null || doctors.Count == 0)
            {
                return NotFound("No doctors found for this department.");
            }

            return Ok(doctors);
        }



        [HttpGet("GetDoctorById/{id}")]
        public IActionResult GetDoctorById(int id)
        {
            var doctor = _db.Doctors
                .Where(d => d.DoctorId == id)
                .Select(d => new
                {
                    d.DoctorId,
                    d.Biography,
                    d.Specialty,
                    d.Image,
                    d.Rating,
                    d.Phone,
                    d.IsHead,
                    d.ExperienceYears,
                    d.Education,
                    d.AvailabilityStatus,
                    FirstName = _db.Users.Where(u => u.Id == d.UserId)
                                         .Select(u => u.FirstName)
                                         .FirstOrDefault(),
                    LastName = _db.Users.Where(u => u.Id == d.UserId)
                                        .Select(u => u.LastName)
                                        .FirstOrDefault(),

                    Email=_db.Users.Where(u => u.Id == d.UserId)
                                   .Select(u=>u.Email)
                                   .FirstOrDefault()
                })
                .FirstOrDefault();

            if (doctor == null)
            {
                return NotFound("Doctor not found");
            }

            return Ok(doctor);
        }


        [HttpGet("GetDoctorByUserId/{userId}")]
        public IActionResult GetDoctorByUserId(int userId)
        {
            var doctor = _db.Doctors
                            .Where(d => d.UserId == userId)
                            .Select(d => new
                            {
                                d.DoctorId,
                                d.Biography,
                                d.Specialty,
                                d.Rating,
                                d.ExperienceYears,
                                d.Education,
                                d.AvailabilityStatus,
                                d.Image,
                                FirstName = d.User.FirstName,   // Accessing FirstName from the related User entity
                                LastName = d.User.LastName,     // Accessing LastName from the related User entity
                                Email = d.User.Email            // Accessing Email from the related User entity
                            })
                            .FirstOrDefault();

            if (doctor == null)
            {
                return NotFound("Doctor not found");
            }

            return Ok(doctor);
        }

        [HttpDelete("DeleteDoctor/{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            // Find the doctor by the provided id
            var doctor = await _db.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.DoctorId == id);

            // If doctor not found, return a 404 Not Found response
            if (doctor == null)
            {
                return NotFound(new { message = "Doctor not found" });
            }

            // Find the user associated with the doctor
            var user = doctor.User;

            // Remove the doctor from the database
            _db.Doctors.Remove(doctor);

            // If there is an associated user, remove the user as well
            if (user != null)
            {
                _db.Users.Remove(user);
            }

            // Save changes to the database
            await _db.SaveChangesAsync();

            // Return a success response
            return Ok(new { message = "Doctor and associated user deleted successfully" });
        }


    }
}
