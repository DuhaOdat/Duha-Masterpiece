using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly MyDbContext _db;
        public DepartmentsController( MyDbContext db)
        {
            _db = db;
            
        }

        [HttpGet("allDepartments")]
        public ActionResult GetAllDepartments()
        {
            var departments= _db.Departments.ToList();
            return Ok(departments);

        }

        



        [HttpPost("AddNewDepartment")]
        public async Task<ActionResult> AddNedwDepartment([FromForm] DepartmentDTO departmentDTO)
        {
            if (departmentDTO == null)
            {
                return BadRequest("Department data is null");
            }
            var ImagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists(ImagesFolder))
            {
                Directory.CreateDirectory(ImagesFolder);
            }
            var imageFile = Path.Combine(ImagesFolder, departmentDTO.Image.FileName);
            using (var stream = new FileStream(imageFile, FileMode.Create))
            {
                departmentDTO.Image.CopyToAsync(stream);
            }

            var department = new Department
            {
                DepartmentName = departmentDTO.DepartmentName,
                DepartmentDescription = departmentDTO.DepartmentDescription,
                Image = departmentDTO.Image.FileName,
                Phone = departmentDTO.Phone,
                NumberOfBeds = departmentDTO.NumberOfBeds,
                NumberOfRooms = departmentDTO.NumberOfRooms,
            };
            _db.Departments.Add(department);
            await _db.SaveChangesAsync();
            return Ok(department);

        }

        [HttpGet("GetDepartmentById/{id}")]
        public IActionResult GetDepartmentById(int id)
        {
            var department = _db.Departments
                .Include(d => d.Doctors)  // Include doctors related to the department
                .FirstOrDefault(d => d.DepartmentId == id);

            if (department == null)
            {
                return NotFound();
            }

            // Find the head doctor using the UserId from the Users table
            var headDoctor = department.Doctors
                .Where(d => d.IsHead == true)
                .Select(d => new
                {
                    DoctorId = d.DoctorId,
                    FullName = _db.Users.Where(u => u.Id == d.UserId)
                                        .Select(u => u.FirstName + " " + u.LastName)
                                        .FirstOrDefault()
                })
                .FirstOrDefault();

            // Construct the response object
            var result = new
            {
                department.DepartmentId,
                department.DepartmentName,
                department.DepartmentDescription,
                department.Image,
                department.Phone,
                department.NumberOfRooms,
                department.NumberOfBeds,
                HeadDoctor = headDoctor != null ? headDoctor.FullName : "No Head"
            };

            return Ok(result);
        }




    }
}
