namespace MindMess.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = null!;
        public string? MagicLinkToken { get; set; }
        public DateTime? TokenExpiration { get; set; }

        public List<Project> Projects { get; set; } = new();
    }
}
