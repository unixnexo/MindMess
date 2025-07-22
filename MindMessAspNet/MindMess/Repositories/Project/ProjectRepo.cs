using Microsoft.EntityFrameworkCore;
using MindMess.Data;

namespace MindMess.Repositories.Project
{
    public class ProjectRepo : IProjectRepo
    {
        private readonly AppDbContext _db;
        public ProjectRepo(AppDbContext db) => _db = db;

        public Task<Models.Project?> GetByIdAsync(Guid id, Guid userId) =>
            _db.Projects.Include(p => p.Tasks)
                        .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        public Task<List<Models.Project>> GetAllByUserAsync(Guid userId) =>
            _db.Projects.Include(p => p.Tasks)
                        .Where(p => p.UserId == userId)
                        .ToListAsync();

        public Task AddAsync(Models.Project project) => _db.Projects.AddAsync(project).AsTask();
        public Task UpdateAsync(Models.Project project) => Task.CompletedTask;
        public Task DeleteAsync(Models.Project project) { _db.Projects.Remove(project); return Task.CompletedTask; }
        public Task SaveAsync() => _db.SaveChangesAsync();
    }

}
