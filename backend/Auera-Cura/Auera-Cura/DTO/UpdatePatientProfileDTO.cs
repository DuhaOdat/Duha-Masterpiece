using Auera_Cura.Models;

namespace Auera_Cura.DTO
{
    public class UpdatePatientProfileDTO
    {
      

        public string? Gender { get; set; }

        public DateOnly? DateOfBirth { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }

        public decimal? Weight { get; set; }
        public string? Status { get; set; }
        public int? BloodTypeId { get; set; }

     
    }
}
