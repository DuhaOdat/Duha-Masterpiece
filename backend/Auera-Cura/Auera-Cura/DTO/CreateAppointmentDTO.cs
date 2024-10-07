namespace Auera_Cura.DTO
{
    public class CreateAppointmentDTO
    {
        public int DoctorID { get; set; }
        public int PatientID { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? Notes { get; set; }
    }
}
