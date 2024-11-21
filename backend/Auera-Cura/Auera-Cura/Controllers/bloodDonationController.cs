using Auera_Cura.DTO;
using Auera_Cura.Models;
using Auera_Cura.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using System.Net;
using Microsoft.AspNetCore.Authorization;

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




        //[HttpPost("SubmitBloodDonationRequest")]
        //public async Task<IActionResult> SubmitBloodDonationRequest([FromForm] BloodDonationRequestDTO requestDto)
        //{
        //    // البحث عن المريض في جدول PatientProfile
        //    var patientProfile = await _db.PatientProfiles
        //        .Include(p => p.BloodType)  // تضمين زمرة الدم
        //        .FirstOrDefaultAsync(p => p.UserId == requestDto.PatientId);

        //    if (patientProfile == null)
        //    {
        //        return NotFound("Patient not found in profile.");
        //    }

        //    // استخدام زمرة الدم من الجدول إذا كانت موجودة
        //    var bloodTypeId = patientProfile.BloodTypeId;

        //    // في حال لم تكن زمرة الدم معروفة (null) ويجب على المريض إدخالها
        //    if (bloodTypeId == null && requestDto.BloodTypeId != null)
        //    {
        //        // تحديث زمرة الدم في الـ PatientProfile
        //        patientProfile.BloodTypeId = requestDto.BloodTypeId;
        //        await _db.SaveChangesAsync();  // حفظ التغييرات
        //        bloodTypeId = requestDto.BloodTypeId;
        //    }

        //    // إنشاء طلب التبرع بالدم
        //    var bloodDonationRequest = new BloodDonationRequest
        //    {
        //        PatientId = requestDto.PatientId,
        //        BloodTypeId = bloodTypeId,  // استخدام زمرة الدم المأخوذة من الجدول أو الجديدة
        //        RequestDate = DateTime.Now,
        //        PreferredDonationDate = requestDto.PreferredDonationDate, // استخدام التاريخ المحدد من المستخدم
        //        Status = "Pending",

        //    };

        //    _db.BloodDonationRequests.Add(bloodDonationRequest);
        //    await _db.SaveChangesAsync();

        //    return Ok(new { message = "Blood donation request submitted.", requestId = bloodDonationRequest.RequestId });
        //}




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

            // تعيين تاريخ التبرع المفضل إلى أسبوع من تاريخ الطلب
            var preferredDonationDate = DateTime.Now.AddDays(7);

            // إنشاء طلب التبرع بالدم
            var bloodDonationRequest = new BloodDonationRequest
            {
                PatientId = requestDto.PatientId,
                BloodTypeId = bloodTypeId,  // استخدام زمرة الدم المأخوذة من الجدول أو الجديدة
                RequestDate = DateTime.Now,
                PreferredDonationDate = preferredDonationDate, // تعيين التاريخ تلقائياً لأسبوع من الآن
                Status = "Pending",
            };

            _db.BloodDonationRequests.Add(bloodDonationRequest);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Blood donation request submitted.",
                requestId = bloodDonationRequest.RequestId,
                preferredDonationDate = preferredDonationDate.ToString("yyyy-MM-dd")
            });
        }


        [HttpDelete("DeleteBloodDonationRequest/{requestId}")]
        public async Task<IActionResult> DeleteBloodDonationRequest(int requestId)
        {
            // Find the request in the database
            var request = await _db.BloodDonationRequests.FirstOrDefaultAsync(r => r.RequestId == requestId);

            // Check if the request exists
            if (request == null)
            {
                return NotFound(new { message = "Request not found." });
            }

            // Check if the request status is "Pending"
            if (request.Status != "Pending")
            {
                return BadRequest(new { message = "Only pending requests can be deleted." });
            }

            // Remove the request from the database
            _db.BloodDonationRequests.Remove(request);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Blood donation request deleted successfully." });
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
          
            var patientProfile = await _db.PatientProfiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patientProfile == null)
            {
                return NotFound(new { message = "Patient profile not found" });
            }

           
            var result = new
            {
                CurrentPoints = patientProfile.RewardPoints,  
                TotalPoints = 600  
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
                .Include(r => r.BloodType)         
                .Include(r => r.LabTechnician)    
                .Where(r => r.PatientId == patientId)
                .Select(r => new
                {
                    r.RequestId,
                    BloodType = r.BloodType != null ? r.BloodType.BloodType1 : "Unknown", // Handle null blood types
                    r.RequestDate,
                    r.Status,
                    r.PreferredDonationDate,
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
                    r.PreferredDonationDate, 
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
                .Include(r => r.BloodType)       
                .Include(r => r.LabTechnician)    
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



        [HttpGet("GetApprovedBloodDonationRequestswithoutConfirm/{patientId}")]
        public async Task<IActionResult> GetApprovedBloodDonationRequestswithoutConfirm(int patientId)
        {
            // Check if the patient exists
            var patient = await _db.Users.FindAsync(patientId);
            if (patient == null)
            {
                return NotFound("Patient not found.");
            }

            // Retrieve all approved and confirmed blood donation requests for the patient
            var approvedRequests = await _db.BloodDonationRequests
                .Include(r => r.BloodType)
                .Include(r => r.LabTechnician)
                .Where(r => r.PatientId == patientId && r.Status == "Approved") 
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
       
            var patientProfile = await _db.PatientProfiles
                                          .Include(p => p.BloodType)
                                          .FirstOrDefaultAsync(p => p.UserId == patientId);

            if (patientProfile == null)
            {
                return NotFound("Patient profile not found.");
            }

        
            var patientPoints = patientProfile.RewardPoints ?? 0;

           
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



        [HttpGet("getAllBloodTypes")]
        public async Task<IActionResult> GetAllBloodTypes()
        {
            try
            {
                // Fetch all blood types with their reward points
                var bloodTypes = await _db.BloodTypes
                    .Select(bt => new
                    {
                        bt.BloodTypeId,
                        BloodType = bt.BloodType1, // Assuming BloodType1 is the name of the blood type
                        PointsPerDonation = bt.RewardPoints // Reward points for the donation
                    })
                    .ToListAsync();

                // Return the list of blood types with status code 200 (OK)
                return Ok(bloodTypes);
            }
            catch (Exception ex)
            {
                // Log the exception and return a 500 (Internal Server Error) with a message
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "An error occurred while retrieving blood types." });
            }
        }

        [HttpPut("updatePointsPerDonation/{id}")]
        public async Task<IActionResult> UpdatePointsPerDonation(int id, [FromForm] UpdatePointsPerDonationDto dto)
        {
            try
            {
                // Find the blood type by ID
                var bloodType = await _db.BloodTypes.FindAsync(id);
                if (bloodType == null)
                {
                    return NotFound(new { message = "Blood type not found." });
                }

                // Update the points per donation
                bloodType.RewardPoints = dto.PointsPerDonation;

                // Save changes to the database
                await _db.SaveChangesAsync();

                return Ok(new { message = "Points per donation updated successfully." });
            }
            catch (Exception ex)
            {
                // Log the error and return a 500 Internal Server Error response
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "An error occurred while updating points per donation." });
            }
        }

        [HttpGet("getAllRewards")]
        public async Task<IActionResult> GetAllRewards()
        {
            try
            {
                // Retrieve all rewards from the database
                var rewards = await _db.Rewards.ToListAsync();

                // Return the list of rewards
                return Ok(rewards);
            }
            catch (Exception ex)
            {
                // Log the error and return a 500 Internal Server Error response
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "An error occurred while retrieving rewards." });
            }
        }


        [HttpPut("updateReward/{id}")]
        public async Task<IActionResult> UpdateReward(int id, [FromForm] UpdateRewardDto dto)
        {
            try
            {
                // Find the reward by its ID
                var reward = await _db.Rewards.FindAsync(id);
                if (reward == null)
                {
                    return NotFound(new { message = "Reward not found." });
                }

                // Update reward fields
                reward.RewardName = dto.RewardName;
                reward.Description = dto.Description;
                reward.PointsRequired = dto.PointsRequired;

                // Save changes to the database
                await _db.SaveChangesAsync();

                return Ok(new { message = "Reward updated successfully." });
            }
            catch (Exception ex)
            {
                // Log the error and return a 500 Internal Server Error response
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "An error occurred while updating the reward." });
            }
        }

        [HttpDelete("deleteReward/{id}")]
        public async Task<IActionResult> DeleteReward(int id)
        {
            try
            {
                // Find the reward by its ID
                var reward = await _db.Rewards.FindAsync(id);
                if (reward == null)
                {
                    return NotFound(new { message = "Reward not found." });
                }

                // Remove the reward from the database
                _db.Rewards.Remove(reward);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Reward deleted successfully." });
            }
            catch (Exception ex)
            {
                // Log the error and return a 500 Internal Server Error response
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "An error occurred while deleting the reward." });
            }
        }


        // API Controller for adding a new reward
        [HttpPost("addReward")]
        public async Task<IActionResult> AddReward([FromForm] AddRewardDto dto)
        {
            try
            {
                // Create a new reward instance
                var reward = new Reward
                {
                    RewardName = dto.RewardName,
                    Description = dto.Description,
                    PointsRequired = dto.PointsRequired
                };

                // Add the reward to the database
                _db.Rewards.Add(reward);
                await _db.SaveChangesAsync();

                // Return a success message
                return Ok(new { message = "Reward added successfully!" });
            }
            catch (Exception ex)
            {
                // Log the error and return a 500 Internal Server Error
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "An error occurred while adding the reward." });
            }
        }



        [HttpGet("GetAllBloodDonationRequests")]
        public async Task<IActionResult> GetAllBloodDonationRequests()
        {
            // Retrieve all blood donation requests from the database
            var bloodDonationRequests = await _db.BloodDonationRequests
                .Include(r => r.BloodType)                 // Load BloodType
                .Include(r => r.Patient)                   // Include Patient from User table
                .Include(r => r.LabTechnician)             // Include Lab Technician from User table
                .Select(r => new
                {
                    r.RequestId,
                    PatientName = r.Patient != null
                        ? $"{r.Patient.FirstName} {r.Patient.LastName}"
                        : "Unknown",                       // Get patient's full name from User table or "Unknown"
                    BloodType = r.BloodType != null
                        ? r.BloodType.BloodType1
                        : "Unknown",                       // Get BloodType or "Unknown" if null
                    r.RequestDate,
                    r.PreferredDonationDate,               // Get preferred donation date
                    r.Status,
                    r.Notes,
                    LabTechnician = r.LabTechnician != null
                        ? $"{r.LabTechnician.FirstName} {r.LabTechnician.LastName}"
                        : "Not assigned yet",              // Get Lab Technician's full name from User table
                    r.DonationConfirmed,                   // Check if the donation was confirmed
                    r.DonationDate                        // Actual donation date if confirmed
                })
                .ToListAsync();

            // If there are no requests found
            if (!bloodDonationRequests.Any())
            {
                return NotFound("No blood donation requests found.");
            }

            return Ok(bloodDonationRequests);
        }


        [HttpPost("claimReward")]
        public async Task<IActionResult> ClaimReward([FromBody] RewardClaimRequest request)
        {
            // Fetch the user and their current points
            var user = await _db.Users.Include(u => u.PatientPoints).FirstOrDefaultAsync(u => u.Id == request.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Assuming PatientPoints is a collection and you want the latest/current points
            var patientPoints = user.PatientPoints?.FirstOrDefault();
            if (patientPoints == null)
            {
                return NotFound("Patient points record not found.");
            }

            int currentPoints = patientPoints.CurrentPoints;

            var reward = await _db.Rewards.FindAsync(request.RewardId);
            if (reward == null)
            {
                return NotFound("Reward not found.");
            }

            // Check if the user has enough points to claim this reward
            if (currentPoints < (reward.PointsRequired ?? 0))
            {
                return BadRequest("Not enough points to claim this reward.");
            }

            // Check if the user has already claimed this reward
            var existingClaim = await _db.RewardClaims
                .FirstOrDefaultAsync(rc => rc.UserId == request.UserId && rc.RewardId == request.RewardId && rc.IsClaimed);
            if (existingClaim != null)
            {
                return BadRequest("You have already claimed this reward.");
            }

            // Deduct points from the PatientPoints object and update it
            patientPoints.CurrentPoints -= reward.PointsRequired ?? 0;
            patientPoints.LastUpdated = DateTime.UtcNow;

            // Create and save a new RewardClaim entry
            var rewardClaim = new RewardClaim
            {
                UserId = request.UserId,
                RewardId = request.RewardId,
                ClaimedDate = DateTime.UtcNow,
                IsClaimed = true
            };

            _db.RewardClaims.Add(rewardClaim);

            // Mark the PatientPoints entity as modified to ensure it gets updated in the database
            _db.Entry(patientPoints).State = EntityState.Modified;

            // Save changes to both RewardClaim and PatientPoints
            await _db.SaveChangesAsync();

            return Ok("Reward claimed successfully!");
        }


        [HttpGet("getAllRewardClaims")]
        public async Task<IActionResult> GetAllRewardClaims()
        {
            // Fetch all reward claims including user and reward details if needed
            var rewardClaims = await _db.RewardClaims
                .Include(rc => rc.User)       // لجلب بيانات المستخدم المتعلقة بالمطالبة
                .Include(rc => rc.Reward)     // لجلب بيانات الجائزة المتعلقة بالمطالبة
                .Select(rc => new
                {
                    rc.Id,
                    rc.UserId,
                    UserFullName = rc.User.FirstName + " " + rc.User.LastName, // جمع الاسم الأول واسم العائلة  // assuming there's a 'Name' property in User entity
                    rc.RewardId,
                    RewardName = rc.Reward.RewardName,  // assuming there's a 'RewardName' property in Reward entity
                    rc.ClaimedDate,
                    rc.IsClaimed,
                    rc.EmailSentDate,
                    rc.IsCollected,
                    rc.CollectedDate
                })
                .ToListAsync();

            return Ok(rewardClaims);
        }


        [HttpPost("sendCongratulatoryEmail")]
        public async Task<IActionResult> SendCongratulatoryEmail([FromBody] SendEmailRequest request)
        {
            // Fetch the reward claim and user details
            var rewardClaim = await _db.RewardClaims
                .Include(rc => rc.User)
                .Include(rc => rc.Reward)
                .FirstOrDefaultAsync(rc => rc.Id == request.RewardClaimId);

            if (rewardClaim == null)
            {
                return NotFound("Reward claim not found.");
            }

            var user = rewardClaim.User;
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Compose the email content
            string subject = "Congratulations on Claiming Your Reward!";
            string message = $@"
                Dear {user.FirstName} {user.LastName},
                
                Congratulations! You have successfully claimed the reward: {rewardClaim.Reward.RewardName}.
                
                Please visit our facility on {request.ProcessingDate:yyyy-MM-dd} to collect your reward.

                Best regards,
                Your Hospital Team
            ";

            // Send the email directly in the controller
            try
            {
                using (var smtpClient = new SmtpClient("smtp.gmail.com"))
                {
                    smtpClient.Port = 587;
                    smtpClient.Credentials = new NetworkCredential("odatduha@gmail.com", "ijmt lrkb drnt vcao");
                    smtpClient.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("odatduha@gmail.com", "Auera Cura"),
                        Subject = subject,
                        Body = message,
                        IsBodyHtml = true,
                    };
                    mailMessage.To.Add(user.Email);

                    await smtpClient.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Failed to send email: " + ex.Message);
            }

            // Update the reward claim to indicate that an email has been sent
            rewardClaim.EmailSentDate = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok("Email sent successfully!");
        }


        [HttpPost("markAsCollected/{rewardClaimId}")]
        public async Task<IActionResult> MarkAsCollected(int rewardClaimId)
        {
            // Fetch the reward claim record based on the ID
            var rewardClaim = await _db.RewardClaims.FindAsync(rewardClaimId);

            if (rewardClaim == null)
            {
                return NotFound("Reward claim not found.");
            }

            // Update the collected status and set the collected date
            rewardClaim.IsCollected = true;
            rewardClaim.CollectedDate = DateTime.UtcNow;

            // Save the changes to the database
            await _db.SaveChangesAsync();

            return Ok("Reward claim marked as collected.");
        }


        [HttpGet("getClaimedRewards/{userId}")]
       
        public async Task<IActionResult> GetClaimedRewards(int userId)
        {
            // Fetch claimed rewards for the specified user
            var claimedRewards = await _db.RewardClaims
                .Include(rc => rc.Reward) // Includes reward details in the result
                .Where(rc => rc.UserId == userId)
                .Select(rc => new
                {
                    RewardClaimId = rc.Id,
                    RewardName = rc.Reward.RewardName,
                    Description = rc.Reward.Description,
                    PointsRequired = rc.Reward.PointsRequired,
                    ClaimedDate = rc.ClaimedDate,
                    IsCollected = rc.IsCollected,
                    CollectedDate = rc.CollectedDate
                })
                .ToListAsync();

            return Ok(claimedRewards);
        }

       

    }


}
