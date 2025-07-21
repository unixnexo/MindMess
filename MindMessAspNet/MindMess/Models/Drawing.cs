namespace MindMess.Models
{
    public class Drawing
    {
        public Guid Id { get; set; }
        public string CanvasData { get; set; } = null!; // base64 string or json, up to frontend

        public Guid ProjectId { get; set; }
        public Project Project { get; set; } = null!;
    }
}
