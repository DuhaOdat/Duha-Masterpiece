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







    }
}
