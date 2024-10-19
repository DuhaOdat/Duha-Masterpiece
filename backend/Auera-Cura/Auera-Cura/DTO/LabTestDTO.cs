namespace Auera_Cura.DTO
{
    public class LabTestDTO
    {
        public string? TestName { get; set; }

        public string? Description { get; set; }
        public int? CreatedBy { get; set; }

        public string? NormalRange { get; set; }

        public string? Unit { get; set; }

        public bool? IsAvailable { get; set; }
    }
}
