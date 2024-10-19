namespace Auera_Cura.DTO
{
    public class AppointmentDTO
    {
        public int DoctorID { get; set; }      // معرف الطبيب الذي سيحدد الموعد
        public int PatientID { get; set; }     // معرف المريض الذي سيتم تحديد الموعد له
        public DateTime AppointmentDate { get; set; }  // التاريخ والوقت المحددين للموعد
        public string? Notes { get; set; }     // أي ملاحظات إضافية بخصوص الموعد
    }
}
