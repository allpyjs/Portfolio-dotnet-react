namespace MONATE.Web.Server.Data.Models
{
    public class UserProfile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? AvatarPath { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? VideoPath { get; set; }
        public string? PhoneNumber { get; set; }
        public string? GithubUrl { get; set; }
        public double Credit { get; set; }

        public User User { get; set; }
    }
}
