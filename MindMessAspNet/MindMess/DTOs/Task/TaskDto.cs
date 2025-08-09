namespace MindMess.DTOs.Task
{
    public class TaskDto
    {
        public record CreateTaskDto(string Title, string? Notes);
        public record UpdateTaskDto(string Title, string? Notes, MindMess.Models.TaskStatus Status, int? Position);

        public record TaskResponseDto(
            Guid Id,
            string Title,
            string? Notes,
            MindMess.Models.TaskStatus Status,
            int Position,
            Guid ProjectId
        );
    }
}
