namespace MONATE.Web.Server.Data.Models
{

    public class ValueType
    {
        public int Id { get; set; }
        public VType Type { get; set; }
        public string? Description { get; set; }
        public Permition Permition { get; set; }

        public ICollection<InputValue> InputValues { get; set; }
        public ICollection<OutputValue> OutputValues { get; set; }
    }
}
