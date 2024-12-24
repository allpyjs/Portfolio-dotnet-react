namespace MONATE.Web.Server.Logics
{
    using MONATE.Web.Server.Helpers;

    public enum WorkingStatus: int
    {
        Uploading = 0,
        Prompting = 1,
        Working = 2,
        Downloading = 3,
        Error = 4,
        None = 5,
    }

    public static class Globals
    {
        public static object globalLock = new object();

        private static readonly CryptionHelper _cryptor = new CryptionHelper();
        private static readonly Dictionary<string, WorkingStatus> _runningWorkflowStatus = new Dictionary<string, WorkingStatus>();
        private static readonly Dictionary<string, string> _promptIds = new Dictionary<string, string>();

        public static CryptionHelper Cryptor
        {
            get => _cryptor;
        }

        public static Dictionary<string, WorkingStatus> RunningWorkflowStatus
        {
            get => _runningWorkflowStatus;
        }

        public static Dictionary<string, string> PromptIds
        {
            get => _promptIds;
        }
    }
}
