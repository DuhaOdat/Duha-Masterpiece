using System;
using System.Collections.Generic;

namespace Auera_Cura.Models;

public partial class ContactU
{
    public int Id { get; set; }

    public string? Message { get; set; }

    public string? Name { get; set; }

    public string? Subject { get; set; }

    public string? Email { get; set; }

    public string? ReplyMessage { get; set; }

    public DateTime? CreatedAt { get; set; }
}
