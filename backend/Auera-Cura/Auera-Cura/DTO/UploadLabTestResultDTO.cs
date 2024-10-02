namespace Auera_Cura.DTO
{
    public class UploadLabTestResultDTO
    {
        public int OrderId { get; set; }
        public string Result { get; set; } // Lab test result text or data
        public int UploadedByLabTech { get; set; } // Lab Technician ID
    }
}
