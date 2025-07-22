using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MindMess.Models;
using MindMess.Services.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using static MindMess.DTOs.Task.TaskDto;

namespace MindMess.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _service;
        public TasksController(ITaskService service) => _service = service;

        private Guid GetUserId()
        {
            var id = User.FindFirstValue(JwtRegisteredClaimNames.Jti);
            return Guid.TryParse(id, out var guid) ? guid : throw new Exception("Invalid token");
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetAll(Guid projectId) =>
            Ok(await _service.GetAll(projectId, GetUserId()));

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var task = await _service.Get(id, GetUserId());
            return task == null ? NotFound() : Ok(task);
        }

        [HttpPost("project/{projectId}")]
        public async Task<IActionResult> Create(Guid projectId, [FromBody] CreateTaskDto dto) =>
            Ok(await _service.Create(projectId, GetUserId(), dto));

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTaskDto dto) =>
            await _service.Update(id, GetUserId(), dto) ? NoContent() : NotFound();

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id) =>
            await _service.Delete(id, GetUserId()) ? NoContent() : NotFound();
    }

}
