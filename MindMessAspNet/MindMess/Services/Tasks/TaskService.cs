using MindMess.Models;
using MindMess.Repositories.Project;
using MindMess.Repositories.Tasks;
using static MindMess.DTOs.Task.TaskDto;

namespace MindMess.Services.Tasks
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepo _repo;
        private readonly IProjectRepo _projectRepo;

        public TaskService(ITaskRepo repo, IProjectRepo projectRepo)
        {
            _repo = repo;
            _projectRepo = projectRepo;
        }

        public async Task<List<TaskResponseDto>> GetAll(Guid projectId, Guid userId)
        {
            var tasks = await _repo.GetAllByProjectAsync(projectId, userId);
            return tasks.Select(t => new TaskResponseDto(t.Id, t.Title, t.Notes, t.Status, t.ProjectId)).ToList();
        }

        public async Task<TaskResponseDto?> Get(Guid id, Guid userId)
        {
            var t = await _repo.GetByIdAsync(id, userId);
            if (t == null) return null;
            return new TaskResponseDto(t.Id, t.Title, t.Notes, t.Status, t.ProjectId);
        }

        public async Task<TaskResponseDto> Create(Guid projectId, Guid userId, CreateTaskDto dto)
        {
            var p = await _projectRepo.GetByIdAsync(projectId, userId);
            if (p == null) throw new Exception("Not your project.");

            var task = new TaskItem
            {
                Title = dto.Title,
                Notes = dto.Notes,
                ProjectId = projectId
            };
            await _repo.AddAsync(task);
            await _repo.SaveAsync();
            return new TaskResponseDto(task.Id, task.Title, task.Notes, task.Status, task.ProjectId);
        }

        public async Task<bool> Update(Guid id, Guid userId, UpdateTaskDto dto)
        {
            var t = await _repo.GetByIdAsync(id, userId);
            if (t == null) return false;

            t.Title = dto.Title;
            t.Notes = dto.Notes;
            t.Status = dto.Status;
            await _repo.SaveAsync();
            return true;
        }

        public async Task<bool> Delete(Guid id, Guid userId)
        {
            var t = await _repo.GetByIdAsync(id, userId);
            if (t == null) return false;
            await _repo.DeleteAsync(t);
            await _repo.SaveAsync();
            return true;
        }
    }

}
