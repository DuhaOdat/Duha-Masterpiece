using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class Appointment
{
    public int AppointmentId { get; set; }

    public int? DoctorId { get; set; }

    public int? PatientId { get; set; }

    public DateTime AppointmentDate { get; set; }

    public string Status { get; set; } = null!;

    public string? Notes { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Doctor? Doctor { get; set; }

    public virtual PatientProfile? Patient { get; set; }
}
