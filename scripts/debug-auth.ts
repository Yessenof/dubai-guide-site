/**
 * Debug script: tests bcryptjs.compare() against ADMIN_PASSWORD_HASH.
 * Reads the hash directly from .env.local (bypasses dotenv-expand corruption).
 * Prints only: true or false
 *
 * Usage: npx tsx scripts/debug-auth.ts <plaintext-password>
 */
import bcryptjs from "bcryptjs";
import { readFileSync } from "fs";
import { join } from "path";

const password = process.argv[2];
if (!password) {
  console.error("Usage: npx tsx scripts/debug-auth.ts <password>");
  process.exit(1);
}

// Read .env.local raw — no dotenv-expand interference
const envContent = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
const hashLine = envContent.split("\n").find((l) => l.startsWith("ADMIN_PASSWORD_HASH="));
if (!hashLine) {
  console.error("ADMIN_PASSWORD_HASH not found in .env.local");
  process.exit(1);
}

// Strip key, strip surrounding quotes, unescape \$ → $ (dotenv-expand escaping)
const rawHash = hashLine
  .slice("ADMIN_PASSWORD_HASH=".length)
  .replace(/^["']|["']$/g, "")
  .replace(/\\\$/g, "$")
  .trim();

bcryptjs.compare(password, rawHash).then((result) => console.log(result));
