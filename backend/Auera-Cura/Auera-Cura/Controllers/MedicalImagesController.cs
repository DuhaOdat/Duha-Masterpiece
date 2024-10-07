using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalImagesController : ControllerBase
    {
        private readonly MyDbContext _db;

        public MedicalImagesController( MyDbContext db)
        {
            _db = db;
        }

        //for doctor 
        [HttpPost("PlaceImageOrder")]
        public async Task<IActionResult> PlaceImageOrder([FromForm] PlaceImageOrderDTO orderDto)
        {
            var patient = await _db.Users.FindAsync(orderDto.PatientID);
            if (patient == null) return NotFound("Patient not found.");

            var doctor = await _db.Users.FindAsync(orderDto.DoctorID);
            if (doctor == null || doctor.Role != "Doctor") return BadRequest("Invalid Doctor ID.");

            var imageType = await _db.MedicalImageTypes.FindAsync(orderDto.ImageTypeID);
            if (imageType == null) return BadRequest("Invalid Image Type.");

            var order = new MedicalImageOrder
            {
                PatientId = orderDto.PatientID,
                DoctorId = orderDto.DoctorID,
                ImageTypeId = orderDto.ImageTypeID,
                Notes = orderDto.Notes,
                OrderDate = DateTime.Now,
                Status = "Pending"
            };

            _db.MedicalImageOrders.Add(order);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Imaging order placed successfully.", orderId = order.OrderId });
        }


        //Allows lab technicians to upload medical images once they are ready.
        [HttpPost("UploadMedicalImage")]
        public async Task<IActionResult> UploadMedicalImage([FromForm] UploadMedicalImageDTO uploadDto)
        {
            var imageOrder = await _db.MedicalImageOrders.FindAsync(uploadDto.OrderID);
            if (imageOrder == null) return NotFound("Order not found.");

            var labTech = await _db.Users.FindAsync(uploadDto.UploadedByLabTech);
            if (labTech == null || labTech.Role != "Lab Technician") return BadRequest("Invalid Lab Technician ID.");

            var medicalImage = new MedicalImage
            {
                ImageTypeId = imageOrder.ImageTypeId,
                FilePath = uploadDto.FilePath, // Path where the image is stored
                UploadedByLabTech = uploadDto.UploadedByLabTech,
                PatientId = imageOrder.PatientId,
                DoctorId = imageOrder.DoctorId,
                UploadDate = DateTime.Now,
                Status = "Completed"
            };

            // Mark order as completed
            imageOrder.Status = "Completed";

            _db.MedicalImages.Add(medicalImage);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Medical image uploaded successfully." });
        }


        //Allows doctors to submit results or notes based on the medical images uploaded.

        [HttpPost("SubmitMedicalImageResult")]
        public async Task<IActionResult> SubmitMedicalImageResult([FromForm] SubmitImageResultDTO resultDto)
        {
            var image = await _db.MedicalImages.FindAsync(resultDto.ImageID);
            if (image == null) return NotFound("Medical image not found.");

            var doctor = await _db.Users.FindAsync(resultDto.DoctorID);
            if (doctor == null || doctor.Role != "Doctor") return BadRequest("Invalid Doctor ID.");

            image.Result = resultDto.Result;
            image.Status = "Completed";

            await _db.SaveChangesAsync();
            return Ok(new { message = "Image result submitted successfully." });
        }


        //Allows patients and doctors to view completed medical image results.
        [HttpGet("GetMedicalImageResults/{userId}")]
        public async Task<IActionResult> GetMedicalImageResults(int userId)
        {
            var results = await _db.MedicalImages
                .Include(m => m.ImageType) // Ensure that the ImageType is included
                .Where(m => m.PatientId == userId || m.DoctorId == userId) // For either patient or doctor
                .Where(m => m.Status == "Completed")
                .Select(m => new
                {
                    m.ImageId,
                    m.FilePath,
                    m.UploadDate,
                    m.Result,
                    ImageType = m.ImageType.ImageTypeName // Reference the ImageTypeName from ImageType
                })
                .ToListAsync(); // Use ToListAsync for asynchronous execution

            if (results == null || results.Count == 0)
            {
                return NotFound("No completed medical image results found.");
            }

            return Ok(results);
        }

        //Shows any pending image orders for a specific patient or doctor.
        [HttpGet("GetPendingImageOrders/{userId}")]
        public async Task<IActionResult> GetPendingImageOrders(int userId)
        {
            var orders = await _db.MedicalImageOrders
                .Where(o => o.PatientId == userId || o.DoctorId == userId) // Either for doctor or patient
                .Where(o => o.Status == "Pending")
                .Select(o => new
                {
                    o.OrderId,
                    o.OrderDate,
                    ImageType = o.ImageType.ImageTypeName,
                    o.Notes
                }).ToListAsync();

            if (orders == null || orders.Count == 0) return NotFound("No pending image orders found.");

            return Ok(orders);
        }

        //Shows completed medical image results for a specific patient or doctor.
        [HttpGet("GetCompletedImageResults/{userId}")]
        public async Task<IActionResult> GetCompletedImageResults(int userId)
        {
            var completedResults = await _db.MedicalImages
                .Where(m => m.PatientId == userId || m.DoctorId == userId) // For either patient or doctor
                .Where(m => m.Status == "Completed")
                .Select(m => new
                {
                    m.ImageId,
                    m.FilePath,
                    m.Result,
                    m.UploadDate,
                    ImageType = m.ImageType.ImageTypeName
                }).ToListAsync();

            if (completedResults == null || completedResults.Count == 0) return NotFound("No completed image results found.");

            return Ok(completedResults);
        }

        //This API will allow doctors to cancel an imaging order if it has not yet been completed.
        [HttpPost("CancelImageOrder/{orderId}")]
        public async Task<IActionResult> CancelImageOrder(int orderId)
        {
            // Find the image order by ID
            var imageOrder = await _db.MedicalImageOrders.FindAsync(orderId);

            if (imageOrder == null)
            {
                return NotFound("Image order not found.");
            }

            // Check if the order is already completed
            if (imageOrder.Status == "Completed")
            {
                return BadRequest("Order is already completed and cannot be canceled.");
            }

            // Cancel the order
            imageOrder.Status = "Canceled";

            // Save changes to the database
            _db.MedicalImageOrders.Update(imageOrder);
            await _db.SaveChangesAsync();

            // Notify the patient that the order has been canceled
            if (imageOrder.PatientId.HasValue)
            {
                await NotifyUser(imageOrder.PatientId.Value, "Your medical image order has been canceled.");
            }
            else
            {
                return BadRequest("Patient ID is not assigned to this order.");
            }

            return Ok(new { message = "Medical image order has been canceled.", orderId = imageOrder.OrderId });
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
                CreatedDate = DateTime.Now,
                IsRead = false
            };

            // Add the notification to the database
            _db.Notifications.Add(notification);
            await _db.SaveChangesAsync();
        }

        [HttpPost("NotifyForImageUpload/{orderId}")]
        public async Task<IActionResult> NotifyForImageUpload(int orderId)
        {
            // Fetch the order details
            var imageOrder = await _db.MedicalImageOrders
                .Include(o => o.Patient)
                .Include(o => o.Doctor)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (imageOrder == null)
            {
                return NotFound("Image order not found.");
            }

            // Notify the patient that their image has been uploaded
            if (imageOrder.PatientId.HasValue)
            {
                await NotifyUser(imageOrder.PatientId.Value, "Your medical image has been uploaded and is available for review.");
            }

            // Notify the doctor that the patient's image is ready for review
            if (imageOrder.DoctorId.HasValue)
            {
                await NotifyUser(imageOrder.DoctorId.Value, $"A medical image for your patient (ID: {imageOrder.PatientId}) has been uploaded and is ready for review.");
            }

            return Ok(new { message = "Notifications sent to patient and doctor." });
        }
        //Both doctors and patients should be able to view their notifications. Here's an API that fetches all notifications for a user.
        [HttpGet("GetNotifications/{userId}")]
        public async Task<IActionResult> GetNotifications(int userId)
        {
            var notifications = await _db.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedDate)
                .Select(n => new
                {
                    n.NotificationId,
                    n.Message,
                    n.IsRead,
                    n.CreatedDate
                })
                .ToListAsync();

            if (notifications == null || notifications.Count == 0)
            {
                return NotFound("No notifications found for this user.");
            }

            return Ok(notifications);
        }



    }
}
