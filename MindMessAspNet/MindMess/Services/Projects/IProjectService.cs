using static MindMess.DTOs.Project.ProjectDto;

namespace MindMess.Services.Project
{
    public interface IProjectService
    {
        Task<List<ProjectResponseDto>> GetAll(Guid userId);
        Task<ProjectResponseDto?> Get(Guid id, Guid userId);
        Task<ProjectResponseDto> Create(Guid userId, CreateProjectDto dto);
        Task<bool> Update(Guid id, Guid userId, UpdateProjectDto dto);
        Task<bool> Delete(Guid id, Guid userId);
    }
}
