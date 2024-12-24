namespace MONATE.Web.Server.Data.Models
{
    public class Member
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int OwnerId { get; set; }
        public MemberType MemberType { get; set; }

        public User User { get; set; }
        public User Owner { get; set; }
    }
}
