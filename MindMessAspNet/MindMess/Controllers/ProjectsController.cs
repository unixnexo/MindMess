using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMess.Models;
using MindMess.Services.Project;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using static MindMess.DTOs.Project.ProjectDto;

namespace MindMess.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/projects")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _service;

        public ProjectsController(IProjectService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = GetUserId();
            return Ok(await _service.GetAll(userId));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var userId = GetUserId();
            var result = await _service.Get(id, userId);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
        {
            var userId = GetUserId();
            var project = await _service.Create(userId, dto);
            return CreatedAtAction(nameof(Get), new { id = project.Id }, project);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProjectDto dto)
        {
            var userId = GetUserId();
            return await _service.Update(id, userId, dto) ? NoContent() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = GetUserId();
            return await _service.Delete(id, userId) ? NoContent() : NotFound();
        }

        private Guid GetUserId()
        {
            var id = User.FindFirstValue(JwtRegisteredClaimNames.Jti);
            return Guid.TryParse(id, out var guid) ? guid : throw new Exception("Invalid token");
        }
    }
}

