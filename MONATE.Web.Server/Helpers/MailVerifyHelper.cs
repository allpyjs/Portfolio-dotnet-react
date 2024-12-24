namespace MONATE.Web.Server.Helpers
{
    using MailKit.Net.Smtp;
    using MailKit;
    using MimeKit;

    public static class VerifyEmailHelper
    {
        private static readonly Dictionary<string, string> verifyCodeDict = new Dictionary<string, string>();
        private static readonly Dictionary<string, int> verifyTrialCountDict = new Dictionary<string, int>();
        private static readonly Dictionary<string, DateTime> verifyLastTrialDict = new Dictionary<string, DateTime>();
        private static object lockVerifyCodeDict = new object();

        public static bool SendVerificationCode(string email)
        {
            string code = GenerateRandom6DigitString();
            string subject = "Your Verification Code";
            string body = $"Welcome to MONATE website!!!\n\nYour verification code is: **{code}**.\n\nPlease enter this code to verify your account.\n\nThank you!";
            string myEmail = Environment.GetEnvironmentVariable("EMAIL_ADDRESS") ?? string.Empty;
            string myEmailPassword = Environment.GetEnvironmentVariable("EMAIL_PASSWORD") ?? string.Empty;
            string mySmtpHost = Environment.GetEnvironmentVariable("SMTP_HOST") ?? string.Empty;
            int mySmtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? string.Empty);

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("MONATE", myEmail));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = subject;

            message.Body = new TextPart("plain")
            {
                Text = body,
            };

            lock (lockVerifyCodeDict)
            {
                VerifyTrialCounts(email);

                verifyCodeDict[email] = code;
            }

            using (var client = new SmtpClient(new ProtocolLogger("smtp.log")))
            {
                try
                {
                    client.Connect(mySmtpHost, mySmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                    client.Authenticate(myEmail, myEmailPassword);
                    client.Send(message);

                    return true;
                }
                catch
                {
                    return false;
                }
                finally
                {
                    client.Disconnect(true);
                }
            }
        }

        public static bool VerifyEmail(string email, string code)
        {
            lock (lockVerifyCodeDict)
            {
                VerifyTrialCounts(email);

                if (!verifyCodeDict.ContainsKey(email)) { return false; }
                if (verifyCodeDict[email] != code) { return false; }

                verifyCodeDict.Remove(email);
                verifyLastTrialDict.Remove(email);
                verifyTrialCountDict.Remove(email);
            }

            return true;
        }

        private static void VerifyTrialCounts(string email)
        {
            verifyTrialCountDict[email] =
                (!verifyTrialCountDict.ContainsKey(email)
                || (DateTime.UtcNow - verifyLastTrialDict[email]) > new TimeSpan(24, 0, 0))
                ? 0 : (verifyTrialCountDict[email] + 1);
            verifyLastTrialDict[email] = DateTime.UtcNow;
            if (verifyTrialCountDict[email] > 5)
                throw new Exception("The trial has been exceed. Try after 24 hours.");
        }

        private static string GenerateRandom6DigitString()
        {
            Random random = new Random();
            int number = random.Next(100000, 1000000);
            return number.ToString();
        }
    }
}
