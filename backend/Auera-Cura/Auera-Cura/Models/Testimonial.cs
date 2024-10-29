using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class Testimonial
{
    public int TestimonialId { get; set; }

    public int? UserId { get; set; }

    public string? TestimonialMessege { get; set; }

    public bool? IsAccept { get; set; }

    public virtual User? User { get; set; }
}
