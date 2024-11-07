namespace Auera_Cura.DTO
{
    public class SendEmailRequest
    {
        public int RewardClaimId { get; set; }
        public DateTime ProcessingDate { get; set; } // Date for user to come and collect the reward
    }
}
