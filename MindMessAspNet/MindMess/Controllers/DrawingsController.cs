using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMess.DTOs.Drawing;
using MindMess.Services.Drawings;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MindMess.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/projects/{projectId}/drawing")]
    public class DrawingController : ControllerBase
    {
        private readonly IDrawingService _service;
        public DrawingController(IDrawingService service) => _service = service;

        private Guid GetUserId()
        {
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(id, out var guid) ? guid : throw new Exception("Invalid token");
        }

        [HttpGet]
        public async Task<IActionResult> Get(Guid projectId)
        {
            var result = await _service.GetByProject(projectId, GetUserId());
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost, HttpPut]
        public async Task<IActionResult> Save(Guid projectId, [FromBody] DrawingDto dto)
        {
            var userId = GetUserId();
            var success = await _service.Save(projectId, userId, dto);
            return success ? Ok(new { success = true }) : BadRequest(new { error = "Project not found." });
        }
    }

}
