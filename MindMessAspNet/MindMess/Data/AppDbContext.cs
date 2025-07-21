using Microsoft.EntityFrameworkCore;
using MindMess.Models;

namespace MindMess.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<Project> Projects => Set<Project>();
        public DbSet<TaskItem> Tasks => Set<TaskItem>();
        public DbSet<Drawing> Drawings => Set<Drawing>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
