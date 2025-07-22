using Microsoft.EntityFrameworkCore;
using MindMess.Data;
using MindMess.Models;

namespace MindMess.Repositories.Tasks
{
    public class TaskRepo : ITaskRepo
    {
        private readonly AppDbContext _db;
        public TaskRepo(AppDbContext db) => _db = db;

        public Task<List<TaskItem>> GetAllByProjectAsync(Guid projectId, Guid userId) =>
            _db.Tasks
                .Where(t => t.ProjectId == projectId && t.Project.UserId == userId)
                .ToListAsync();

        public Task<TaskItem?> GetByIdAsync(Guid id, Guid userId) =>
            _db.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id && t.Project.UserId == userId);

        public Task AddAsync(TaskItem task) => _db.Tasks.AddAsync(task).AsTask();
        public Task DeleteAsync(TaskItem task) { _db.Tasks.Remove(task); return Task.CompletedTask; }
        public Task SaveAsync() => _db.SaveChangesAsync();
    }

}
