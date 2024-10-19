using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TechniciansController : ControllerBase
    {
        private readonly MyDbContext _db;

        public TechniciansController(MyDbContext db)
        {
            _db = db;
        }


        [HttpGet("GetTechnicianProfile/{id}")]
        public IActionResult GetTechnicianProfile(int id)
        {
            // نتحقق أولاً من أن المستخدم موجود وله دور "technician"
            var user = _db.Users
                          .Where(u => u.Id == id && u.Role == "Lab Technician")
                          .Select(u => new
                          {
                              u.FirstName,
                              u.LastName,
                              u.Email
                          }).FirstOrDefault();

            if (user == null)
            {
                return NotFound(new { message = "Lab Technician not found" });
            }

            return Ok(user);
        }


        [HttpGet("GetAllLabTestOrders")]
        public async Task<IActionResult> GetAllLabTestOrders()
        {
            // Get all lab test orders, including both pending and completed
            var LabOrders = await _db.LabTestOrders
               .Include(o => o.PatientUser) // Include patient details from Users table
               .Include(o => o.Test) // Include test details from LabTests table
               .Include(o => o.DoctorUser) // Include doctor details
               .Select(o => new
               {
                   o.OrderId,
                   PatientName = o.PatientUser.FirstName + " " + o.PatientUser.LastName, // Concatenating FirstName and LastName
                   TestName = o.Test.TestName, // Assuming there's a TestName field in the LabTests table
                   DoctorName = o.DoctorUser.FirstName + " " + o.DoctorUser.LastName, // Getting the doctor's full name
                   o.OrderDate,
                   o.Status
               })
               .ToListAsync();

            // Return results or indicate if none found
            if (!LabOrders.Any())
            {
                return NotFound("No lab orders found.");
            }

            return Ok(LabOrders);
        }

    }
}
