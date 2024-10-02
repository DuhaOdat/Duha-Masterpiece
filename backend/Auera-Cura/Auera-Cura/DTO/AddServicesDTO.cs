using Auera_Cura.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Auera_Cura.DTO
{
    public class AddServicesDTO
    {
        public string ServiceName { get; set; } = null!;

        public string? ServiceDescription { get; set; }

        public string? ServiceIcon { get; set; }

        public DateTime? CreatedDate { get; set; }

        public bool? IsActive { get; set; }
    }
}
