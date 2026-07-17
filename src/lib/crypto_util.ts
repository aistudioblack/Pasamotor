import crypto from "crypto";

export function encrypt(text: string): string {
  if (!text) return text;
  // Use a secret or fallback
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || "default_secret_key_needs_replacement";
  const key = crypto.createHash("sha256").update(secret).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
  if (!text) return text;
  // If it doesn't look like our encrypted format (no colon or wrong lengths), return as is (for backwards compatibility)
  if (!text.includes(":")) return text;
  
  const textParts = text.split(":");
  if (textParts.length !== 2) return text;
  
  try {
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || "default_secret_key_needs_replacement";
    const key = crypto.createHash("sha256").update(secret).digest();
    const iv = Buffer.from(textParts[0], "hex");
    const encryptedText = Buffer.from(textParts[1], "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    // If decryption fails, it might be a plain text that happens to have a colon
    return text;
  }
}
