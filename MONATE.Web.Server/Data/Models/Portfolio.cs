namespace MONATE.Web.Server.Data.Models
{
    public class Portfolio
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public string ImagePath { get; set; }

        public ICollection<Category> Categories { get; set; }
    }
}
