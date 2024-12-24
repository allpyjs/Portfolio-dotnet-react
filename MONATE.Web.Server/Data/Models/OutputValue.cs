namespace MONATE.Web.Server.Data.Models
{
    public class OutputValue
    {
        public int Id { get; set; }
        public int TypeId { get; set; }
        public int WorkflowId { get; set; }
        public string Path { get; set; }

        public ValueType Type { get; set; }
        public Workflow Workflow { get; set; }
    }
}
