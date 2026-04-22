using Microsoft.EntityFrameworkCore;
using Visitor_Backend.Data;
using Visitor_Backend.DTOs;
using Visitor_Backend.Models;

namespace Visitor_Backend.Services;

/// <summary>
/// VISITOR SERVICE: Manages all visitor logic.
/// Simplified with C# 12 Primary Constructors and expression-bodied members.
/// </summary>
public class VisitorService(AppDbContext context, IEmailService emailService)
{
    public async Task<ServiceResponse<VisitorDisplayDto>> AddVisitorAsync(VisitorCreateDto dto)
    {
        if (!await context.Users.AnyAsync(u => u.Id == dto.ResidentId && u.Role == UserRole.Resident))
            return ServiceResponse<VisitorDisplayDto>.FailureResponse("Resident not found.");

        var visitor = new Visitor {
            FullName = dto.FullName, PhoneNumber = dto.PhoneNumber, Purpose = dto.Purpose,
            ExpectedArrival = dto.ExpectedArrival, ResidentId = dto.ResidentId, Status = VisitorStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        context.Visitors.Add(visitor);
        await context.SaveChangesAsync();

        var result = await context.Visitors.Include(v => v.Resident).FirstAsync(v => v.Id == visitor.Id);
        return ServiceResponse<VisitorDisplayDto>.SuccessResponse(MapToDto(result), "Visitor added successfully.");
    }

    public async Task<ServiceResponse<IEnumerable<VisitorDisplayDto>>> GetPendingVisitorsAsync() =>
        ServiceResponse<IEnumerable<VisitorDisplayDto>>.SuccessResponse(
            (await context.VisitorSummaries.Where(v => v.Status != VisitorStatus.Exited && v.Status != VisitorStatus.Rejected)
            .OrderByDescending(v => v.Id).ToListAsync()).Select(MapToDto));

    public async Task<ServiceResponse<IEnumerable<VisitorDisplayDto>>> GetAllVisitorsAsync() =>
        ServiceResponse<IEnumerable<VisitorDisplayDto>>.SuccessResponse(
            (await context.VisitorSummaries.OrderByDescending(v => v.Id).ToListAsync()).Select(MapToDto));

    public async Task<ServiceResponse<IEnumerable<VisitorDisplayDto>>> GetVisitorsByResidentIdAsync(int residentId) =>
        ServiceResponse<IEnumerable<VisitorDisplayDto>>.SuccessResponse(
            (await context.VisitorSummaries.FromSqlRaw("EXEC sp_GetResidentVisitors {0}", residentId).ToListAsync()).Select(MapToDto));

    public async Task<ServiceResponse<string>> UpdateVisitorStatusAsync(int id, VisitorStatus status)
    {
        var visitor = await context.Visitors.FindAsync(id);
        if (visitor == null) return ServiceResponse<string>.FailureResponse("Visitor not found.");

        if (status == VisitorStatus.Approved)
        {
            visitor.Otp = new Random().Next(100000, 999999).ToString();
            visitor.OtpExpiry = DateTime.UtcNow.AddMinutes(15);
            context.Visitors.Update(visitor);
            await context.SaveChangesAsync();
        }

        try {
            await context.Database.ExecuteSqlRawAsync("EXEC sp_UpdateVisitorStatus {0}, {1}", id, (int)status);
            if (status == VisitorStatus.Approved) 
            {
                await context.Entry(visitor).Reference(v => v.Resident).LoadAsync();
                _ = Task.Run(() => SendEmail(visitor));
            }
            return ServiceResponse<string>.SuccessResponse($"Status updated to {status}.");
        } catch (Exception ex) { return ServiceResponse<string>.FailureResponse($"Error: {ex.Message}"); }
    }

    public async Task<ServiceResponse<string>> VerifyOtpAsync(int id, string otp)
    {
        var v = await context.Visitors.FindAsync(id);
        if (v == null || v.Status != VisitorStatus.Approved || v.Otp != otp || (v.OtpExpiry != null && v.OtpExpiry < DateTime.UtcNow))
            return ServiceResponse<string>.FailureResponse("Invalid/Expired OTP or visitor not approved.");

        return await UpdateVisitorStatusAsync(id, VisitorStatus.Entered);
    }

    public async Task<ServiceResponse<string>> DeleteVisitorAsync(int id)
    {
        var v = await context.Visitors.FindAsync(id);
        if (v == null) return ServiceResponse<string>.FailureResponse("Not found.");
        context.Visitors.Remove(v);
        await context.SaveChangesAsync();
        return ServiceResponse<string>.SuccessResponse("Deleted successfully.");
    }

    private void SendEmail(Visitor v)
    {
        try {
            var body = $"<h3>Hello {v.Resident?.Name},</h3><p>Visitor <b>{v.FullName}</b> is at the gate. OTP: <b>{v.Otp}</b></p>";
            emailService.SendEmailAsync(v.Resident!.Email, "Visitor OTP", body).Wait();
        } catch { }
    }

    private VisitorDisplayDto MapToDto(Visitor v) => new() {
        Id = v.Id, FullName = v.FullName, PhoneNumber = v.PhoneNumber, Purpose = v.Purpose,
        Status = v.Status, ExpectedArrival = v.ExpectedArrival, EntryTime = v.EntryTime, ExitTime = v.ExitTime,
        ResidentName = v.Resident?.Name ?? "Unknown", FlatNumber = v.Resident?.FlatNumber ?? "N/A"
    };

    private VisitorDisplayDto MapToDto(VisitorSummary v) => new() {
        Id = v.Id, FullName = v.FullName, PhoneNumber = v.PhoneNumber, Purpose = v.Purpose,
        Status = v.Status, ExpectedArrival = v.ExpectedArrival, EntryTime = v.EntryTime, ExitTime = v.ExitTime,
        ResidentName = v.ResidentName, FlatNumber = v.FlatNumber
    };
}
