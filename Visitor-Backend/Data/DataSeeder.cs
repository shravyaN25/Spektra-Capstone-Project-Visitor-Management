using Visitor_Backend.Models;
using Visitor_Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Visitor_Backend.Data
{
    public static class DataSeeder
    {
        public static void Seed(IApplicationBuilder applicationBuilder)
        {
            using (var serviceScope = applicationBuilder.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<AppDbContext>();
                if (context == null) return;

                ApplyDatabaseObjects(context);

                if (!context.Users.Any())
                {
                    context.Users.AddRange(new List<User>
                    {
                        new User
                        {
                            Name = "Admin User",
                            Email = "admin@system.com",
                            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                            Role = UserRole.Admin,
                        },
                        new User
                        {
                            Name = "Security User",
                            Email = "security@system.com",
                            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Security@123"),
                            Role = UserRole.Security,
                            PhoneNumber = "1234567890"
                        }
                    });

                    context.SaveChanges();
                }
            }
        }

        public static void ApplyDatabaseObjects(AppDbContext context)
        {
            try
            {
                // 1. View: vw_VisitorSummary
                context.Database.ExecuteSqlRaw(@"
                    IF OBJECT_ID('vw_VisitorSummary', 'V') IS NOT NULL DROP VIEW vw_VisitorSummary;
                ");
                context.Database.ExecuteSqlRaw(@"
                    CREATE VIEW vw_VisitorSummary AS
                    SELECT 
                        v.Id, v.FullName, v.PhoneNumber, v.Purpose, v.Status, v.ExpectedArrival, v.EntryTime, v.ExitTime, v.ResidentId,
                        u.Name AS ResidentName, u.FlatNumber
                    FROM Visitors v LEFT JOIN Users u ON v.ResidentId = u.Id;
                ");

                // 2. SP: sp_GetResidentVisitors
                context.Database.ExecuteSqlRaw(@"
                    IF OBJECT_ID('sp_GetResidentVisitors', 'P') IS NOT NULL DROP PROCEDURE sp_GetResidentVisitors;
                ");
                context.Database.ExecuteSqlRaw(@"
                    CREATE PROCEDURE sp_GetResidentVisitors
                        @ResidentId INT
                    AS
                    BEGIN
                        SELECT * FROM vw_VisitorSummary WHERE ResidentId = @ResidentId ORDER BY ExpectedArrival DESC
                    END;
                ");

                // 3. SP: sp_UpdateVisitorStatus
                context.Database.ExecuteSqlRaw(@"
                    IF OBJECT_ID('sp_UpdateVisitorStatus', 'P') IS NOT NULL DROP PROCEDURE sp_UpdateVisitorStatus;
                ");
                context.Database.ExecuteSqlRaw(@"
                    CREATE PROCEDURE sp_UpdateVisitorStatus
                        @VisitorId INT, @NewStatus INT
                    AS
                    BEGIN
                        UPDATE Visitors
                        SET Status = @NewStatus,
                            EntryTime = CASE WHEN @NewStatus = 3 THEN GETUTCDATE() ELSE EntryTime END,
                            ExitTime = CASE WHEN @NewStatus = 4 THEN GETUTCDATE() ELSE ExitTime END
                        WHERE Id = @VisitorId
                    END;
                ");

                // 4. Trigger: trg_VisitorStatusLogs
                context.Database.ExecuteSqlRaw(@"
                    IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_VisitorStatusLogs') DROP TRIGGER trg_VisitorStatusLogs;
                ");
                context.Database.ExecuteSqlRaw(@"
                    CREATE TRIGGER trg_VisitorStatusLogs
                    ON Visitors
                    AFTER UPDATE
                    AS
                    BEGIN
                        SET NOCOUNT ON;
                        INSERT INTO VisitorLogs (VisitorId, CheckInTime)
                        SELECT i.Id, GETUTCDATE() FROM inserted i JOIN deleted d ON i.Id = d.Id
                        WHERE i.Status = 3 AND d.Status <> 3;

                        UPDATE vl SET CheckOutTime = GETUTCDATE()
                        FROM VisitorLogs vl INNER JOIN inserted i ON vl.VisitorId = i.Id INNER JOIN deleted d ON i.Id = d.Id
                        WHERE i.Status = 4 AND d.Status <> 4 AND vl.CheckOutTime IS NULL;
                    END;
                ");

                Console.WriteLine(">>> SUCCESS: Database Objects (SPs, Views, Triggers) setup successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error setting up DB objects: {ex.Message}");
            }
        }
    }
}
