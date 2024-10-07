using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class MedicalImageOrder
{
    public int OrderId { get; set; }

    public int? PatientId { get; set; }

    public int? DoctorId { get; set; }

    public int? ImageTypeId { get; set; }

    public DateTime? OrderDate { get; set; }

    public string? Status { get; set; }

    public string? Notes { get; set; }

    public virtual User? Doctor { get; set; }

    public virtual MedicalImageType? ImageType { get; set; }

    public virtual User? Patient { get; set; }
}
