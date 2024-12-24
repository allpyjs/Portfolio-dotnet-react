namespace MONATE.Web.Server.Data.Packets.PortfolioInfo
{
    public class NewEndpointData
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public List<int> CategoryIds { get; set; }
    }
}
