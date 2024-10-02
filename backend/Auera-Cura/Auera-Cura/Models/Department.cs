using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class Department
{
    public int DepartmentId { get; set; }

    public string DepartmentName { get; set; } = null!;

    public string? DepartmentDescription { get; set; }

    public string? Image { get; set; }

    public string? Phone { get; set; }

    public int? NumberOfRooms { get; set; }

    public int? NumberOfBeds { get; set; }

    public virtual ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
}
