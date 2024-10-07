using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class MedicalImageResult
{
    public int ResultId { get; set; }

    public int? OrderId { get; set; }

    public string? Result { get; set; }

    public int? UploadedByDoctorId { get; set; }

    public DateTime? UploadDate { get; set; }

    public string? Status { get; set; }

    public virtual MedicalImageOrder? Order { get; set; }

    public virtual User? UploadedByDoctor { get; set; }
}
