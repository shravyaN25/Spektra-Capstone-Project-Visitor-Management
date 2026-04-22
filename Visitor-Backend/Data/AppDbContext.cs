using Microsoft.EntityFrameworkCore;
using Visitor_Backend.Models;

namespace Visitor_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Visitor> Visitors { get; set; }
        public DbSet<VisitorLog> VisitorLogs { get; set; }
        public DbSet<VisitorSummary> VisitorSummaries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed index for Email since it should be unique
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Visitor>()
                .HasIndex(v => v.PhoneNumber);
            
            modelBuilder.Entity<VisitorSummary>()
                .HasNoKey()
                .ToView("vw_VisitorSummary");

            modelBuilder.Entity<Visitor>().ToTable(tb => tb.HasTrigger("trg_VisitorStatusLogs"));
        }
    }
}
