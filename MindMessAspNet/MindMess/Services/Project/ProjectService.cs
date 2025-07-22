using MindMess.Models;
using MindMess.Repositories.Project;
using static MindMess.DTOs.Project.ProjectDto;
using TaskStatus = MindMess.Models.TaskStatus;

namespace MindMess.Services.Project
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepo _repo;
        public ProjectService(IProjectRepo repo) => _repo = repo;

        public async Task<List<ProjectResponseDto>> GetAll(Guid userId)
        {
            var list = await _repo.GetAllByUserAsync(userId);
            return list.Select(p => new ProjectResponseDto(
                p.Id, p.Title, p.Description, p.StartDate, p.EndDate, p.CreatedAt,
                CalcProgress(p)
            )).ToList();
        }

        public async Task<ProjectResponseDto?> Get(Guid id, Guid userId)
        {
            var p = await _repo.GetByIdAsync(id, userId);
            if (p == null) return null;
            return new ProjectResponseDto(p.Id, p.Title, p.Description, p.StartDate, p.EndDate, p.CreatedAt, CalcProgress(p));
        }

        public async Task<ProjectResponseDto> Create(Guid userId, CreateProjectDto dto)
        {
            var p = new Models.Project
            {
                Title = dto.Title,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                UserId = userId
            };
            await _repo.AddAsync(p);
            await _repo.SaveAsync();
            return new ProjectResponseDto(p.Id, p.Title, p.Description, p.StartDate, p.EndDate, p.CreatedAt, 0f);
        }

        public async Task<bool> Update(Guid id, Guid userId, UpdateProjectDto dto)
        {
            var p = await _repo.GetByIdAsync(id, userId);
            if (p == null) return false;

            p.Title = dto.Title;
            p.Description = dto.Description;
            p.StartDate = dto.StartDate;
            p.EndDate = dto.EndDate;
            await _repo.UpdateAsync(p);
            await _repo.SaveAsync();
            return true;
        }

        public async Task<bool> Delete(Guid id, Guid userId)
        {
            var p = await _repo.GetByIdAsync(id, userId);
            if (p == null) return false;

            await _repo.DeleteAsync(p);
            await _repo.SaveAsync();
            return true;
        }

        private float CalcProgress(Models.Project p)
        {
            if (p.Tasks == null || p.Tasks.Count == 0) return 0;
            var done = p.Tasks.Count(t => t.Status == TaskStatus.Done);
            return (float)done / p.Tasks.Count * 100f;
        }
    }

}
