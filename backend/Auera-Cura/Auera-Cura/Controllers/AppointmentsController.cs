using Auera_Cura.DTO;
using Auera_Cura.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Auera_Cura.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly MyDbContext _db;

        public AppointmentsController(MyDbContext db)
        {
            _db = db;
        }



        [HttpGet("GetDoctorByUserId/{userId}")]
        public async Task<IActionResult> GetDoctorByUserId(int userId)
        {
            // Find the doctor by userId
            var doctor = await _db.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
            if (doctor == null)
            {
                return NotFound("Doctor not found.");
            }

            // Return the DoctorId
            return Ok(new
            {
                DoctorId = doctor.DoctorId
            });
        }

        [HttpGet("GetDoctorScheduleByDoctorId/{doctorId}")]
        public async Task<IActionResult> GetDoctorScheduleByDoctorId(int doctorId)
        {
            // Get the doctor's schedule using the doctorId
            var schedule = await _db.DoctorSchedules
                .Where(s => s.DoctorId == doctorId)
                .ToListAsync();

            if (schedule == null || !schedule.Any())
            {
                return NotFound("No schedule found for this doctor.");
            }

            // Return the schedule
            return Ok(schedule);
        }









        [HttpPost("CreateAppointment")]
        public async Task<IActionResult> CreateAppointment([FromForm] AppointmentDTO dto)
        {
            // التحقق من أن الجدول الزمني للطبيب يحتوي على موعد
            var doctorSchedule = await _db.DoctorSchedules
                .Where(s => s.DoctorId == dto.DoctorID && s.DayOfWeek == dto.AppointmentDate.DayOfWeek.ToString())
                .FirstOrDefaultAsync();

            if (doctorSchedule == null ||
                TimeOnly.FromTimeSpan(dto.AppointmentDate.TimeOfDay) < doctorSchedule.StartTime ||
                TimeOnly.FromTimeSpan(dto.AppointmentDate.TimeOfDay) > doctorSchedule.EndTime)
            {
                return BadRequest("Doctor is not available at this time.");
            }

            // التحقق من أن الموعد غير موجود مسبقًا باستخدام مقارنة دقيقة للوقت
            var existingAppointment = await _db.Appointments
                .Where(a => a.DoctorId == dto.DoctorID &&
                            a.AppointmentDate.Date == dto.AppointmentDate.Date && // التحقق من نفس اليوم
                            a.AppointmentDate.TimeOfDay == dto.AppointmentDate.TimeOfDay) // التحقق من نفس الوقت
                .FirstOrDefaultAsync();

            if (existingAppointment != null)
            {
                return BadRequest("Appointment already exists at this time.");
            }

            // إنشاء موعد جديد
            var appointment = new Appointment
            {
                DoctorId = dto.DoctorID,
                PatientId = dto.PatientID,
                AppointmentDate = dto.AppointmentDate,
                Status = "Confirmed",
                Notes = dto.Notes
            };

            _db.Appointments.Add(appointment);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Appointment created successfully." });
        }




        [HttpGet("GetAllPatients")]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await _db.PatientProfiles
                .Join(_db.Users,
                      patientProfile => patientProfile.UserId,  // Foreign key from PatientProfile
                      user => user.Id,                          // Primary key in Users table
                      (patientProfile, user) => new
                      {
                          PatientId = patientProfile.PatientId,  // Patient ID from PatientProfile
                          FirstName = user.FirstName,            // First name from Users table
                          LastName = user.LastName               // Last name from Users table
                      })
                .ToListAsync();

            return Ok(patients);
        }



        [HttpGet("CountDoctorAppointments/{userId}")]
        public async Task<IActionResult> CountDoctorAppointments(int userId)
        {
            // البحث عن الطبيب باستخدام userId
            var doctor = await _db.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.UserId == userId);
            if (doctor == null)
            {
                return NotFound("Doctor not found.");
            }

            // استرداد عدد المواعيد للطبيب
            var appointmentCount = await _db.Appointments
                .Where(a => a.DoctorId == doctor.UserId)  // استخدام DoctorID لاسترداد المواعيد
                .CountAsync();  // حساب العدد

            if (appointmentCount == 0)
            {
                return NotFound("No appointments found for this doctor.");
            }

            return Ok(new { count = appointmentCount });
        }




        [HttpGet("GetDoctorAppointmentsByDate/{userId}")]
        public async Task<IActionResult> GetDoctorAppointmentsByDate(int userId, [FromQuery] DateTime date)
        {
            // البحث عن الطبيب باستخدام userId
            var doctor = await _db.Doctors.FirstOrDefaultAsync(d => d.DoctorId == userId);
            if (doctor == null)
            {
                return NotFound("Doctor not found.");
            }

            // طباعة بعض المعلومات لتأكيد أن البيانات صحيحة
            Console.WriteLine($"Doctor found: {doctor.DoctorId}, Searching for appointments on: {date.Date}");

            // جلب جميع المواعيد للطبيب في هذا اليوم
            var appointments = await _db.Appointments
                .Where(a => a.DoctorId == doctor.DoctorId && a.AppointmentDate.Date == date.Date)
                .Select(a => new
                {
                    a.AppointmentId,
                    a.AppointmentDate
                })
                .ToListAsync();



            if (appointments == null || !appointments.Any())
            {
                return NotFound("No appointments found for the selected date.");
            }

            return Ok(appointments);
        }


        // API to get all appointments for a specific doctor using userId passed from client (stored in local storage)
        [HttpGet("GetAllDoctorAppointments/{userId}")]
        public async Task<IActionResult> GetAllDoctorAppointments(int userId)
        {
            // Find the doctor using the userId
            var doctor = await _db.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.UserId == userId);
            if (doctor == null)
            {
                return NotFound("Doctor not found.");
            }

            // Retrieve all appointments for the doctor
            var appointments = await _db.Appointments
                .Include(a => a.Patient)
                .ThenInclude(p => p.User)  // Include patient user information
                .Where(a => a.DoctorId == doctor.UserId)
                .Select(a => new
                {
                    a.AppointmentId,
                    DoctorName = $"{doctor.User.FirstName} {doctor.User.LastName}",  // Doctor's name from the Users table
                    PatientName = a.Patient != null ? $"{a.Patient.User.FirstName} {a.Patient.User.LastName}" : "Unknown",  // Check if patient is not null
                    a.AppointmentDate,
                    a.Status,
                    a.Notes
                })
                .ToListAsync();

            if (!appointments.Any())
            {
                return NotFound("No appointments found for this doctor.");
            }

            return Ok(appointments);
        }


        [HttpPut("EditAppointment/{appointmentId}")]
        public async Task<IActionResult> EditAppointment(int appointmentId, [FromForm] AppointmentDTO dto)
        {
            // Find the appointment using appointmentId
            var appointment = await _db.Appointments.FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            // Update the appointment details
            appointment.DoctorId = dto.DoctorID;
            appointment.PatientId = dto.PatientID;
            appointment.AppointmentDate = dto.AppointmentDate;
            appointment.Status = "Confirmed";
            appointment.Notes = dto.Notes;

            // Save the changes to the database
            await _db.SaveChangesAsync();

            return Ok(new { message = "Appointment updated successfully." });
        }

        [HttpDelete("DeleteAppointment/{appointmentId}")]
        public async Task<IActionResult> DeleteAppointment(int appointmentId)
        {
            // Find the appointment using appointmentId
            var appointment = await _db.Appointments.FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            // Remove the appointment from the database
            _db.Appointments.Remove(appointment);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Appointment deleted successfully." });
        }




        [HttpGet("GetPastAppointments/{patientId}")]
        public async Task<IActionResult> GetPastAppointments(int patientId)
        {
            // Find the patient using patientId
            var patient = await _db.PatientProfiles.Include(p => p.User).FirstOrDefaultAsync(p => p.PatientId == patientId);
            if (patient == null)
            {
                return NotFound("Patient not found.");
            }

            // Get the current date and time
            var currentDate = DateTime.Now;

            // Retrieve past appointments (appointments that have already occurred)
            var pastAppointments = await _db.Appointments
                .Include(a => a.Doctor)
                .ThenInclude(d => d.User)  // Include doctor user information
                .Where(a => a.PatientId == patient.PatientId && a.AppointmentDate < currentDate)
                .Select(a => new
                {
                    a.AppointmentId,
                    DoctorName = $"{a.Doctor.User.FirstName} {a.Doctor.User.LastName}",
                    a.AppointmentDate,
                    a.Status,
                    a.Notes
                })
                .ToListAsync();

            if (!pastAppointments.Any())
            {
                return NotFound("No past appointments found.");
            }

            return Ok(pastAppointments);
        }






        [HttpGet("GetUpcomingAppointments/{patientId}")]
        public async Task<IActionResult> GetUpcomingAppointments(int patientId)
        {
            // Find the patient using patientId
            var patient = await _db.PatientProfiles.Include(p => p.User).FirstOrDefaultAsync(p => p.PatientId == patientId);
            if (patient == null)
            {
                return NotFound("Patient not found.");
            }

            // Get the current date and time
            var currentDate = DateTime.Now;

            // Retrieve future appointments (appointments that will occur in the future)
            var upcomingAppointments = await _db.Appointments
                .Include(a => a.Doctor)
                .ThenInclude(d => d.User)  // Include doctor user information
                .Where(a => a.PatientId == patient.PatientId && a.AppointmentDate >= currentDate)
                .Select(a => new
                {
                    a.AppointmentId,
                    DoctorName = $"{a.Doctor.User.FirstName} {a.Doctor.User.LastName}",
                    a.AppointmentDate,
                    a.Status,
                    a.Notes
                })
                .ToListAsync();

            if (!upcomingAppointments.Any())
            {
                return NotFound("No upcoming appointments found.");
            }

            return Ok(upcomingAppointments);
        }



    }
}
