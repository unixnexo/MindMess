using MindMess.Models;

namespace MindMess.Repositories.Drawings
{
    public interface IDrawingRepo
    {
        Task<Drawing?> GetByProjectIdAsync(Guid projectId, Guid userId);
        Task AddOrUpdateAsync(Drawing drawing);
        Task SaveAsync();
    }

}
