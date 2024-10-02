using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class labTestController : ControllerBase
    {
        private readonly MyDbContext _db;
        public labTestController(MyDbContext db)
        {
            _db = db;
        }

        [HttpGet("GetPatients")]
        public IActionResult GetPatients()
        {
            // Fetch patients from Users table where Role is 'Patient'
            var patients = _db.Users
                              .Where(u => u.Role == "Patient")
                              .Select(u => new {
                                  u.Id,
                                  u.FirstName,
                                  u.LastName,
                                  u.Email
                              })
                              .ToList();

            if (!patients.Any())
            {
                return NotFound("No patients found.");
            }

            return Ok(patients);
        }

        [HttpGet("GetLabTests")]
        public IActionResult GetLabTests()
        {
            // Fetch all available lab tests (IsAvailable = true)
            var labTests = _db.LabTests
                              .Where(lt => lt.IsAvailable == true)
                              .Select(lt => new {
                                  lt.TestId,
                                  lt.TestName,
                                  lt.Description
                              })
                              .ToList();

            if (!labTests.Any())
            {
                return NotFound("No lab tests available.");
            }

            return Ok(labTests);
        }

        [HttpPost("CreateLabTestOrder")]
        public async Task<IActionResult> CreateLabTestOrder([FromForm] CreateLabTestOrderDTO createLabTestOrderDTO)
        {
            try
            {
                // Validate if patient exists
                var patient = await _db.Users.FindAsync(createLabTestOrderDTO.PatientId);
                if (patient == null)
                {
                    return NotFound("Patient not found.");
                }

                // Validate if the test exists
                var labTest = await _db.LabTests.FindAsync(createLabTestOrderDTO.TestId);
                if (labTest == null)
                {
                    return NotFound("Lab test not found.");
                }

                // Validate if the doctor exists
                var doctor = await _db.Users.FindAsync(createLabTestOrderDTO.DoctorId);
                if (doctor == null || doctor.Role != "Doctor")
                {
                    return BadRequest("Invalid Doctor ID.");
                }

                // Create a new Lab Test Order
                var labTestOrder = new LabTestOrder
                {
                    TestId = createLabTestOrderDTO.TestId,
                    PatientUserId = createLabTestOrderDTO.PatientId,
                    DoctorUserId = createLabTestOrderDTO.DoctorId,
                    OrderDate = DateTime.Now,
                    Status = "Pending"
                };

                // Add the new order to the database
                _db.LabTestOrders.Add(labTestOrder);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Lab test order created successfully.", orderId = labTestOrder.OrderId });
            }
            catch (Exception ex)
            {
                // Log the exception and return a detailed message for debugging
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("getAllTestOrder")]
        public IActionResult getAllTestOrder()
        {
            var order=_db.LabTestOrders.ToList();
            return Ok(order);
        }


        [HttpGet("GetPendingLabTestsForPatient/{patientId}")]
        public async Task<IActionResult> GetPendingLabTestsForPatient(int patientId)
        {
            try
            {
                // Validate if the patient exists
                var patient = await _db.Users.FindAsync(patientId);
                if (patient == null)
                {
                    return NotFound("Patient not found.");
                }

                // Fetch pending lab test orders for the given patient
                var pendingLabTests = await _db.LabTestOrders
                    .Where(o => o.PatientUserId == patientId && o.Status == "Pending")
                    .Select(o => new
                    {
                        o.OrderId,
                        o.OrderDate,
                        o.Status,
                        TestName = o.Test.TestName,  // Assuming you have a navigation property to LabTests
                        o.DoctorUserId,
                        DoctorName = _db.Users
                                        .Where(u => u.Id == o.DoctorUserId)
                                        .Select(u => u.FirstName + " " + u.LastName)
                                        .FirstOrDefault()
                    })
                    .ToListAsync();

                if (pendingLabTests == null || pendingLabTests.Count == 0)
                {
                    return NotFound("No pending lab tests found for this patient.");
                }

                return Ok(pendingLabTests);
            }
            catch (Exception ex)
            {
                // Log the error
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }




        [HttpGet("GetCompletedLabTestsForPatient/{patientId}")]
        public async Task<IActionResult> GetCompletedLabTestsForPatient(int patientId)
        {
            try
            {
                // Validate if the patient exists
                var patient = await _db.Users.FindAsync(patientId);
                if (patient == null)
                {
                    return NotFound("Patient not found.");
                }

                // Fetch Completed lab test orders for the given patient
                var completedLabTests = await _db.LabTestOrders
                    .Where(o => o.PatientUserId == patientId && o.Status == "Completed")
                    .Select(o => new
                    {
                        o.OrderId,
                        o.OrderDate,
                        o.Status,
                        TestName = o.Test.TestName,  // Assuming you have a navigation property to LabTests
                        o.DoctorUserId,
                        DoctorName = _db.Users
                                        .Where(u => u.Id == o.DoctorUserId)
                                        .Select(u => u.FirstName + " " + u.LastName)
                                        .FirstOrDefault()
                    })
                    .ToListAsync();

                if (completedLabTests == null || completedLabTests.Count == 0)
                {
                    return NotFound("No pending lab tests found for this patient.");
                }

                return Ok(completedLabTests);
            }
            catch (Exception ex)
            {
                // Log the error
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }





        [HttpPost("UploadLabTestResult")]
        public async Task<IActionResult> UploadLabTestResult([FromForm] UploadLabTestResultDTO uploadResultDTO)
        {
            // Validate if the lab test order exists
            var labTestOrder = await _db.LabTestOrders
                .Include(o => o.PatientUser) // Include the patient to notify later
                .Include(o => o.DoctorUser)  // Include the doctor to notify later
                .FirstOrDefaultAsync(o => o.OrderId == uploadResultDTO.OrderId);

            if (labTestOrder == null)
            {
                return NotFound("Lab test order not found.");
            }

            // Validate if the lab technician exists
            var labTechnician = await _db.Users.FindAsync(uploadResultDTO.UploadedByLabTech);
            if (labTechnician == null || labTechnician.Role != "Lab Technician")
            {
                return BadRequest("Invalid Lab Technician ID.");
            }

            // Create a new Lab Test Result
            var labTestResult = new LabTestResult
            {
                OrderId = uploadResultDTO.OrderId,
                Result = uploadResultDTO.Result,
                UploadedByLabTech = uploadResultDTO.UploadedByLabTech,
                UploadDate = DateTime.Now,
                CompleteDate = DateTime.Now,
                Status = "Completed" // Set the status to completed
            };

            // Update the status of the lab test order to "Completed"
            labTestOrder.Status = "Completed";

            // Save the result and the updated order status
            _db.LabTestResults.Add(labTestResult);
            await _db.SaveChangesAsync();

            // Notify the patient and doctor (Optional)
            if (labTestOrder.PatientUserId.HasValue)
            {
                await NotifyUser(labTestOrder.PatientUserId.Value, "Your lab test result is ready.");
            }

            if (labTestOrder.DoctorUserId.HasValue)
            {
                await NotifyUser(labTestOrder.DoctorUserId.Value, "The lab test result for your patient is available.");
            }

            return Ok(new { message = "Lab test result uploaded successfully.", resultId = labTestResult.ResultId });
        }

            private async Task NotifyUser(int userId, string message)
        {
            // Check if the user exists
            var user = await _db.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found.");
            }

            // Create a new notification
            var notification = new Notification
            {
                UserId = userId,
                Message = message,
                IsRead = false,  // Mark as unread
                CreatedDate = DateTime.Now
            };

            // Add the notification to the database
            _db.Notifications.Add(notification);
            await _db.SaveChangesAsync();
        }




        [HttpGet("GetAllLabResultsForDoctor/{doctorId}")]
        public async Task<IActionResult> GetAllLabResultsForDoctor(int doctorId)
        {
            var doctor = await _db.Users.FindAsync(doctorId);
            if (doctor == null || doctor.Role != "Doctor")
            {
                return BadRequest("Invalid Doctor ID.");
            }

            // Get all lab test orders where the doctor is associated
            var labResults = await _db.LabTestResults
                .Include(r => r.Order)
                .ThenInclude(o => o.PatientUser)
                .Where(r => r.Order.DoctorUserId == doctorId)
                .Select(r => new
                {
                    r.ResultId,
                    r.OrderId,
                    PatientName = r.Order.PatientUser.FirstName + " " + r.Order.PatientUser.LastName, // Concatenating FirstName and LastName
                    r.Result,
                    r.Status,
                    r.UploadDate,
                    r.CompleteDate
                })
                .ToListAsync();

            if (labResults.Count == 0)
            {
                return NotFound("No lab results found for this doctor.");
            }

            return Ok(labResults);
        }


        [HttpGet("GetPendingLabResultsForDoctor/{doctorId}")]
        public async Task<IActionResult> GetPendingLabResultsForDoctor(int doctorId)
        {
            var doctor = await _db.Users.FindAsync(doctorId);
            if (doctor == null || doctor.Role != "Doctor")
            {
                return BadRequest("Invalid Doctor ID.");
            }

            // Get all pending lab test orders where the doctor is associated
            var pendingLabResults = await _db.LabTestResults
                .Include(r => r.Order)
                .ThenInclude(o => o.PatientUser)
                .Where(r => r.Order.DoctorUserId == doctorId && r.Status == "Pending")
                .Select(r => new
                {
                    r.ResultId,
                    r.OrderId,
                    PatientName = r.Order.PatientUser.FirstName + " " + r.Order.PatientUser.LastName, // Concatenating FirstName and LastName
                    r.Status,
                    r.UploadDate
                })
                .ToListAsync();

            if (pendingLabResults.Count == 0)
            {
                return NotFound("No pending lab results found for this doctor.");
            }

            return Ok(pendingLabResults);
        }


        [HttpGet("GetCompletedLabResultsForDoctor/{doctorId}")]
        public async Task<IActionResult> GetCompletedLabResultsForDoctor(int doctorId)
        {
            var doctor = await _db.Users.FindAsync(doctorId);
            if (doctor == null || doctor.Role != "Doctor")
            {
                return BadRequest("Invalid Doctor ID.");
            }

            // Get all completed lab test orders where the doctor is associated
            var completedLabResults = await _db.LabTestResults
                .Include(r => r.Order)
                .ThenInclude(o => o.PatientUser)
                .Where(r => r.Order.DoctorUserId == doctorId && r.Status == "Completed")
                .Select(r => new
                {
                    r.ResultId,
                    r.OrderId,
                    PatientName = r.Order.PatientUser.FirstName + " " + r.Order.PatientUser.LastName, // Concatenating FirstName and LastName
                    r.Result,
                    r.CompleteDate
                })
                .ToListAsync();

            if (completedLabResults.Count == 0)
            {
                return NotFound("No completed lab results found for this doctor.");
            }

            return Ok(completedLabResults);
        }






    }
}
