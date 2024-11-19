using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorschedulesController : ControllerBase
    {
        private readonly MyDbContext _db;
        public DoctorschedulesController(MyDbContext db)
        {
            _db = db;
        }

        //[HttpPost("AddDoctorSchedule")]
        //public async Task<IActionResult> AddDoctorSchedule([FromForm] DoctorScheduleDTO scheduleDTO)
        //{
        //    // Fetch existing schedules for the doctor on the same day
        //    var existingSchedules = await _db.DoctorSchedules
        //        .Where(s => s.DoctorId == scheduleDTO.DoctorId && s.DayOfWeek == scheduleDTO.DayOfWeek)
        //        .ToListAsync();

        //    // Check for overlapping schedules
        //    foreach (var existingSchedule in existingSchedules)
        //    {
        //        if ((scheduleDTO.StartTime < existingSchedule.EndTime && scheduleDTO.StartTime >= existingSchedule.StartTime) ||
        //            (scheduleDTO.EndTime > existingSchedule.StartTime && scheduleDTO.EndTime <= existingSchedule.EndTime))
        //        {
        //            return BadRequest(new { message = "Schedule Conflict. The doctor already has a schedule on this day with overlapping time." });
        //        }
        //    }

        //    // Add the new schedule if no conflicts
        //    var doctorSchedule = new DoctorSchedule
        //    {
        //        DayOfWeek = scheduleDTO.DayOfWeek,
        //        StartTime = scheduleDTO.StartTime,
        //        EndTime = scheduleDTO.EndTime,
        //        DoctorId = scheduleDTO.DoctorId
        //    };

        //    _db.DoctorSchedules.Add(doctorSchedule);
        //    await _db.SaveChangesAsync();

        //    return Ok(new { message = "Doctor schedule added successfully" });
        //}


        [HttpPost("AddDoctorSchedules")]
        public async Task<IActionResult> AddDoctorSchedules([FromForm] DoctorScheduleDTO scheduleDTO)
        {
            var conflictingDays = new List<string>(); // قائمة الأيام التي تحتوي على تعارض
            var addedDays = new List<string>();      // قائمة الأيام التي تم إضافتها بنجاح

            foreach (var dayOfWeek in scheduleDTO.DaysOfWeek)
            {
                // البحث عن الجداول الموجودة لنفس الطبيب في نفس اليوم
                var existingSchedules = await _db.DoctorSchedules
                    .Where(s => s.DoctorId == scheduleDTO.DoctorId && s.DayOfWeek == dayOfWeek)
                    .ToListAsync();

                // تحقق من وجود تعارض
                var hasConflict = existingSchedules.Any(existingSchedule =>
                    scheduleDTO.StartTime < existingSchedule.EndTime &&
                    scheduleDTO.EndTime > existingSchedule.StartTime
                );

                if (hasConflict)
                {
                    conflictingDays.Add(dayOfWeek); // أضف اليوم إلى قائمة التعارض
                    continue;
                }

                // إضافة الجدول الجديد إذا لم يكن هناك تعارض
                var doctorSchedule = new DoctorSchedule
                {
                    DayOfWeek = dayOfWeek,
                    StartTime = scheduleDTO.StartTime,
                    EndTime = scheduleDTO.EndTime,
                    DoctorId = scheduleDTO.DoctorId
                };

                _db.DoctorSchedules.Add(doctorSchedule);
                addedDays.Add(dayOfWeek); // أضف اليوم إلى قائمة الأيام المُضافة
            }

            // حفظ التغييرات
            await _db.SaveChangesAsync();

            // الإبلاغ عن النتيجة
            if (conflictingDays.Any())
            {
                return Ok(new
                {
                    addedDays = addedDays,
                    conflictingDays = conflictingDays,
                    message = "Some schedules could not be added due to conflicts."
                });
            }

            return Ok(new { message = "All schedules added successfully!", addedDays = addedDays });
        }



        // GET: api/Doctorschedules/GetDoctorSchedules
        [HttpGet("GetDoctorSchedules")]
        public async Task<IActionResult> GetDoctorSchedules()
        {
            var schedules = await _db.DoctorSchedules
                .Include(ds => ds.Doctor)
                .Select(ds => new
                {
                    ds.ScheduleId,
                    ds.DayOfWeek,
                    ds.StartTime,
                    ds.EndTime,
                    Doctor = new
                    {
                        ds.Doctor.DoctorId,
                        FullName = ds.Doctor.User.FirstName + " " + ds.Doctor.User.LastName
                    }
                })
                .ToListAsync();

            return Ok(schedules);
        }

        // GET: api/Doctorschedules/GetDoctorSchedule/{id}
        [HttpGet("GetDoctorSchedule/{id}")]
        public async Task<IActionResult> GetDoctorSchedule(int id)
        {
            var schedule = await _db.DoctorSchedules
    .Include(ds => ds.Doctor)  // Ensure that the Doctor data is included
    .ThenInclude(d => d.User)  // Ensure that the related User data is included (assuming Doctor has a User reference)
    .Where(ds => ds.ScheduleId == id)
    .Select(ds => new
    {
        ds.ScheduleId,
        ds.DayOfWeek,
        ds.StartTime,
        ds.EndTime,
        DoctorId = ds.DoctorId,
        DoctorFullName = ds.Doctor != null ? (ds.Doctor.User.FirstName + " " + ds.Doctor.User.LastName) : "Doctor not assigned"
    })
    .FirstOrDefaultAsync();


            if (schedule == null)
            {
                return NotFound(new { message = "Schedule not found" });
            }

            return Ok(schedule);
        }


        [HttpPut("UpdateDoctorSchedule/{id}")]
        public async Task<IActionResult> UpdateDoctorSchedule(int id, [FromForm] UpdateDoctorScheduleDTO scheduleDTO)
        {
            var doctorSchedule = await _db.DoctorSchedules.FindAsync(id);

            if (doctorSchedule == null)
            {
                return NotFound(new { message = "Schedule not found" });
            }

            // Update only the StartTime and EndTime
            doctorSchedule.StartTime = scheduleDTO.StartTime;
            doctorSchedule.EndTime = scheduleDTO.EndTime;

            _db.DoctorSchedules.Update(doctorSchedule);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Doctor schedule updated successfully" });
        }

        // DELETE: api/Doctorschedules/DeleteDoctorSchedule/{id}
        [HttpDelete("DeleteDoctorSchedule/{id}")]
        public async Task<IActionResult> DeleteDoctorSchedule(int id)
        {
            var schedule = await _db.DoctorSchedules.FindAsync(id);
            if (schedule == null)
            {
                return NotFound(new { message = "Schedule not found" });
            }

            _db.DoctorSchedules.Remove(schedule);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Schedule deleted successfully" });
        }


        [HttpGet("GetSchedulesByDoctor/{doctorId}")]
        public async Task<IActionResult> GetSchedulesByDoctor(int doctorId)
        {
            var schedules = await _db.DoctorSchedules
                .Where(s => s.DoctorId == doctorId)
                .ToListAsync();

            if (schedules == null || schedules.Count == 0)
            {
                return NotFound(new { message = "No schedules found for this doctor" });
            }

            return Ok(schedules);
        }



    }
}
