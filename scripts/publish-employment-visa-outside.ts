import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "data", "guides.db"));
db.pragma("journal_mode = WAL");

const result = db
  .prepare("UPDATE guides SET published = 1, updated_at = ? WHERE slug = ?")
  .run(new Date().toISOString(), "employment-visa-dubai-outside-uae");

console.log("rows updated:", result.changes);
db.close();
