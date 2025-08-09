using MindMess.Models;

namespace MindMess.Repositories.Tasks
{
    public interface ITaskRepo
    {
        Task<List<TaskItem>> GetAllByProjectAsync(Guid projectId, Guid userId);
        Task<TaskItem?> GetByIdAsync(Guid id, Guid userId);
        Task<int> GetMaxPositionAsync(Guid projectId, Guid userId);
        Task AddAsync(TaskItem task);
        Task DeleteAsync(TaskItem task);
        Task SaveAsync();
    }

}
