using static MindMess.DTOs.Task.TaskDto;

namespace MindMess.Services.Tasks
{
    public interface ITaskService
    {
        Task<List<TaskResponseDto>> GetAll(Guid projectId, Guid userId);
        Task<TaskResponseDto?> Get(Guid id, Guid userId);
        Task<TaskResponseDto> Create(Guid projectId, Guid userId, CreateTaskDto dto);
        Task<bool> Update(Guid id, Guid userId, UpdateTaskDto dto);
        Task<bool> Delete(Guid id, Guid userId);
    }

}
