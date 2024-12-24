namespace MONATE.Web.Server.Data.Models
{
    public class Endpoint
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? ImagePath { get; set; }
        public Permition Permition { get; set; }

        public User User { get; set; }
        public ICollection<Category> Categories { get; set; }
        public ICollection<Workflow> Workflows { get; set; }
    }
}
