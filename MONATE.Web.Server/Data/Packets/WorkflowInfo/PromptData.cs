namespace MONATE.Web.Server.Data.Packets.WorkflowInfo
{
    public class PromptData
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string ServerUrl { get; set; }
        public string ClientId { get; set; }
        public string WorkflowData { get; set; }
        public WorkflowInputData[] InputValues { get; set; }
    }
}
