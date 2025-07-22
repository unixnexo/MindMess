using MindMess.DTOs.Drawing;
using MindMess.Models;
using MindMess.Repositories.Drawings;
using MindMess.Repositories.Project;

namespace MindMess.Services.Drawings
{
    public class DrawingService : IDrawingService
    {
        private readonly IDrawingRepo _drawingRepo;
        private readonly IProjectRepo _projectRepo;

        public DrawingService(IDrawingRepo drawingRepo, IProjectRepo projectRepo)
        {
            _drawingRepo = drawingRepo;
            _projectRepo = projectRepo;
        }

        public async Task<DrawingDto?> GetByProject(Guid projectId, Guid userId)
        {
            var drawing = await _drawingRepo.GetByProjectIdAsync(projectId, userId);
            return drawing == null ? null : new DrawingDto(drawing.CanvasData);
        }

        public async Task<bool> Save(Guid projectId, Guid userId, DrawingDto dto)
        {
            var project = await _projectRepo.GetByIdAsync(projectId, userId);
            if (project == null) return false;

            var drawing = new Drawing
            {
                ProjectId = projectId,
                CanvasData = dto.CanvasData
            };

            await _drawingRepo.AddOrUpdateAsync(drawing);
            await _drawingRepo.SaveAsync();
            return true;
        }
    }

}
