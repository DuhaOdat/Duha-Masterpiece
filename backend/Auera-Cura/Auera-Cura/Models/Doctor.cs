using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class Doctor
{
    public int DoctorId { get; set; }

    public bool? IsHead { get; set; }

    public string? Image { get; set; }

    public string? Specialty { get; set; }

    public string? Biography { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public double? Rating { get; set; }

    public int? ExperienceYears { get; set; }

    public string? Education { get; set; }

    public string? AvailabilityStatus { get; set; }

    public int? DepartmentId { get; set; }

    public int? UserId { get; set; }

    public virtual Department? Department { get; set; }

    public virtual ICollection<DoctorSchedule> DoctorSchedules { get; set; } = new List<DoctorSchedule>();

    public virtual User? User { get; set; }
}
