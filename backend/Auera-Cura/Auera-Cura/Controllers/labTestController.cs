using PdfSharpCore.Pdf;
using PdfSharpCore.Drawing;
using System.IO;

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
        public async Task<IActionResult> GetAllTestOrders()
        {
            try
            {
                // Fetch all lab test orders with related data
                var orders = await _db.LabTestOrders
                    .Include(o => o.DoctorUser) // Assuming LabTestOrder has a navigation property DoctorUser
                    .Include(o => o.PatientUser) // Assuming LabTestOrder has a navigation property PatientUser
                    .Include(o => o.Test) // Assuming LabTestOrder has a navigation property Test (LabTest)
                    .Select(order => new
                    {
                        order.OrderId,
                        TestName = order.Test != null ? order.Test.TestName : "N/A", // Assuming LabTest has a property TestName
                        order.OrderDate,
                        order.Status,
                        DoctorName = order.DoctorUser != null ? order.DoctorUser.FirstName + " " + order.DoctorUser.LastName : "N/A",
                        PatientName = order.PatientUser != null ? order.PatientUser.FirstName + " " + order.PatientUser.LastName : "N/A"
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                // Log the error for debugging (optional)
                Console.WriteLine(ex.Message);

                // Return a generic error message
                return StatusCode(500, new { message = "An error occurred while retrieving lab test orders." });
            }
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
                    .Include(o => o.DoctorUser)  // Eager load the DoctorUser relationship
                    .Include(o => o.Test)        // Eager load the LabTest relationship
                    .Where(o => o.PatientUserId == patientId && o.Status == "Pending")
                    .Select(o => new
                    {
                        o.OrderId,
                        o.OrderDate,
                        o.Status,
                        TestName = o.Test.TestName,  // Assuming you have a navigation property to LabTests
                        DoctorName = o.DoctorUser != null ? o.DoctorUser.FirstName + " " + o.DoctorUser.LastName : "Unknown"
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

                // Fetch completed lab test results for the given patient
                var completedLabTests = await _db.LabTestResults
                    .Include(r => r.Order) // Include the LabTestOrders
                    .ThenInclude(o => o.Test) // Include the LabTest
                    .Include(r => r.Order.DoctorUser) // Include the DoctorUser
                    .Where(r => r.Order.PatientUserId == patientId && r.Status == "Completed")
                    .Select(r => new
                    {
                        r.OrderId,
                        r.Order.OrderDate,
                        r.CompleteDate,  // Assuming this is stored in LabTestResults
                        r.Status,
                        TestName = r.Order.Test.TestName,  // Assuming you have a navigation property to LabTests
                        DoctorName = r.Order.DoctorUser != null ? r.Order.DoctorUser.FirstName + " " + r.Order.DoctorUser.LastName : "Unknown",
              
                    })
                    .ToListAsync();

                if (completedLabTests == null || completedLabTests.Count == 0)
                {
                    return NotFound("No completed lab tests found for this patient.");
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



        [HttpGet("GetAllLabTestOrdersForDoctor/{doctorId}")]
        public async Task<IActionResult> GetAllLabTestOrdersForDoctor(int doctorId)
        {
            // Check if the doctor exists
            var doctor = await _db.Users.FindAsync(doctorId);
            if (doctor == null || doctor.Role != "Doctor")
            {
                return BadRequest("Invalid Doctor ID.");
            }

            // Get all lab test order for this doctor, including both pending and completed
            var LabOrders = await _db.LabTestOrders
               .Include(o => o.PatientUser) // Include patient details from Users table
               .Include(o => o.Test) // Include test details from LabTests table
               .Include(o => o.DoctorUser) // Include doctor details
               .Where(o => o.DoctorUserId == doctorId )
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
                return NotFound("No lab LabOrders found for this doctor.");
            }

            return Ok(LabOrders);
        }


        [HttpGet("GetPendingLabTestOrdersForDoctor/{doctorId}")]
        public async Task<IActionResult> GetPendingLabTestOrdersForDoctor(int doctorId)
        {
            // Check if the doctor exists
            var doctor = await _db.Users.FindAsync(doctorId);
            if (doctor == null || doctor.Role != "Doctor")
            {
                return BadRequest("Invalid Doctor ID.");
            }

            // Get all pending lab test orders where the doctor is associated
            var pendingLabOrders = await _db.LabTestOrders
                .Include(o => o.PatientUser) // Include patient details from Users table
                .Include(o => o.Test) // Include test details from LabTests table
                .Where(o => o.DoctorUserId == doctorId && o.Status == "Pending")
                .Select(o => new
                {
                    o.OrderId,
                    PatientName = o.PatientUser.FirstName + " " + o.PatientUser.LastName, // Concatenating FirstName and LastName
                    TestName = o.Test.TestName, // Assuming there's a TestName field in the LabTests table
                    o.OrderDate,
                    o.Status
                })
                .ToListAsync();

            // Check if there are any pending orders
            if (pendingLabOrders.Count == 0)
            {
                return NotFound("No pending lab test orders found for this doctor.");
            }

            return Ok(pendingLabOrders);
        }


        [HttpGet("GetCompletedLabTestOrdersForDoctor/{doctorId}")]
        public async Task<IActionResult> GetCompletedLabTestOrdersForDoctor(int doctorId)
        {
            // Check if the doctor exists
            var doctor = await _db.Users.FindAsync(doctorId);
            if (doctor == null || doctor.Role != "Doctor")
            {
                return BadRequest("Invalid Doctor ID.");
            }

            // Get all Completedlab test orders where the doctor is associated
            var CompletedLabOrders = await _db.LabTestOrders
                .Include(o => o.PatientUser) // Include patient details from Users table
                .Include(o => o.Test) // Include test details from LabTests table
                .Where(o => o.DoctorUserId == doctorId && o.Status == "Completed")
                .Select(o => new
                {
                    o.OrderId,
                    PatientName = o.PatientUser.FirstName + " " + o.PatientUser.LastName, // Concatenating FirstName and LastName
                    TestName = o.Test.TestName, // Assuming there's a TestName field in the LabTests table
                    o.OrderDate,
                    o.Status
                })
                .ToListAsync();

            // Check if there are any Completed orders
            if (CompletedLabOrders.Count == 0)
            {
                return NotFound("No Completed lab test orders found for this doctor.");
            }

            return Ok(CompletedLabOrders);
        }

        [HttpDelete("DeleteOrder/{orderId}")]
        public async Task<IActionResult> DeleteLabTestOrder(int orderId)
        {
            // Find the order by ID
            var labTestOrder = await _db.LabTestOrders.FindAsync(orderId);

            // Check if the order exists
            if (labTestOrder == null)
            {
                return NotFound("Lab test order not found.");
            }

            // Allow deletion only if the status is "Pending"
            if (labTestOrder.Status != "Pending")
            {
                return BadRequest("Only pending orders can be deleted.");
            }

            // Remove the lab test order from the database (or mark as canceled)
            _db.LabTestOrders.Remove(labTestOrder);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Lab test order deleted successfully." });
        }



        [HttpGet("DownloadLabResult/{orderId}")]
        public IActionResult DownloadLabResult(int orderId)
        {
            // جلب البيانات الخاصة باختبار المريض بناءً على orderId
            var result = _db.LabTestResults
                            .Include(r => r.Order.PatientUser) // جلب تفاصيل المريض من LabTestOrder
                            .ThenInclude(p => p.PatientProfile) // جلب تفاصيل الملف الشخصي للمريض
                            .Include(r => r.Order.Test)    // جلب تفاصيل الاختبار
                            .Include(r => r.Order.DoctorUser)  // جلب تفاصيل الدكتور
                            .Include(r => r.UploadedByLabTechNavigation)  // جلب تفاصيل الفني
                            .FirstOrDefault(r => r.OrderId == orderId); // استخدام orderId بدلاً من resultId

            if (result == null)
            {
                return NotFound("Result not found.");
            }

            // إنشاء مستند PDF جديد
            PdfDocument document = new PdfDocument();
            document.Info.Title = "Lab Test Result";

            // إضافة صفحة جديدة للمستند
            PdfPage page = document.AddPage();
            XGraphics gfx = XGraphics.FromPdfPage(page);

            // إعداد الخطوط
            XFont titleFont = new XFont("Arial", 20, XFontStyle.Bold);
            XFont headerFont = new XFont("Arial", 14, XFontStyle.Bold);
            XFont regularFont = new XFont("Arial", 12);

            // إضافة الشعار (إذا كنت ترغب بإضافة صورة للشعار)
            gfx.DrawString("Aurea Cura", titleFont, XBrushes.Black, new XRect(0, 40, page.Width, 50), XStringFormats.TopCenter);

            // إضافة عنوان الفحص
            gfx.DrawString("Lab Test Result", titleFont, XBrushes.Black, new XRect(0, 90, page.Width, 50), XStringFormats.TopCenter);

            // معلومات المريض
            int yPos = 150;  // تعديل الموقع الرأسي
            int leftColumnX = 50; // موقع العمود الأيسر (معلومات المريض)
            int rightColumnX = 350; // موقع العمود الأيمن (معلومات الدكتور والفني)

            // عرض معلومات المريض على الجهة اليسرى
            gfx.DrawString($"Patient Name: {result.Order.PatientUser.FirstName} {result.Order.PatientUser.LastName}", regularFont, XBrushes.Black, leftColumnX, yPos);

            // معلومات إضافية للمريض (الجنس والعمر)
            if (result.Order.PatientUser.PatientProfile != null)
            {
                var patientProfile = result.Order.PatientUser.PatientProfile;

                // التأكد من وجود تاريخ الميلاد
                var dob = patientProfile.DateOfBirth.HasValue
                          ? patientProfile.DateOfBirth.Value.ToShortDateString()
                          : "N/A";

                // حساب العمر
                int age = 0;
                if (patientProfile.DateOfBirth.HasValue)
                {
                    var today = DateTime.Today;
                    var birthDate = patientProfile.DateOfBirth.Value.ToDateTime(TimeOnly.MinValue); // تحويل DateOnly إلى DateTime

                    age = today.Year - birthDate.Year;

                    // التحقق إذا كان تاريخ الميلاد لم يمر بعد في السنة الحالية
                    if (birthDate > today.AddYears(-age))
                    {
                        age--;
                    }
                }

                gfx.DrawString($"Gender: {patientProfile.Gender ?? "N/A"}", regularFont, XBrushes.Black, leftColumnX, yPos + 20);
                gfx.DrawString($"DOB: {dob}", regularFont, XBrushes.Black, leftColumnX, yPos + 40);
                gfx.DrawString($"Age: {age}", regularFont, XBrushes.Black, leftColumnX, yPos + 60);
            }
            else
            {
                // إذا كانت بيانات الملف الشخصي للمريض غير موجودة
                gfx.DrawString("Gender: N/A", regularFont, XBrushes.Black, leftColumnX, yPos + 20);
                gfx.DrawString("DOB: N/A", regularFont, XBrushes.Black, leftColumnX, yPos + 40);
                gfx.DrawString("Age: N/A", regularFont, XBrushes.Black, leftColumnX, yPos + 60);
            }

            // عرض معلومات الدكتور والفني على الجهة اليمنى
            gfx.DrawString($"Doctor: {result.Order.DoctorUser?.FirstName ?? "N/A"} {result.Order.DoctorUser?.LastName ?? "N/A"}", regularFont, XBrushes.Black, rightColumnX, yPos);
            gfx.DrawString($"Lab Technician: {result.UploadedByLabTechNavigation?.FirstName ?? "N/A"} {result.UploadedByLabTechNavigation?.LastName ?? "N/A"}", regularFont, XBrushes.Black, rightColumnX, yPos + 20);

            // رسم الجدول لعرض النتائج
            yPos += 140; // تعديل الموقع الرأسي للجدول

            // رسم رؤوس الجدول
            int tableStartX = 50;
            int tableWidth = (int)page.Width - 100;
            int col1Width = 150;
            int col2Width = 100;
            int col3Width = 100;
            int col4Width = 100;

            gfx.DrawRectangle(XPens.Black, tableStartX, yPos, tableWidth, 25);  // رسم حدود الجدول
            gfx.DrawString("Test Name", headerFont, XBrushes.Black, new XRect(tableStartX, yPos, col1Width, 25), XStringFormats.Center);
            gfx.DrawString("Result", headerFont, XBrushes.Black, new XRect(tableStartX + col1Width, yPos, col2Width, 25), XStringFormats.Center);
            gfx.DrawString("Normal Range", headerFont, XBrushes.Black, new XRect(tableStartX + col1Width + col2Width, yPos, col3Width, 25), XStringFormats.Center);
            gfx.DrawString("Unit", headerFont, XBrushes.Black, new XRect(tableStartX + col1Width + col2Width + col3Width, yPos, col4Width, 25), XStringFormats.Center);

            // رسم محتوى الجدول
            yPos += 25;
            gfx.DrawRectangle(XPens.Black, tableStartX, yPos, tableWidth, 25);
            gfx.DrawString(result.Order.Test.TestName ?? "N/A", regularFont, XBrushes.Black, new XRect(tableStartX, yPos, col1Width, 25), XStringFormats.Center);
            gfx.DrawString(result.Result ?? "N/A", regularFont, XBrushes.Black, new XRect(tableStartX + col1Width, yPos, col2Width, 25), XStringFormats.Center);
            gfx.DrawString(result.Order.Test.NormalRange ?? "N/A", regularFont, XBrushes.Black, new XRect(tableStartX + col1Width + col2Width, yPos, col3Width, 25), XStringFormats.Center);
            gfx.DrawString(result.Order.Test.Unit ?? "N/A", regularFont, XBrushes.Black, new XRect(tableStartX + col1Width + col2Width + col3Width, yPos, col4Width, 25), XStringFormats.Center);

            // تاريخ اكتمال الاختبار
            yPos += 40;
            gfx.DrawString($"Completed Date: {result.CompleteDate?.ToString("MM/dd/yyyy") ?? "N/A"}", regularFont, XBrushes.Black, 50, yPos);

            // حفظ المستند في MemoryStream
            using (var stream = new MemoryStream())
            {
                document.Save(stream, false);
                stream.Position = 0;

                // إرجاع الملف بصيغة PDF
                return File(stream.ToArray(), "application/pdf", "LabTestResult.pdf");
            }
        }


        [HttpGet("GetAllLabTestResults")]
        public IActionResult GetAllLabTestResults()
        {
            var results = _db.LabTestResults
             .Include(r => r.UploadedByLabTechNavigation) // Include the User (Lab Technician) data
             .Select(lr => new
             {
                 lr.ResultId,
                 lr.OrderId,
                 lr.Result,
                 LabTechnicianName = lr.UploadedByLabTechNavigation.FirstName + " " + lr.UploadedByLabTechNavigation.LastName, 
                 lr.UploadDate,
                 lr.CompleteDate,
                 
             })
             .ToList();

            return Ok(results); 
        }


        [HttpGet("GetLabTestResultByOrderId/{orderId}")]
        public IActionResult GetLabTestResultByOrderId(int orderId)
        {
            // Find the lab test result for the given orderId
            var result = _db.LabTestResults
                .Include(r => r.UploadedByLabTechNavigation) // Include the Lab Technician data
                .Where(lr => lr.OrderId == orderId) // Filter by OrderId
                .Select(lr => new
                {
                    lr.ResultId,
                    lr.OrderId,
                    lr.Result,
                    LabTechnicianName = lr.UploadedByLabTechNavigation.FirstName + " " + lr.UploadedByLabTechNavigation.LastName,
                    lr.UploadDate,
                    lr.CompleteDate
                })
                .FirstOrDefault(); // Fetch the first matching result

            // Check if result is found
            if (result == null)
            {
                return NotFound(new { Message = "Lab test result not found for this order." });
            }

            return Ok(result);
        }

    }
}
