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
            var id = User.FindFirstValue(JwtRegisteredClaimNames.Jti);
            return Guid.TryParse(id, out var guid) ? guid : throw new Exception("Invalid token");
        }

        [HttpGet]
        public async Task<IActionResult> Get(Guid projectId)
        {
            var result = await _service.GetByProject(projectId, GetUserId());
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Save(Guid projectId, [FromBody] DrawingDto dto)
        {
            var ok = await _service.Save(projectId, GetUserId(), dto);
            return ok ? NoContent() : NotFound();
        }
    }

}
