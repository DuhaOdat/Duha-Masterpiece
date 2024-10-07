using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class MedicalImageType
{
    public int ImageTypeId { get; set; }

    public string ImageTypeName { get; set; } = null!;

    public virtual ICollection<MedicalImageOrder> MedicalImageOrders { get; set; } = new List<MedicalImageOrder>();

    public virtual ICollection<MedicalImage> MedicalImages { get; set; } = new List<MedicalImage>();
}
