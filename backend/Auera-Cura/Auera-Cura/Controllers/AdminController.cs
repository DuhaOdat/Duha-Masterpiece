using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly MyDbContext _db;
        public AdminController(MyDbContext db)
        {
            _db = db;
        }

        [HttpPost("add-lab-test")]
        public IActionResult AddLabTest([FromBody] LabTestDTO labTestDto)
        {
            try
            {
                // Step 1: Validate the input
                if (labTestDto == null || string.IsNullOrEmpty(labTestDto.TestName))
                {
                    return BadRequest("Lab test details are required.");
                }

                // Step 2: Validate if CreatedBy (UserID) is provided
                if (labTestDto.CreatedBy == 0)  // Assuming 0 means no valid UserID was passed
                {
                    return Unauthorized("User ID is missing.");
                }

                // Step 3: Create a new LabTest object
                var labTest = new LabTest
                {
                    TestName = labTestDto.TestName,
                    Description = labTestDto.Description,
                    IsAvailable = labTestDto.IsAvailable,
                    CreatedBy = labTestDto.CreatedBy,  // Use the UserID provided by the frontend
                    CreatedDate = DateTime.Now,
                };

                // Step 4: Save the new lab test to the database
                _db.LabTests.Add(labTest);
                _db.SaveChanges();

                return Ok("Lab test added successfully.");
            }
            catch (Exception ex)
            {
                // Log the error (can log to a file, database, or return the error directly)
                Console.WriteLine($"Error adding lab test: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");  // Return the exception message
            }
        }

        [HttpGet("Show-Lab-Test")]
        public IActionResult showLabTest()
        {
            var labtest = _db.LabTests.ToList();
            return Ok(labtest);
        }


        [HttpGet("{id}")]
        public IActionResult GetAdminProfile(int id)
        {
            // نتحقق أولاً من أن المستخدم موجود وله دور "Admin"
            var user = _db.Users
                          .Where(u => u.Id == id && u.Role == "Admin")
                          .Select(u => new
                          {
                              u.FirstName,
                              u.LastName,
                              u.Email
                          }).FirstOrDefault();

            if (user == null)
            {
                return NotFound(new { message = "Admin not found" });
            }

            return Ok(user);
        }


    }
}
