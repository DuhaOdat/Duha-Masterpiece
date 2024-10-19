using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientProfileController : ControllerBase
    {
        private readonly MyDbContext _db;
        public PatientProfileController( MyDbContext db)
        {
            _db= db;
        }


        [HttpGet("{id}")]
        public IActionResult GetPatientProfile(int id)
        {
            // نتحقق أولاً من أن المستخدم موجود وله دور "Patient"
            var user = _db.Users
                          .Where(u => u.Id == id && u.Role == "Patient")
                          .Select(u => new
                          {
                              u.FirstName,
                              u.LastName,
                              u.Email,

                              Profile = u.PatientProfile != null ? new
                              {
                                  u.PatientProfile.Gender,
                                  u.PatientProfile.DateOfBirth,
                                  u.PatientProfile.Address,
                                  u.PatientProfile.Phone,
                                  u.PatientProfile.Weight,
                                  u.PatientProfile.Status,
                                  BloodType = u.PatientProfile.BloodType != null ? u.PatientProfile.BloodType.BloodType1 : "Unknown",  // إرجاع اسم فصيلة الدم
                                  u.PatientProfile.RewardPoints
                              } : null
                          }).FirstOrDefault();

            if (user == null)
            {
                return NotFound(new { message = "Patient not found" });
            }

            return Ok(user);
        }

        [HttpPost("UpdatePatientProfile/{id}")]
        public IActionResult UpdatePatientProfile(int id, [FromForm] UpdatePatientProfileDTO updatedProfile)
        {
            // ابحث عن الملف الشخصي للمريض باستخدام المعرف "id"
            var patientProfile = _db.PatientProfiles
                                    .Include(p => p.BloodType) // إضافة العلاقة لجلب اسم فصيلة الدم
                                    .FirstOrDefault(p => p.UserId == id);

            // إذا لم يكن هناك سجل في "PatientProfile"، قم بإنشاء سجل جديد
            if (patientProfile == null)
            {
                // إنشاء سجل جديد في "PatientProfile" وربطه بالمستخدم
                patientProfile = new PatientProfile
                {
                    UserId = id,  // تأكد من أن "UserId" يشير إلى المستخدم في جدول "Users"
                    Address = updatedProfile.Address,
                    Phone = updatedProfile.Phone,
                    Weight = updatedProfile.Weight,
                    Status = updatedProfile.Status,
                    BloodTypeId = updatedProfile.BloodTypeId,
                    Gender = updatedProfile.Gender,
                    DateOfBirth = updatedProfile.DateOfBirth
                };

                // إضافة السجل الجديد إلى قاعدة البيانات
                _db.PatientProfiles.Add(patientProfile);
            }
            else
            {
                // تحديث السجل الحالي إذا كان موجودًا
                patientProfile.Address = updatedProfile.Address ?? patientProfile.Address;
                patientProfile.Phone = updatedProfile.Phone ?? patientProfile.Phone;
                patientProfile.Weight = updatedProfile.Weight ?? patientProfile.Weight;
                patientProfile.Status = updatedProfile.Status ?? patientProfile.Status;
                patientProfile.BloodTypeId = updatedProfile.BloodTypeId ?? patientProfile.BloodTypeId;
                patientProfile.Gender = updatedProfile.Gender ?? patientProfile.Gender;
                patientProfile.DateOfBirth = updatedProfile.DateOfBirth ?? patientProfile.DateOfBirth;
            }

            // حفظ التغييرات في قاعدة البيانات
            _db.SaveChanges();

            // إرجاع الملف الشخصي المحدث مع اسم فصيلة الدم
            var updatedProfileResult = new
            {
                patientProfile.UserId,
                patientProfile.Address,
                patientProfile.Phone,
                patientProfile.Weight,
                patientProfile.Status,
                BloodType = patientProfile.BloodType != null ? patientProfile.BloodType.BloodType1 : "Unknown", // إرجاع اسم فصيلة الدم
                patientProfile.Gender,
                patientProfile.DateOfBirth
            };

            return Ok(new { message = "Profile updated successfully", profile = updatedProfileResult });
        }

        [HttpGet("GetAllPatients")]
        public async Task<ActionResult> GetAllPatients()
        {
            // Retrieve users who are patients, whether or not they have a patient profile
            var patients = await _db.Users
                .Where(u => u.Role == "Patient") // Only get users with the Patient role
                .GroupJoin(
                    _db.PatientProfiles, // Join with the PatientProfiles table
                    user => user.Id,     // Match by user ID
                    profile => profile.UserId,
                    (user, profiles) => new { User = user, Profile = profiles.FirstOrDefault() } // Select the user and their profile if it exists
                )
                .Select(up => new
                {
                    PatientId = up.Profile != null ? up.Profile.PatientId : 0, // Use the profile's PatientId if available
                    FullName = up.User.FirstName + " " + up.User.LastName,
                    Email = up.User.Email,
                    Gender = up.Profile != null ? up.Profile.Gender : "N/A", // Use profile's gender if available
                    DateOfBirth = up.Profile != null ? up.Profile.DateOfBirth : null, // Use profile's DOB if available
                    Phone = up.Profile != null ? up.Profile.Phone : "N/A",
                    Address = up.Profile != null ? up.Profile.Address : "N/A",
                    BloodType = up.Profile != null && up.Profile.BloodType != null ? up.Profile.BloodType.BloodType1 : "N/A",
                    RewardPoints = up.Profile != null ? up.Profile.RewardPoints ?? 0 : 0 // Default to 0 if RewardPoints is null
                })
                .ToListAsync();

            // Check if no patients were found
            if (patients == null || !patients.Any())
            {
                return NotFound(new { message = "No patients found." });
            }

            // Return the list of patients
            return Ok(patients);
        }



        [HttpDelete("DeletePatient/{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            // البحث عن المريض
            var patient = await _db.PatientProfiles.Include(p => p.User).FirstOrDefaultAsync(p => p.PatientId == id);

            if (patient == null)
            {
                return NotFound(new { message = "Patient not found" });
            }

            // التحقق إذا كان لدى المريض طلبات فحص مختبر أو صور طبية أو مواعيد
            var hasLabTestOrders = await _db.LabTestOrders.AnyAsync(l => l.PatientUserId == patient.UserId);
            var hasMedicalImageOrders = await _db.MedicalImageOrders.AnyAsync(m => m.PatientId == patient.UserId);
            var hasAppointments = await _db.Appointments.AnyAsync(a => a.PatientId == patient.PatientId);

            if (hasLabTestOrders || hasMedicalImageOrders || hasAppointments)
            {
                return BadRequest(new { message = "Cannot delete patient. Patient has related lab tests, medical images, or appointments." });
            }

            // إذا لم يكن لديه طلبات، احذف المريض
            _db.PatientProfiles.Remove(patient);
            if (patient.User != null)
            {
                _db.Users.Remove(patient.User); // حذف المستخدم المرتبط أيضًا
            }

            await _db.SaveChangesAsync();

            return Ok(new { message = "Patient deleted successfully" });
        }



    }
}
