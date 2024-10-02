namespace Auera_Cura.DTO
{
    public class AdminUserRegistrationDTO
    {
        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // "Doctor", "Lab Technician", "Radiologic Technologist","superAdmin","Admin"
    }
}
