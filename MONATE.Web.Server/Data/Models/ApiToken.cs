namespace MONATE.Web.Server.Data.Models
{
    public class ApiToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; }

        public User User { get; set; }
    }
}
