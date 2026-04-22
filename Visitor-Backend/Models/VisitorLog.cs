using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Visitor_Backend.Models
{
    public class VisitorLog
    {
        public int Id { get; set; }

        [Required]
        public int VisitorId { get; set; }

        [ForeignKey("VisitorId")]
        public Visitor? Visitor { get; set; }

        public DateTime CheckInTime { get; set; } = DateTime.UtcNow;

        public DateTime? CheckOutTime { get; set; }
    }
}
