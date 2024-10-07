using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class BloodDonationRequest
{
    public int RequestId { get; set; }

    public int? PatientId { get; set; }

    public int? BloodTypeId { get; set; }

    public DateTime? RequestDate { get; set; }

    public string? Status { get; set; }

    public string? Notes { get; set; }

    public int? LabTechnicianId { get; set; }

    public DateTime? PreferredDonationDate { get; set; }

    public bool? DonationConfirmed { get; set; }

    public DateTime? DonationDate { get; set; }

    public virtual BloodType? BloodType { get; set; }

    public virtual User? LabTechnician { get; set; }

    public virtual User? Patient { get; set; }
}
