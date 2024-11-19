namespace Auera_Cura.DTO
{
    public class DoctorScheduleDTO
    {
        //public string DayOfWeek { get; set; } // e.g., "Monday"
        //public TimeOnly StartTime { get; set; }
        //public TimeOnly EndTime { get; set; }
        //public int DoctorId { get; set; } // Doctor ID for linking the schedule


        public int DoctorId { get; set; }            // معرف الطبيب
        public List<string> DaysOfWeek { get; set; } // قائمة الأيام
        public TimeOnly StartTime { get; set; }      // وقت البدء
        public TimeOnly EndTime { get; set; }        // وقت الانتهاء
    }
}
