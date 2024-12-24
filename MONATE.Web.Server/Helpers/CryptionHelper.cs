namespace MONATE.Web.Server.Helpers
{
    using System;
    using System.Text;
    using Sodium;

    public class CryptionHelper
    {
        public readonly byte[] key;

        public CryptionHelper()
        {
            var password = Environment.GetEnvironmentVariable("PASSWORD");
            if (string.IsNullOrEmpty(password))
                this.key = SodiumCore.GetRandomBytes(32);
            else
                this.key = Convert.FromHexString(password);
        }

        public CryptionHelper(string passwordHex)
        {
            // Convert hex string to byte array
            this.key = Convert.FromHexString(passwordHex);
        }

        public string Encrypt(string plaintext)
        {
            // Generate random nonce (IV) and associated data
            byte[] nonce = SodiumCore.GetRandomBytes(12); // 12 bytes
            byte[] associatedData = SodiumCore.GetRandomBytes(16); // 16 bytes

            // Encrypt the plaintext
            byte[] cipherText = SecretAeadChaCha20Poly1305IETF.Encrypt(
                Encoding.UTF8.GetBytes(plaintext),
                nonce,
                key,
                associatedData
            );

            // Convert components to hex for easy transport
            string nonceHex = Convert.ToHexString(nonce).ToLower();
            string associatedDataHex = Convert.ToHexString(associatedData).ToLower();
            string cipherTextHex = Convert.ToHexString(cipherText).ToLower();

            return nonceHex + associatedDataHex + cipherTextHex;
        }

        public string Decrypt(string cipherTextHex)
        {
            // Extract the nonce, associated data, and cipher text from the hex string
            byte[] nonce = Convert.FromHexString(cipherTextHex[0..24]); // First 12 bytes
            byte[] associatedData = Convert.FromHexString(cipherTextHex[24..56]); // Next 16 bytes
            byte[] encryptedData = Convert.FromHexString(cipherTextHex[56..]); // Remaining bytes

            // Decrypt the cipher text
            byte[] decrypted = SecretAeadChaCha20Poly1305IETF.Decrypt(
                encryptedData,
                nonce,
                key,
                associatedData
            );

            return Encoding.UTF8.GetString(decrypted);
        }
    }
}