namespace MONATE.Web.Server.Data.Packets.WorkflowInfo
{
    public class WorkflowData
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string EndpointId { get; set; }
        public string Image { get; set; }
        public string Workflow { get; set; }
        public string Version { get; set; }
        public string Price { get; set; }
        public string GPUUsage { get; set; }
        public string Description { get; set; }
        public string[] InputValuePaths { get; set; }
        public int[] InputValueTypeIds { get; set; }
        public string[] InputValueNames { get; set; }
    }
}
