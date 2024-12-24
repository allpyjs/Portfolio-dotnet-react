namespace MONATE.Web.Server.Data.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }

        public ICollection<User> Users { get; set; }
        public ICollection<Endpoint> Endpoints { get; set; }
        public ICollection<Portfolio> Portfolios { get; set; }
    }
}
