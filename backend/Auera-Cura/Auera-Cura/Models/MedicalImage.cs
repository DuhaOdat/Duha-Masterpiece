using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class MedicalImage
{
    public int ImageId { get; set; }

    public int? ImageTypeId { get; set; }

    public string? FilePath { get; set; }

    public int? UploadedByLabTech { get; set; }

    public DateTime? UploadDate { get; set; }

    public string? Status { get; set; }

    public string? Result { get; set; }

    public int? PatientId { get; set; }

    public int? DoctorId { get; set; }

    public virtual User? Doctor { get; set; }

    public virtual MedicalImageType? ImageType { get; set; }

    public virtual User? Patient { get; set; }

    public virtual User? UploadedByLabTechNavigation { get; set; }
}
