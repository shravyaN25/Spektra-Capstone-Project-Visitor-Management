using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Visitor_Backend.DTOs;
using Visitor_Backend.Models;
using Visitor_Backend.Services;

namespace Visitor_Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VisitorsController(VisitorService visitorService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> AddVisitor(VisitorCreateDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (User.FindFirstValue(ClaimTypes.Role) == "Resident" && userId != dto.ResidentId)
            return StatusCode(403, ServiceResponse<string>.FailureResponse("Unauthorized access."));

        var res = await visitorService.AddVisitorAsync(dto);
        return res.Success ? Ok(res) : BadRequest(res);
    }

    [HttpGet("pending")]
    [Authorize(Roles = "Security,Admin")]
    public async Task<IActionResult> GetPendingVisitors() => Ok(await visitorService.GetPendingVisitorsAsync());

    [HttpGet("my-visitors")]
    [Authorize(Roles = "Resident")]
    public async Task<IActionResult> GetMyVisitors() => 
        Ok(await visitorService.GetVisitorsByResidentIdAsync(int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)));

    [HttpGet]
    [Authorize(Roles = "Security,Admin")]
    public async Task<IActionResult> GetAllVisitors() => Ok(await visitorService.GetAllVisitorsAsync());

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Security,Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] VisitorUpdateStatusDto dto)
    {
        var res = await visitorService.UpdateVisitorStatusAsync(id, dto.Status);
        return res.Success ? Ok(res) : BadRequest(res);
    }

    [HttpPost("{id}/verify-otp")]
    [Authorize(Roles = "Security,Admin")]
    public async Task<IActionResult> VerifyOtp(int id, [FromBody] VerifyOtpDto dto)
    {
        var res = await visitorService.VerifyOtpAsync(id, dto.Otp);
        return res.Success ? Ok(res) : BadRequest(res);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteVisitor(int id)
    {
        var res = await visitorService.DeleteVisitorAsync(id);
        return res.Success ? Ok(res) : BadRequest(res);
    }
}
