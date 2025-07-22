namespace MindMess.DTOs.Project
{
    public class ProjectDto
    {
        public record CreateProjectDto(string Title, string Description, DateTime StartDate, DateTime? EndDate);
        public record UpdateProjectDto(string Title, string Description, DateTime StartDate, DateTime? EndDate);
        public record ProjectResponseDto(Guid Id, string Title, string Description, DateTime StartDate, DateTime? EndDate, DateTime CreatedAt, float Progress);

    }
}
