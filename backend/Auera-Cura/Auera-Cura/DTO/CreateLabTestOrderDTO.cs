using System.ComponentModel.DataAnnotations;

namespace Auera_Cura.DTO
{
    public class CreateLabTestOrderDTO
    {

        
        public int? TestId { get; set; }

       
        public int? PatientId { get; set; }

        
        public int? DoctorId { get; set; } // This will be passed from localStorage (doctor's UserID)
    }
}
