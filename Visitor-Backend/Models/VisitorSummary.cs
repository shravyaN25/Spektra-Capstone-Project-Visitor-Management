using System;
using Microsoft.EntityFrameworkCore;
using Visitor_Backend.Models;

namespace Visitor_Backend.Models
{
    [Keyless]
    public class VisitorSummary
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Purpose { get; set; } = string.Empty;
        public VisitorStatus Status { get; set; }
        public DateTime ExpectedArrival { get; set; }
        public DateTime? EntryTime { get; set; }
        public DateTime? ExitTime { get; set; }
        public int ResidentId { get; set; }
        public string ResidentName { get; set; } = string.Empty;
        public string FlatNumber { get; set; } = string.Empty;
    }
}
