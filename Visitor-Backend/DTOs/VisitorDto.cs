using System.ComponentModel.DataAnnotations;
using Visitor_Backend.Models;

namespace Visitor_Backend.DTOs
{
    public class VisitorCreateDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        public string Purpose { get; set; } = string.Empty;

        public DateTime ExpectedArrival { get; set; }

        [Required]
        public int ResidentId { get; set; }
    }

    public class VisitorUpdateStatusDto
    {
        [Required]
        public VisitorStatus Status { get; set; }
    }

    public class VerifyOtpDto
    {
        [Required]
        public string Otp { get; set; } = string.Empty;
    }

    public class VisitorDisplayDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Purpose { get; set; } = string.Empty;
        public VisitorStatus Status { get; set; }
        public DateTime ExpectedArrival { get; set; }
        public DateTime? EntryTime { get; set; }
        public DateTime? ExitTime { get; set; }
        public string ResidentName { get; set; } = string.Empty;
        public string FlatNumber { get; set; } = string.Empty;
    }
}
