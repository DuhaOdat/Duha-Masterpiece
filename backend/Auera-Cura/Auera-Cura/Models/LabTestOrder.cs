using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class LabTestOrder
{
    public int OrderId { get; set; }

    public int? TestId { get; set; }

    public int? PatientUserId { get; set; }

    public int? DoctorUserId { get; set; }

    public DateTime? OrderDate { get; set; }

    public string? Status { get; set; }

    public virtual User? DoctorUser { get; set; }

    public virtual ICollection<LabTestResult> LabTestResults { get; set; } = new List<LabTestResult>();

    public virtual User? PatientUser { get; set; }

    public virtual LabTest? Test { get; set; }
}
