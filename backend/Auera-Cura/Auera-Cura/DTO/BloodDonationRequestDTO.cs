﻿namespace Auera_Cura.DTO
{
    public class BloodDonationRequestDTO
    {
        public int PatientId { get; set; }  // Patient submitting the request
        public int? BloodTypeId { get; set; }  // Nullable if unknown
        public DateTime? PreferredDonationDate { get; set; }

    }
}
