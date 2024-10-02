using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class Service
{
    public int ServiceId { get; set; }

    public string ServiceName { get; set; } = null!;

    public string? ServiceDescription { get; set; }

    public string? ServiceIcon { get; set; }

    public string? ServiceLink { get; set; }

    public DateTime? CreatedDate { get; set; }

    public bool? IsActive { get; set; }
}
