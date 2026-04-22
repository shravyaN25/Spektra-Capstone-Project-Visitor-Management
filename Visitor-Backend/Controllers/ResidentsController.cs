using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Visitor_Backend.DTOs;
using Visitor_Backend.Services;

namespace Visitor_Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ResidentsController(ResidentService residentService) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetResidents() => Ok((await residentService.GetAllResidents()).Data);

    [HttpGet("{id}")]
    public async Task<IActionResult> GetResident(int id)
    {
        var res = await residentService.GetResidentById(id, GetUserId(), GetUserRole());
        return res.Success ? Ok(res.Data) : HandleError(res.Message);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateResident([FromBody] ResidentCreateDto dto)
    {
        var res = await residentService.CreateResident(dto);
        return res.Success ? CreatedAtAction(nameof(GetResident), new { id = res.Data?.Id }, res.Data) : BadRequest(new { message = res.Message });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateResident(int id, [FromBody] ResidentUpdateDto dto)
    {
        var res = await residentService.UpdateResident(id, dto, GetUserId(), GetUserRole());
        return res.Success ? Ok(new { message = res.Data }) : HandleError(res.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteResident(int id)
    {
        var res = await residentService.DeleteResident(id);
        return res.Success ? Ok(new { message = res.Data }) : NotFound(new { message = res.Message });
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private string GetUserRole() => User.FindFirstValue(ClaimTypes.Role)!;
    private IActionResult HandleError(string msg) => msg.Contains("authorized") ? Forbid() : NotFound(new { message = msg });
}
