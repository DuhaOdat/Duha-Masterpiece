using Auera_Cura.Models;

namespace Auera_Cura.DTO
{
    public class editDoctorDTO
    {


        public bool? IsHead { get; set; }

        public IFormFile? Image { get; set; }

        public string? Specialty { get; set; }

        public string? Biography { get; set; }

        public string? Phone { get; set; }

        public double? Rating { get; set; }

        public int? ExperienceYears { get; set; }

        public string? AvailabilityStatus { get; set; }
        public string? Education { get; set; }

        public int? DepartmentId { get; set; }

    }
}
