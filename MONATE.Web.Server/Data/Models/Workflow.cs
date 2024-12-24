namespace MONATE.Web.Server.Data.Models
{
    public class Workflow
    {
        public int Id { get; set; }
        public int EndpointId { get; set; }
        public string Version { get; set; }
        public double Price { get; set; }
        public double GPURequirement { get; set; }
        public string? Description { get; set; }
        public string? ImagePath { get; set; }
        public string WorkflowPath { get; set; }
        public Permition Permition { get; set; }

        public Endpoint Endpoint { get; set; }
        public ICollection<InputValue> Inputs { get; set; }
        public ICollection<OutputValue> Outputs { get; set; }
    }
}
