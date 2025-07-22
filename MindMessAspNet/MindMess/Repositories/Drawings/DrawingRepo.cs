using Microsoft.EntityFrameworkCore;
using MindMess.Data;
using MindMess.Models;

namespace MindMess.Repositories.Drawings
{
    public class DrawingRepo : IDrawingRepo
    {
        private readonly AppDbContext _db;
        public DrawingRepo(AppDbContext db) => _db = db;

        public async Task<Drawing?> GetByProjectIdAsync(Guid projectId, Guid userId) =>
            await _db.Drawings
                .Include(d => d.Project)
                .FirstOrDefaultAsync(d => d.ProjectId == projectId && d.Project.UserId == userId);

        public async Task AddOrUpdateAsync(Drawing drawing)
        {
            var existing = await _db.Drawings.FirstOrDefaultAsync(d => d.ProjectId == drawing.ProjectId);
            if (existing == null)
                await _db.Drawings.AddAsync(drawing);
            else
                existing.CanvasData = drawing.CanvasData;
        }

        public Task SaveAsync() => _db.SaveChangesAsync();
    }

}
