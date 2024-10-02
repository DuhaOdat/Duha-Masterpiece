using Auera_Cura.Models;

namespace Auera_Cura.DTO
{
    public class DepartmentDTO
    {

        public string DepartmentName { get; set; } = null!;

        public string? DepartmentDescription { get; set; }

        public IFormFile? Image { get; set; }

        public string? Phone { get; set; }

        public int? NumberOfRooms { get; set; }

        public int? NumberOfBeds { get; set; }

    }
}
