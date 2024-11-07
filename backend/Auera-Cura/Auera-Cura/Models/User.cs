using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class User
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public byte[]? PasswordHash { get; set; }

    public byte[]? PasswordSalt { get; set; }

    public string? Role { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<BloodDonationRequest> BloodDonationRequestLabTechnicians { get; set; } = new List<BloodDonationRequest>();

    public virtual ICollection<BloodDonationRequest> BloodDonationRequestPatients { get; set; } = new List<BloodDonationRequest>();

    public virtual ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();

    public virtual ICollection<LabTestOrder> LabTestOrderDoctorUsers { get; set; } = new List<LabTestOrder>();

    public virtual ICollection<LabTestOrder> LabTestOrderPatientUsers { get; set; } = new List<LabTestOrder>();

    public virtual ICollection<LabTestResult> LabTestResults { get; set; } = new List<LabTestResult>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<PatientPoint> PatientPoints { get; set; } = new List<PatientPoint>();

    public virtual PatientProfile? PatientProfile { get; set; }

    public virtual ICollection<RewardClaim> RewardClaims { get; set; } = new List<RewardClaim>();

    public virtual ICollection<Testimonial> Testimonials { get; set; } = new List<Testimonial>();
}
