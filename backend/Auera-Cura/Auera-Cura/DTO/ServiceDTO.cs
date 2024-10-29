namespace Auera_Cura.DTO
{
    public class ServiceDTO
    {
        public string ServiceName { get; set; } = null!;

        public string? ServiceDescription { get; set; }

        public string? ServiceIcon { get; set; }

        public string? ServiceLink { get; set; }

        public DateTime? CreatedDate { get; set; }

        public bool? IsActive { get; set; }
    }
}
