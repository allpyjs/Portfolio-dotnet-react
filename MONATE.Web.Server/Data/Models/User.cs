namespace MONATE.Web.Server.Data.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }
        public UserType UserType { get; set; }
        public DateTime ExpireDate { get; set; }
        public Permition Permition { get; set; }

        public UserProfile Profile { get; set; }
        public UserLocation Location { get; set; }
        public ICollection<Member> Members { get; set; } 
        public ICollection<ApiToken> ApiTokens { get; set; }
        public ICollection<Category> Categories { get; set; }
        public ICollection<Endpoint> Endpoints { get; set; }
    }
}
