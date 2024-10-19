namespace Auera_Cura.DTO
{
    public class DoctorScheduleDTO
    {
        public string DayOfWeek { get; set; } // e.g., "Monday"
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public int DoctorId { get; set; } // Doctor ID for linking the schedule
      

    }
}
