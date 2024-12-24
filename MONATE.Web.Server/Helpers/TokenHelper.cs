namespace MONATE.Web.Server.Helpers
{
    using Sodium;

    public class TokenHelper
    {
        public static string GeneralToken
        {
            get => Convert.ToHexString(SodiumCore.GetRandomBytes(32));
        }

        public static string ApiToken(string email)
        {
            var cryptor = new CryptionHelper();
            var token = cryptor.Encrypt(email + " " + Guid.NewGuid().ToString());
            return token;
        }
    }
}
