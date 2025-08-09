namespace MindMess.Models
{
    public class TaskItem
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Notes { get; set; }
        public TaskStatus Status { get; set; } = TaskStatus.Todo;
        public int Position { get; set; } = 0;

        public Guid ProjectId { get; set; }
        public Project Project { get; set; } = null!;
    }

    public enum TaskStatus
    {
        Todo,
        InProgress,
        Done
    }

}
