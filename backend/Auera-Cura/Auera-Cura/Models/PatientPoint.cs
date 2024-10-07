using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class PatientPoint
{
    public int PointId { get; set; }

    public int? PatientId { get; set; }

    public int CurrentPoints { get; set; }

    public int TotalPoints { get; set; }

    public DateTime? LastUpdated { get; set; }

    public virtual User? Patient { get; set; }
}
