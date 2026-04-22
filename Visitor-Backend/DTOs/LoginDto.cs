using System.ComponentModel.DataAnnotations;

namespace Visitor_Backend.DTOs
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
        public string LoginFrom { get; set; } = string.Empty; // values: "Admin", "Resident", "Security"
    }

    public class LoginResponseDto
    {
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}
