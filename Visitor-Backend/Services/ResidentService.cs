using Microsoft.EntityFrameworkCore;
using Visitor_Backend.Data;
using Visitor_Backend.DTOs;
using Visitor_Backend.Models;

namespace Visitor_Backend.Services;

/// <summary>
/// RESIDENT SERVICE: Handles resident-specific data.
/// Simplified with C# 12 Primary Constructors.
/// </summary>
public class ResidentService(AppDbContext context)
{
    public async Task<ServiceResponse<IEnumerable<ResidentDisplayDto>>> GetAllResidents() =>
        ServiceResponse<IEnumerable<ResidentDisplayDto>>.SuccessResponse(
            (await context.Users.Where(u => u.Role == UserRole.Resident).ToListAsync())
            .Select(u => new ResidentDisplayDto 
            { 
                Id = u.Id, 
                Name = u.Name, 
                Email = u.Email,
                FlatNumber = u.FlatNumber ?? "N/A",
                PhoneNumber = u.PhoneNumber ?? "N/A"
            }));

    public async Task<ServiceResponse<User>> GetResidentById(int id, int userId, string userRole)
    {
        var user = await context.Users.FindAsync(id);
        if (user == null || user.Role != UserRole.Resident) return ServiceResponse<User>.FailureResponse("Not found.");
        if (userRole == "Resident" && userId != id) return ServiceResponse<User>.FailureResponse("Not authorized.");
        return ServiceResponse<User>.SuccessResponse(user);
    }

    public async Task<ServiceResponse<User>> CreateResident(ResidentCreateDto dto)
    {
        if (await context.Users.AnyAsync(u => u.Email == dto.Email))
            return ServiceResponse<User>.FailureResponse("Email already exists.");

        var user = new User { Name = dto.Name, Email = dto.Email, Role = UserRole.Resident, FlatNumber = dto.FlatNumber, PhoneNumber = dto.PhoneNumber, PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password) };
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return ServiceResponse<User>.SuccessResponse(user);
    }

    public async Task<ServiceResponse<string>> UpdateResident(int id, ResidentUpdateDto dto, int userId, string userRole)
    {
        var user = await context.Users.FindAsync(id);
        if (user == null || user.Role != UserRole.Resident) return ServiceResponse<string>.FailureResponse("Not found.");
        if (userRole == "Resident" && userId != id) return ServiceResponse<string>.FailureResponse("Not authorized.");

        // Check if new email is already taken by another user
        if (user.Email != dto.Email && await context.Users.AnyAsync(u => u.Email == dto.Email))
            return ServiceResponse<string>.FailureResponse("Email is already assigned to another resident.");

        user.Name = dto.Name;
        user.Email = dto.Email;
        user.FlatNumber = dto.FlatNumber;
        user.PhoneNumber = dto.PhoneNumber;
        await context.SaveChangesAsync();
        return ServiceResponse<string>.SuccessResponse("Updated successfully.");
    }

    public async Task<ServiceResponse<string>> DeleteResident(int id)
    {
        var user = await context.Users.FindAsync(id);
        if (user == null) return ServiceResponse<string>.FailureResponse("Not found.");
        context.Users.Remove(user);
        await context.SaveChangesAsync();
        return ServiceResponse<string>.SuccessResponse("Deleted successfully.");
    }
}
