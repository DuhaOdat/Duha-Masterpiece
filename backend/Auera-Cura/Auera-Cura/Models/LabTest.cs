using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class LabTest
{
    public int TestId { get; set; }

    public string? TestName { get; set; }

    public string? Description { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public bool? IsAvailable { get; set; }

    public string? NormalRange { get; set; }

    public string? Unit { get; set; }

    public virtual ICollection<LabTestOrder> LabTestOrders { get; set; } = new List<LabTestOrder>();
}
