using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class RewardClaim
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int RewardId { get; set; }

    public DateTime ClaimedDate { get; set; }

    public bool IsClaimed { get; set; }

    public DateTime? EmailSentDate { get; set; }

    public DateTime? CollectedDate { get; set; }

    public bool IsCollected { get; set; }

    public virtual Reward Reward { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
