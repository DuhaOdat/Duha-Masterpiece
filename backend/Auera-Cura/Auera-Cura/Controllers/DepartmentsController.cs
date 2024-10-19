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


        [HttpGet("allDepartmentsWithHead")]
        public ActionResult GetAllDepartmentsWithHead()
        {
            var departmentsWithHeads = _db.Departments
                .Select(d => new
                {
                    DepartmentId = d.DepartmentId,
                    DepartmentName = d.DepartmentName,
                    DepartmentDescription = d.DepartmentDescription,
                    Image = d.Image,
                    Phone = d.Phone,
                    NumberOfRooms = d.NumberOfRooms,
                    NumberOfBeds = d.NumberOfBeds,
                    Head = d.Doctors
                        .Where(doc => doc.IsHead == true)
                        .Select(doc => new
                        {
                            FullName = doc.User.FirstName + " " + doc.User.LastName,
                            Image = doc.Image,
                        })
                        .FirstOrDefault() // Assuming only one head per department
                })
                .ToList();

            return Ok(departmentsWithHeads);
        }


        [HttpGet("doctorsInDepartment/{departmentId}")]
        public ActionResult GetDoctorsInDepartment(int departmentId)
        {
            var doctorsInDepartment = _db.Doctors
                .Where(doc => doc.DepartmentId == departmentId)
                .Select(doc => new
                {
                    FullName = doc.User.FirstName + " " + doc.User.LastName,
                    Image = doc.Image
                })
                .ToList();

            return Ok(doctorsInDepartment);
        }


        [HttpPost("AddNewDepartment")]
        public async Task<ActionResult> AddNewDepartment([FromForm] DepartmentDTO departmentDTO)
        {
            if (departmentDTO == null)
            {
                return BadRequest("Department data is null");
            }

            // مسار حفظ الصور
            var imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

            // إنشاء المجلد إذا لم يكن موجودًا
            if (!Directory.Exists(imagesFolder))
            {
                Directory.CreateDirectory(imagesFolder);
            }

            // إنشاء المسار الكامل للصورة
            var imageFile = Path.Combine(imagesFolder, departmentDTO.Image.FileName);

            // نسخ الصورة باستخدام await لضمان اكتمال العملية
            using (var stream = new FileStream(imageFile, FileMode.Create))
            {
                await departmentDTO.Image.CopyToAsync(stream);
            }

            // حفظ البيانات في قاعدة البيانات
            var department = new Department
            {
                DepartmentName = departmentDTO.DepartmentName,
                DepartmentDescription = departmentDTO.DepartmentDescription,
                Image = departmentDTO.Image.FileName, // اسم الصورة
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

        [HttpPut("UpdateDepartment/{id}")]
        public async Task<ActionResult> UpdateDepartment(int id, [FromForm] DepartmentDTO departmentDTO)
        {
            var department = await _db.Departments.FindAsync(id);
            if (department == null)
            {
                return NotFound(new { message = "Department not found" });
            }

            // Update department properties
            department.DepartmentName = departmentDTO.DepartmentName;
            department.DepartmentDescription = departmentDTO.DepartmentDescription;
            department.Phone = departmentDTO.Phone;
            department.NumberOfBeds = departmentDTO.NumberOfBeds;
            department.NumberOfRooms = departmentDTO.NumberOfRooms;

            // Handle image update
            if (departmentDTO.Image != null)
            {
                var imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                var imageFile = Path.Combine(imagesFolder, departmentDTO.Image.FileName);
                using (var stream = new FileStream(imageFile, FileMode.Create))
                {
                    await departmentDTO.Image.CopyToAsync(stream);
                }

                department.Image = departmentDTO.Image.FileName; // Update image path
            }

            await _db.SaveChangesAsync();
            return Ok(new { message = "Department updated successfully" });
        }

        [HttpGet("CanDeleteDepartment/{id}")]
        public async Task<ActionResult> CanDeleteDepartment(int id)
        {
            var department = await _db.Departments.Include(d => d.Doctors).FirstOrDefaultAsync(d => d.DepartmentId == id);

            if (department == null)
            {
                return NotFound(new { message = "Department not found" });
            }

            // Check if any doctors are related to this department
            if (department.Doctors.Any())
            {
                return BadRequest(new { message = "Cannot delete department. There are doctors related to this department." });
            }

            // Check if any doctors have lab tests or medical orders
            foreach (var doctor in department.Doctors)
            {
                var hasLabTests = await _db.LabTestOrders.AnyAsync(l => l.DoctorUserId == doctor.UserId);
                var hasMedicalTests = await _db.MedicalImageOrders.AnyAsync(m => m.DoctorId == doctor.UserId);

                // If any doctor has related lab or medical tests, prevent deletion
                if (hasLabTests || hasMedicalTests)
                {
                    return BadRequest(new { message = "Cannot delete department. Related doctors have test orders." });
                }
            }

            // If no doctors and no related orders, allow deletion
            return Ok(new { message = "Department can be safely deleted" });
        }


        [HttpDelete("DeleteDepartment/{id}")]
        public async Task<ActionResult> DeleteDepartment(int id)
        {
            var department = await _db.Departments.Include(d => d.Doctors).FirstOrDefaultAsync(d => d.DepartmentId == id);

            if (department == null)
            {
                return NotFound(new { message = "Department not found" });
            }

            // Check if any doctors are related to this department
            if (department.Doctors.Any())
            {
                foreach (var doctor in department.Doctors)
                {
                    var hasLabTests = await _db.LabTestOrders.AnyAsync(l => l.DoctorUserId == doctor.UserId);
                    var hasMedicalTests = await _db.MedicalImageOrders.AnyAsync(m => m.DoctorId == doctor.UserId);

                    // If any doctor has related lab or medical tests, prevent deletion
                    if (hasLabTests || hasMedicalTests)
                    {
                        return BadRequest(new { message = "Cannot delete department. Related doctors have test orders." });
                    }
                }
            }

            // If no related doctors or tests, proceed to delete the department
            _db.Departments.Remove(department);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Department deleted successfully" });
        }



    }
}
