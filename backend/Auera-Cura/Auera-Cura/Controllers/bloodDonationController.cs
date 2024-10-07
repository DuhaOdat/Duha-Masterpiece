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

        [HttpGet("GetUserProfile/{userId}")]
        public async Task<IActionResult> GetUserProfile(int userId)
        {
            // Fetch user information from Users table
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Fetch blood type from PatientProfile table
            var patientProfile = await _db.PatientProfiles
                .Include(p => p.BloodType)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            var bloodType = patientProfile?.BloodType?.BloodType1 ?? "N/A"; // Check if blood type is available

            // Combine the data into one response
            var userProfile = new
            {
                FullName = $"{user.FirstName} {user.LastName}",
                BloodType = bloodType,
                Email = user.Email,
              
            };

            return Ok(userProfile);
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
                PreferredDonationDate = requestDto.PreferredDonationDate, // استخدام التاريخ المحدد من المستخدم
                Status = "Pending",
               
            };

            _db.BloodDonationRequests.Add(bloodDonationRequest);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Blood donation request submitted.", requestId = bloodDonationRequest.RequestId });
        }





        [HttpPost("ConfirmBloodDonation")]
        public async Task<IActionResult> ConfirmBloodDonation(int requestId)
        {
            // Fetch the blood donation request
            var donationRequest = await _db.BloodDonationRequests
                .Include(r => r.Patient)
                .ThenInclude(p => p.PatientProfile)
                .ThenInclude(pp => pp.BloodType)
                .FirstOrDefaultAsync(r => r.RequestId == requestId);

            if (donationRequest == null)
            {
                return NotFound("Blood donation request not found.");
            }

            if (donationRequest.DonationConfirmed == true)
            {
                return BadRequest("Donation has already been confirmed.");
            }


            // Confirm the donation
            donationRequest.DonationConfirmed = true;
            donationRequest.Status = "Approved";  // Update the status to 'Approved'
            donationRequest.DonationDate = DateTime.Now;  // Set the actual donation date
            _db.BloodDonationRequests.Update(donationRequest);

            // Calculate points based on the patient's blood type
            var bloodType = donationRequest.Patient.PatientProfile.BloodType;
            var rewardPoints = bloodType?.RewardPoints ?? 0;

            // Update patient's points
            var patientPoints = await _db.PatientPoints.FirstOrDefaultAsync(p => p.PatientId == donationRequest.PatientId);
            if (patientPoints == null)
            {
                patientPoints = new PatientPoint
                {
                    PatientId = donationRequest.PatientId,
                    CurrentPoints = rewardPoints,
                    TotalPoints = 600,
                    LastUpdated = DateTime.Now
                };
                _db.PatientPoints.Add(patientPoints);
            }
            else
            {
                patientPoints.CurrentPoints += rewardPoints;
                patientPoints.LastUpdated = DateTime.Now;
            }

            // Update points in PatientProfile as well
            var patientProfile = await _db.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == donationRequest.PatientId);
            if (patientProfile != null)
            {
                patientProfile.RewardPoints = patientPoints.CurrentPoints;
            }

            await _db.SaveChangesAsync();

            return Ok(new { message = "Blood donation confirmed and points added.", rewardPoints });
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

       
        [HttpGet("GetPatientPointByUserId/{userId}")]
        public async Task<IActionResult> GetPatientPointByUserId(int userId)
        {
            // البحث عن السجل في جدول PatientProfile بناءً على UserId
            var patientProfile = await _db.PatientProfiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patientProfile == null)
            {
                return NotFound(new { message = "Patient profile not found" });
            }

            // إرجاع النقاط الحالية من جدول PatientProfile
            var result = new
            {
                CurrentPoints = patientProfile.RewardPoints,  // جلب النقاط من RewardPoints
                TotalPoints = 600 // هنا يمكنك تحديد مجموع النقاط كما تريد
            };

            return Ok(result);
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


        [HttpGet("GetPendingBloodDonationRequests/{patientId}")]
        public async Task<IActionResult> GetPendingBloodDonationRequests(int patientId)
        {
            // Check if the patient exists
            var patient = await _db.Users.FindAsync(patientId);
            if (patient == null)
            {
                return NotFound("Patient not found.");
            }

            // Retrieve all pending blood donation requests for the patient
            var pendingRequests = await _db.BloodDonationRequests
                .Include(r => r.BloodType)
                .Include(r => r.LabTechnician)
                .Where(r => r.PatientId == patientId && r.Status == "Pending")
                .Select(r => new
                {
                    r.RequestId,
                    BloodType = r.BloodType != null ? r.BloodType.BloodType1 : "Unknown",
                    r.RequestDate,
                    r.PreferredDonationDate, // إضافة التاريخ المفضل للتبرع
                    r.Status,
                    r.Notes,
                    LabTechnician = r.LabTechnician != null ? $"{r.LabTechnician.FirstName} {r.LabTechnician.LastName}" : "Not assigned yet"
                })
                .ToListAsync();

            if (!pendingRequests.Any())
            {
                return NotFound("No pending blood donation requests found for this patient.");
            }

            return Ok(pendingRequests);
        }




        //[HttpGet("GetApprovedBloodDonationRequests/{patientId}")]
        //public async Task<IActionResult> GetApprovedBloodDonationRequests(int patientId)
        //{
        //    // Check if the patient exists
        //    var patient = await _db.Users.FindAsync(patientId);
        //    if (patient == null)
        //    {
        //        return NotFound("Patient not found.");
        //    }

        //    // Retrieve all approved and confirmed blood donation requests for the patient
        //    var approvedRequests = await _db.BloodDonationRequests
        //        .Include(r => r.BloodType)         // Load BloodType
        //        .Include(r => r.LabTechnician)     // Load LabTechnician
        //        .Where(r => r.PatientId == patientId && r.Status == "Approved" && r.DonationConfirmed == true) // Check for confirmed donations
        //        .Select(r => new
        //        {
        //            r.RequestId,
        //            BloodType = r.BloodType != null ? r.BloodType.BloodType1 : "Unknown",
        //            r.RequestDate,
        //            r.PreferredDonationDate,
        //            r.DonationDate, // The actual donation date
        //            r.Status,
        //            r.Notes,
        //            RewardPoints = r.BloodType != null ? r.BloodType.RewardPoints : 0 // Retrieve the correct points based on blood type
        //        })
        //        .ToListAsync();

        //    if (!approvedRequests.Any())
        //    {
        //        return NotFound("No approved blood donation requests found for this patient.");
        //    }

        //    return Ok(approvedRequests);
        //}

        [HttpGet("GetApprovedBloodDonationRequests/{patientId}")]
        public async Task<IActionResult> GetApprovedBloodDonationRequests(int patientId)
        {
            // Check if the patient exists
            var patient = await _db.Users.FindAsync(patientId);
            if (patient == null)
            {
                return NotFound("Patient not found.");
            }

            // Retrieve all approved and confirmed blood donation requests for the patient
            var approvedRequests = await _db.BloodDonationRequests
                .Include(r => r.BloodType)         // Load BloodType
                .Include(r => r.LabTechnician)     // Load LabTechnician
                .Where(r => r.PatientId == patientId && r.Status == "Approved" && r.DonationConfirmed == true) // Only confirmed donations
                .Select(r => new
                {
                    r.RequestId,
                    BloodType = r.BloodType != null ? r.BloodType.BloodType1 : "Unknown",
                    r.RequestDate,
                    r.PreferredDonationDate,
                    r.DonationDate, // The actual donation date
                    r.Status,
                    r.Notes,
                    RewardPoints = r.BloodType != null ? r.BloodType.RewardPoints : 0 // Retrieve the correct points based on blood type
                })
                .ToListAsync();

            if (!approvedRequests.Any())
            {
                return NotFound("No approved blood donation requests found for this patient.");
            }

            return Ok(approvedRequests);
        }




        [HttpGet("GetRejectedBloodDonationRequests/{patientId}")]
        public async Task<IActionResult> GetRejectedBloodDonationRequests(int patientId)
        {
            // Check if the patient exists
            var patient = await _db.Users.FindAsync(patientId);
            if (patient == null)
            {
                return NotFound("Patient not found.");
            }

            // Retrieve all rejected blood donation requests for the patient
            var rejectedRequests = await _db.BloodDonationRequests
                .Include(r => r.BloodType)
                .Include(r => r.LabTechnician)
                .Where(r => r.PatientId == patientId && r.Status == "Rejected")
                .Select(r => new
                {
                    r.RequestId,
                    BloodType = r.BloodType != null ? r.BloodType.BloodType1 : "Unknown",
                    r.RequestDate,
                    r.Status,
                    r.Notes,
                    LabTechnician = r.LabTechnician != null ? $"{r.LabTechnician.FirstName} {r.LabTechnician.LastName}" : "Not assigned yet"
                })
                .ToListAsync();

            if (!rejectedRequests.Any())
            {
                return NotFound("No rejected blood donation requests found for this patient.");
            }

            return Ok(rejectedRequests);
        }


        [HttpGet("GetAvailableRewards/{patientId}")]
        public async Task<IActionResult> GetAvailableRewards(int patientId)
        {
            // العثور على الملف الشخصي للمريض
            var patientProfile = await _db.PatientProfiles
                                          .Include(p => p.BloodType)
                                          .FirstOrDefaultAsync(p => p.UserId == patientId);

            if (patientProfile == null)
            {
                return NotFound("Patient profile not found.");
            }

            // التحقق من نقاط المريض
            var patientPoints = patientProfile.RewardPoints ?? 0;

            // استرجاع جميع الجوائز التي تتوافق مع نقاط المريض
            var availableRewards = await _db.Rewards
                                            .Where(r => r.PointsRequired <= patientPoints)
                                            .Select(r => new
                                            {
                                                r.RewardName,
                                                r.Description,
                                                r.PointsRequired
                                            })
                                            .ToListAsync();

            if (!availableRewards.Any())
            {
                return Ok("No rewards available based on your current points.");
            }

            return Ok(availableRewards);
        }






    }
}
