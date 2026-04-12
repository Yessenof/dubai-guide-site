/**
 * Generate a bcrypt hash for a password.
 * Usage:  npx tsx scripts/generate-hash.ts yourpassword
 * Copy the output into ADMIN_PASSWORD_HASH in .env.local
 */
import bcryptjs from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Usage: npx tsx scripts/generate-hash.ts <password>");
  process.exit(1);
}

bcryptjs.hash(password, 10).then((hash) => console.log(hash));
