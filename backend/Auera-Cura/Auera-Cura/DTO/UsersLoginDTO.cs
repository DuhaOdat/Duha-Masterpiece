using System.ComponentModel.DataAnnotations;

namespace Auera_Cura.DTO
{
    public class UsersLoginDTO
    {
        [Required]
        public string Email { get; set; }  // Email 

        [Required]
        public string Password { get; set; }  // User's password
    }
}
