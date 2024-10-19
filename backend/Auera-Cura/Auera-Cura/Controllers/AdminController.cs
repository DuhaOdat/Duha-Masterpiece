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
                    NormalRange=labTestDto.NormalRange,
                    Unit= labTestDto.Unit,
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


        //[HttpPut("update-lab-test/{id}")]
        //public IActionResult UpdateLabTest(int id, [FromForm] LabTestDTO labTestDto)
        //{
        //    try
        //    {
        //        // Step 1: Validate the input
        //        if (labTestDto == null || string.IsNullOrEmpty(labTestDto.TestName))
        //        {
        //            return BadRequest("Lab test details are required.");
        //        }

        //        // Step 2: Find the lab test in the database by ID
        //        var existingLabTest = _db.LabTests.FirstOrDefault(t => t.TestId == id);
        //        if (existingLabTest == null)
        //        {
        //            return NotFound("Lab test not found.");
        //        }

        //        // Step 3: Update the lab test details
        //        existingLabTest.TestName = labTestDto.TestName;
        //        existingLabTest.Description = labTestDto.Description;
        //        existingLabTest.IsAvailable = labTestDto.IsAvailable;
        //        existingLabTest.NormalRange = labTestDto.NormalRange ?? existingLabTest.NormalRange;
        //        existingLabTest.Unit = labTestDto.Unit ?? existingLabTest.Unit;

        //        existingLabTest.CreatedBy = labTestDto.CreatedBy;  // Assuming the frontend sends the ID of the user making the update
        //        existingLabTest.CreatedDate = DateTime.Now;  // Set the update date to now

        //        // Step 4: Save the changes to the database
        //        _db.SaveChanges();

        //        return Ok(new
        //        {
        //            Message = "Lab test updated successfully.",
        //            LabTest = existingLabTest
        //        });

        //    }
        //    catch (Exception ex)
        //    {
        //        // Log the error
        //        Console.WriteLine($"Error updating lab test: {ex.Message}");
        //        return StatusCode(500, $"Internal server error: {ex.Message}");  // Return the exception message
        //    }
        //}

        [HttpPut("update-lab-test/{id}")]
        public IActionResult UpdateLabTest(int id, [FromForm] LabTestDTO labTestDto)
        {
            // Step 1: Validate the input
            if (labTestDto == null || string.IsNullOrEmpty(labTestDto.TestName))
            {
                Console.WriteLine("TestName is missing or labTestDto is null.");
                return BadRequest("Lab test details are required.");
            }

            // Debug: Log the incoming data for debugging
            Console.WriteLine($"Received TestName: {labTestDto.TestName}, Description: {labTestDto.Description}, IsAvailable: {labTestDto.IsAvailable}");

            var existingLabTest = _db.LabTests.FirstOrDefault(t => t.TestId == id);
            if (existingLabTest == null)
            {
                return NotFound("Lab test not found.");
            }

            // Step 2: Update the lab test details
            existingLabTest.TestName = !string.IsNullOrEmpty(labTestDto.TestName) ? labTestDto.TestName : existingLabTest.TestName;
            existingLabTest.Description = !string.IsNullOrEmpty(labTestDto.Description) ? labTestDto.Description : existingLabTest.Description;
            existingLabTest.IsAvailable = labTestDto.IsAvailable;  // Boolean, so it must be handled
            existingLabTest.NormalRange = !string.IsNullOrEmpty(labTestDto.NormalRange) ? labTestDto.NormalRange : existingLabTest.NormalRange;
            existingLabTest.Unit = !string.IsNullOrEmpty(labTestDto.Unit) ? labTestDto.Unit : existingLabTest.Unit;

            // Save the updated values to the database
            _db.SaveChanges();

            return Ok(new
               {
                   Message = "Lab test updated successfully.",
                    LabTest = existingLabTest
                });
        }




    }
}
