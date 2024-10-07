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

        public AppointmentsController( MyDbContext db)
        {
            _db = db;
        }

        [HttpPost("CreateAppointment")]
        public async Task<IActionResult> CreateAppointment([FromForm] CreateAppointmentDTO dto)
        {
            // Fetch the doctor from the Users table based on the UserID in the Doctors table
            var doctor = await _db.Doctors
                .Include(d => d.User)  // Assuming Doctor has a navigation property to User
                .FirstOrDefaultAsync(d => d.DoctorId == dto.DoctorID);

            if (doctor == null)
            {
                return NotFound("Doctor not found.");
            }

            // Create the appointment
            var appointment = new Appointment
            {
                DoctorId = dto.DoctorID,
                PatientId = dto.PatientID,
                AppointmentDate = dto.AppointmentDate,
                Status = "Pending",
                Notes = dto.Notes
            };

            _db.Appointments.Add(appointment);
            await _db.SaveChangesAsync();

            // Respond with a success message including the doctor's name (from Users table)
            return Ok(new { message = $"Appointment created successfully with Dr. {doctor.User.FirstName} {doctor.User.LastName}." });
        }

        //[HttpGet("GetDoctorAppointments/{userId}")]
        //public async Task<IActionResult> GetDoctorAppointments(int userId)
        //{
        //    // Find the doctor based on the provided userId
        //    var doctor = await _db.Doctors.FirstOrDefaultAsync(d => d.UserID == userId);
        //    if (doctor == null)
        //    {
        //        return NotFound("Doctor not found.");
        //    }

        //    // Retrieve all appointments for this doctor
        //    var appointments = await _db.Appointments
        //        .Include(a => a.Patient)  // Include patient details
        //        .Where(a => a.DoctorId == doctor.DoctorID)  // Use doctor ID to get appointments
        //        .Select(a => new
        //        {
        //            a.AppointmentId,
        //            DoctorName = $"{doctor.User.FirstName} {doctor.User.LastName}", // Get doctor's name from Users table
        //            PatientName = $"{a.Patient.FirstName} {a.Patient.LastName}", // Get patient's name from Users table
        //            a.AppointmentDate,
        //            a.Status,
        //            a.Notes
        //        })
        //        .ToListAsync();

        //    if (!appointments.Any())
        //    {
        //        return NotFound("No appointments found for this doctor.");
        //    }

        //    return Ok(appointments);
        //}




    }
}
