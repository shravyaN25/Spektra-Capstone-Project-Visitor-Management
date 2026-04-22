using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Visitor_Backend.Migrations
{
    /// <inheritdoc />
    public partial class MasterInitialStaticBCrypt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FlatNumber = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Visitors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Purpose = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Otp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OtpExpiry = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ExpectedArrival = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EntryTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExitTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResidentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Visitors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Visitors_Users_ResidentId",
                        column: x => x.ResidentId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VisitorLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VisitorId = table.Column<int>(type: "int", nullable: false),
                    CheckInTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CheckOutTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisitorLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VisitorLogs_Visitors_VisitorId",
                        column: x => x.VisitorId,
                        principalTable: "Visitors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VisitorLogs_VisitorId",
                table: "VisitorLogs",
                column: "VisitorId");

            migrationBuilder.CreateIndex(
                name: "IX_Visitors_PhoneNumber",
                table: "Visitors",
                column: "PhoneNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Visitors_ResidentId",
                table: "Visitors",
                column: "ResidentId");

            // --- ADVANCED DATABASE OBJECTS (SQUASHED) ---

            // 1. Stored Procedures
            migrationBuilder.Sql(@"
                CREATE PROCEDURE sp_GetResidentVisitors
                    @ResidentId INT
                AS
                BEGIN
                    SELECT * FROM vw_VisitorSummary WHERE ResidentId = @ResidentId ORDER BY ExpectedArrival DESC
                END;
            ");

            migrationBuilder.Sql(@"
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

            // 2. Trigger
            migrationBuilder.Sql(@"
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

            // 3. View
            migrationBuilder.Sql(@"
                CREATE VIEW vw_VisitorSummary AS
                SELECT 
                    v.Id, v.FullName, v.PhoneNumber, v.Purpose, v.Status, v.ExpectedArrival, v.EntryTime, v.ExitTime, v.ResidentId,
                    u.Name AS ResidentName, u.FlatNumber
                FROM Visitors v LEFT JOIN Users u ON v.ResidentId = u.Id;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_VisitorSummary;");
            migrationBuilder.Sql("DROP TRIGGER IF EXISTS trg_VisitorStatusLogs;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_UpdateVisitorStatus;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_GetResidentVisitors;");

            migrationBuilder.DropTable(
                name: "VisitorLogs");

            migrationBuilder.DropTable(
                name: "Visitors");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
