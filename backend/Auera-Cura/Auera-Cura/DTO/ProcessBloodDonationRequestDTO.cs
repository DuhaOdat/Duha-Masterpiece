namespace Auera_Cura.DTO
{
    public class ProcessBloodDonationRequestDTO
    {
        public int? BloodTypeId { get; set; }  // Nullable: Technician can assign the blood type
        public string? Status { get; set; }  // Approved, Rejected, etc.
        public string? Notes { get; set; }  // Additional comments or notes
        public int LabTechnicianId { get; set; }  // Lab Technician handling the request
    }
}
