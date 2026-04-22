using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Visitor_Backend.Data;
using Visitor_Backend.DTOs;
using Visitor_Backend.Models;

namespace Visitor_Backend.Services;

/// <summary>
/// AUTH SERVICE: Handles Login, Security, and Digital ID (JWT Tokens).
/// Simplified using C# 12 Primary Constructors.
/// </summary>
public class AuthService(AppDbContext context, IConfiguration configuration)
{
    public async Task<ServiceResponse<LoginResponseDto>> Login(LoginDto dto)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return ServiceResponse<LoginResponseDto>.FailureResponse("Invalid email or password.");

        if (user.Role.ToString() != dto.LoginFrom)
            return ServiceResponse<LoginResponseDto>.FailureResponse($"Unauthorized. You are registered as {user.Role}.");

        return ServiceResponse<LoginResponseDto>.SuccessResponse(new LoginResponseDto
        {
            Id = user.Id,
            Token = CreateToken(user),
            Role = user.Role.ToString(),
            Name = user.Name
        }, "Login successful.");
    }

    public async Task<ServiceResponse<string>> ChangePassword(int userId, ChangePasswordDto dto)
    {
        var user = await context.Users.FindAsync(userId);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
            return ServiceResponse<string>.FailureResponse("User not found or incorrect old password.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await context.SaveChangesAsync();
        return ServiceResponse<string>.SuccessResponse("Password updated successfully.");
    }

    private string CreateToken(User user)
    {
        var jwtSettings = configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!));
        
        var claims = new[] {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
    }
}
