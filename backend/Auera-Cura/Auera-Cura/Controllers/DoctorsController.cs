using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
                .Select(d => new
                {
                    d.DoctorId,
                    d.Specialty,
                    d.Image,
                    FirstName = _db.Users.Where(u => u.Id == d.UserId)
                                         .Select(u => u.FirstName)
                                         .FirstOrDefault(),
                    LastName = _db.Users.Where(u => u.Id == d.UserId)
                                        .Select(u => u.LastName)
                                        .FirstOrDefault()
                })
                .ToList();

            if (!doctors.Any())
            {
                return NotFound("No doctors found");
            }

            return Ok(doctors);
        }


        [HttpPost("AddNewDoctor")]
        public async Task<ActionResult> AddNedwDoctor([FromForm] editDoctorDTO addDoctorDTO)
        {
            if (addDoctorDTO == null)
            {
                return BadRequest("doctors data is null");
            }
            var ImagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists(ImagesFolder))
            {
                Directory.CreateDirectory(ImagesFolder);
            }
            var imageFile = Path.Combine(ImagesFolder, addDoctorDTO.Image.FileName);
            using (var stream = new FileStream(imageFile, FileMode.Create))
            {
                await addDoctorDTO.Image.CopyToAsync(stream);
            }

            var doctor = new Doctor
            {
      
                IsHead = addDoctorDTO.IsHead,
                Image = addDoctorDTO.Image.FileName,
                Specialty = addDoctorDTO.Specialty,
                Biography = addDoctorDTO.Biography,
                Phone = addDoctorDTO.Phone,
                ExperienceYears = addDoctorDTO.ExperienceYears,
                Education = addDoctorDTO.Education,
                DepartmentId = addDoctorDTO.DepartmentId
            };
            _db.Doctors.Add(doctor);
            await _db.SaveChangesAsync();
            return Ok(doctor);
        }


        [HttpPut("EditDoctor/{id}")]
        public async Task<IActionResult> EditDoctor(int id, [FromBody] editDoctorDTO editDoctorDTO)
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
                    d.ExperienceYears,
                    d.Education,
                    d.AvailabilityStatus,
                    FirstName = _db.Users.Where(u => u.Id == d.UserId)
                                         .Select(u => u.FirstName)
                                         .FirstOrDefault(),
                    LastName = _db.Users.Where(u => u.Id == d.UserId)
                                        .Select(u => u.LastName)
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
                            .Select(d => new {
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


    }
}
