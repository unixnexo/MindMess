namespace MindMess.Models
{
    public class Project
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public List<TaskItem> Tasks { get; set; } = new();
        public Drawing? Drawing { get; set; }
    }
}
