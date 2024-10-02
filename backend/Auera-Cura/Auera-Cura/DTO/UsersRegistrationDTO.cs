using System.ComponentModel.DataAnnotations;

namespace Auera_Cura.DTO
{
    public class UsersRegistrationDTO
    {

        [Required]
        public string FirstName { get; set; } = null!;

        [Required]
        public string LastName { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; }
       

    }
}
