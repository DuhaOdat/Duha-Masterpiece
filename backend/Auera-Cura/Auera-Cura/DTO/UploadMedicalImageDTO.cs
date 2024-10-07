namespace Auera_Cura.DTO
{
    public class UploadMedicalImageDTO
    {
        public int OrderID { get; set; }
        public int UploadedByLabTech { get; set; }
        public string FilePath { get; set; } // File path where the image is uploaded
    }
}
