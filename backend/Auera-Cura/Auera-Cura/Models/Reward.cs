using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class Reward
{
    public int RewardId { get; set; }

    public string? RewardName { get; set; }

    public string? Description { get; set; }

    public int? PointsRequired { get; set; }

    public virtual ICollection<RewardClaim> RewardClaims { get; set; } = new List<RewardClaim>();
}
