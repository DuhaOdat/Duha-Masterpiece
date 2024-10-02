using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class PatientProfile
{
    public int PatientId { get; set; }

    public int? UserId { get; set; }

    public string? Gender { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public decimal? Weight { get; set; }

    public string? Status { get; set; }

    public int? BloodTypeId { get; set; }

    public int? RewardPoints { get; set; }

    public virtual BloodType? BloodType { get; set; }

    public virtual User? User { get; set; }
}
