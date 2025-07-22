using MindMess.DTOs.Drawing;

namespace MindMess.Services.Drawings
{
    public interface IDrawingService
    {
        Task<DrawingDto?> GetByProject(Guid projectId, Guid userId);
        Task<bool> Save(Guid projectId, Guid userId, DrawingDto dto);
    }

}
