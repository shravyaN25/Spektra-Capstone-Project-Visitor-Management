using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Visitor_Backend.DTOs;
using Visitor_Backend.Services;

namespace Visitor_Backend.Controllers;

[Route("api/[controller]")] //All apis in this class strat with /api/auth
[ApiController] //api class


public class AuthController(AuthService authService) : ControllerBase //this controller needs AuthService
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto) //Take data from request body and convert into object
    {
        var result = await authService.Login(dto);
        return result.Success ? Ok(result.Data) : Unauthorized(new { message = result.Message });
    }




    [HttpGet("me")]
    [Authorize]
    public IActionResult GetMe() => Ok(new { 
        UserId = User.FindFirstValue(ClaimTypes.NameIdentifier), 
        Email = User.FindFirstValue(ClaimTypes.Email), 
        Role = User.FindFirstValue(ClaimTypes.Role) 
    });

    [HttpPost("change-password")]
    [Authorize(Roles = "Resident")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await authService.ChangePassword(userId, dto);
        return result.Success ? Ok(new { message = result.Data }) : BadRequest(new { message = result.Message });
    }
}
//Frontend URL decides HTTP/HTTPS ,Backend can force HTTPS using redirection, app.redirectToHttps()