using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Visitor_Backend.Models
{
    public class Visitor
    {
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        public string Purpose { get; set; } = string.Empty;

        public string? Otp { get; set; }
        public DateTime? OtpExpiry { get; set; }


        public VisitorStatus Status { get; set; } = VisitorStatus.Pending;

        public DateTime ExpectedArrival { get; set; }

        public DateTime? EntryTime { get; set; }

        public DateTime? ExitTime { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Key to the Resident (User)
        [Required]
        public int ResidentId { get; set; }

        [ForeignKey("ResidentId")]
        public User? Resident { get; set; }
    }
}
