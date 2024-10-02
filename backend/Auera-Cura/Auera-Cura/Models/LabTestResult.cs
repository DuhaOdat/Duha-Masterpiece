using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class LabTestResult
{
    public int ResultId { get; set; }

    public int? OrderId { get; set; }

    public string? Result { get; set; }

    public int? UploadedByLabTech { get; set; }

    public DateTime? UploadDate { get; set; }

    public DateTime? CompleteDate { get; set; }

    public string? Status { get; set; }

    public virtual LabTestOrder? Order { get; set; }

    public virtual User? UploadedByLabTechNavigation { get; set; }
}
