using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class bloodDonationController : ControllerBase
    {
        private readonly MyDbContext _db;
        public bloodDonationController( MyDbContext db)
        {
            _db = db;
        }


        [HttpPost("SubmitBloodDonationRequest")]
        public async Task<IActionResult> SubmitBloodDonationRequest([FromForm] BloodDonationRequestDTO requestDto)
        {
            // البحث عن المريض في جدول PatientProfile
            var patientProfile = await _db.PatientProfiles
                .Include(p => p.BloodType)  // تضمين زمرة الدم
                .FirstOrDefaultAsync(p => p.UserId == requestDto.PatientId);

            if (patientProfile == null)
            {
                return NotFound("Patient not found in profile.");
            }

            // استخدام زمرة الدم من الجدول إذا كانت موجودة
            var bloodTypeId = patientProfile.BloodTypeId;

            // في حال لم تكن زمرة الدم معروفة (null) ويجب على المريض إدخالها
            if (bloodTypeId == null && requestDto.BloodTypeId != null)
            {
                // تحديث زمرة الدم في الـ PatientProfile
                patientProfile.BloodTypeId = requestDto.BloodTypeId;
                await _db.SaveChangesAsync();  // حفظ التغييرات
                bloodTypeId = requestDto.BloodTypeId;
            }

            // إنشاء طلب التبرع بالدم
            var bloodDonationRequest = new BloodDonationRequest
            {
                PatientId = requestDto.PatientId,
                BloodTypeId = bloodTypeId,  // استخدام زمرة الدم المأخوذة من الجدول أو الجديدة
                RequestDate = DateTime.Now,
                Status = "Pending",
                Notes = requestDto.Notes
            };

            _db.BloodDonationRequests.Add(bloodDonationRequest);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Blood donation request submitted.", requestId = bloodDonationRequest.RequestId });
        }



        [HttpPut("ProcessBloodDonationRequest/{requestId}")]
        public async Task<IActionResult> ProcessBloodDonationRequest(int requestId, [FromForm] ProcessBloodDonationRequestDTO processDto)
        {
            // Find the donation request
            var request = await _db.BloodDonationRequests.FindAsync(requestId);
            if (request == null)
            {
                return NotFound("Request not found.");
            }

            // Update the request with the lab technician's inputs
            request.BloodTypeId = processDto.BloodTypeId ?? request.BloodTypeId;  // Update blood type if provided
            request.Status = processDto.Status ?? request.Status;  // Update status (Approved, Rejected)
            request.Notes = processDto.Notes ?? request.Notes;  // Add any additional notes
            request.LabTechnicianId = processDto.LabTechnicianId;  // Lab Technician handling the request

            await _db.SaveChangesAsync();

            return Ok(new { message = "Blood donation request processed." });
        }


        [HttpGet("GetPatientBloodDonationRequests/{patientId}")]
        public async Task<IActionResult> GetPatientBloodDonationRequests(int patientId)
        {
            // Check if the patient exists
            var patient = await _db.Users.FindAsync(patientId);
            if (patient == null)
            {
                return NotFound("Patient not found.");
            }

            // Retrieve all blood donation requests for the patient
            var bloodDonationRequests = await _db.BloodDonationRequests
                .Include(r => r.BloodType)         // Load BloodType
                .Include(r => r.LabTechnician)     // Load LabTechnician
                .Where(r => r.PatientId == patientId)
                .Select(r => new
                {
                    r.RequestId,
                    BloodType = r.BloodType != null ? r.BloodType.BloodType1 : "Unknown", // Handle null blood types
                    r.RequestDate,
                    r.Status,
                    r.Notes,
                    LabTechnician = r.LabTechnician != null ? $"{r.LabTechnician.FirstName} {r.LabTechnician.LastName}" : "Not assigned yet"
                })
                .ToListAsync();

            // Check if the patient has any blood donation requests
            if (bloodDonationRequests == null || bloodDonationRequests.Count == 0)
            {
                return NotFound("No blood donation requests found for this patient.");
            }

            return Ok(bloodDonationRequests);
        }








    }
}
