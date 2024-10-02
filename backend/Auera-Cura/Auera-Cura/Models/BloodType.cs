using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class BloodType
{
    public int BloodTypeId { get; set; }

    public string? BloodType1 { get; set; }

    public int? RewardPoints { get; set; }

    public virtual ICollection<BloodDonationRequest> BloodDonationRequests { get; set; } = new List<BloodDonationRequest>();

    public virtual ICollection<PatientProfile> PatientProfiles { get; set; } = new List<PatientProfile>();
}
