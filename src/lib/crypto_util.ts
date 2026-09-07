import crypto from "crypto";

export function encrypt(text: string): string {
  if (!text) return text;
  // Use a dedicated encryption secret, fallback to service role key ONLY if not provided
  const secret = process.env.ENCRYPTION_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!secret) return text; // If no keys are provided, do not encrypt
  const key = crypto.createHash("sha256").update(secret).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
  if (!text) return text;
  if (!text.includes(":")) return text;
  
  const textParts = text.split(":");
  if (textParts.length !== 2) return text;
  
  const secretsToTry = [];
  if (process.env.ENCRYPTION_SECRET_KEY) secretsToTry.push(process.env.ENCRYPTION_SECRET_KEY);
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) secretsToTry.push(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (process.env.VITE_SUPABASE_ANON_KEY) secretsToTry.push(process.env.VITE_SUPABASE_ANON_KEY);
  // Remove hardcoded key push
  
  const iv = Buffer.from(textParts[0], "hex");
  const encryptedText = Buffer.from(textParts[1], "hex");

  for (const secret of secretsToTry) {
    try {
      const key = crypto.createHash("sha256").update(secret).digest();
      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (e) {
      // Ignore and try the next secret
    }
  }

  return text; // Return original text if all decryptions fail
}
