namespace MONATE.Web.Server.Data.Models
{
    public enum MemberType : int
    {
        Administrator = 0,
        User = 1,
        Guest = 2,
    }

    public enum UserType : int
    {
        Administrator = 0,
        Client = 1,
        TeamMember = 2,
    }

    public enum Permition : int
    {
        Pending = 0,
        Approved = 1,
        Suspended = 2,
    }
    
    public enum VType : int
    {
        INT = 0,
        FLOAT = 1,
        STRING = 2,
        IMAGE = 3,
        MULTILINE_STRING = 4,
        VIDEO = 5,
    }
}
