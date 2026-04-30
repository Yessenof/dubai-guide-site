// Targeted patch: fix 2 D-class EN em-dashes in time_est fields.
// These are EN content bugs visible on both EN and RU pages.
// Replaces em-dash (—) with colon (:) in exactly these 2 rows.

import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "data", "guides.db"));

const PATCHES: Array<{ slug: string; stepOrder: number; oldValue: string; newValue: string }> = [
  {
    slug: "mainland-company-setup-dubai",
    stepOrder: 6,
    oldValue: "Varies — 4–10+ weeks if required",
    newValue: "Varies: 4–10+ weeks if required",
  },
  {
    slug: "free-zone-company-setup-dubai",
    stepOrder: 8,
    oldValue: "Varies — bank account may take 2–6 weeks",
    newValue: "Varies: bank account may take 2–6 weeks",
  },
];

db.transaction(() => {
  for (const p of PATCHES) {
    const guideRow = db
      .prepare("SELECT id FROM guides WHERE slug = ?")
      .get(p.slug) as { id: string } | undefined;

    if (!guideRow) {
      console.error(`Guide not found: ${p.slug}`);
      process.exit(1);
    }

    const current = db
      .prepare("SELECT time_est FROM steps WHERE guide_id = ? AND step_order = ?")
      .get(guideRow.id, p.stepOrder) as { time_est: string } | undefined;

    if (!current) {
      console.error(`Step not found: ${p.slug} step ${p.stepOrder}`);
      process.exit(1);
    }

    if (current.time_est !== p.oldValue) {
      console.error(
        `Unexpected value for ${p.slug} step ${p.stepOrder}:\n  got:      ${JSON.stringify(current.time_est)}\n  expected: ${JSON.stringify(p.oldValue)}`
      );
      process.exit(1);
    }

    const result = db
      .prepare("UPDATE steps SET time_est = ? WHERE guide_id = ? AND step_order = ?")
      .run(p.newValue, guideRow.id, p.stepOrder);

    if (result.changes !== 1) {
      console.error(`Update failed for ${p.slug} step ${p.stepOrder}`);
      process.exit(1);
    }

    console.log(`Patched: ${p.slug} step ${p.stepOrder}`);
    console.log(`  ${JSON.stringify(p.oldValue)}`);
    console.log(`  → ${JSON.stringify(p.newValue)}`);
  }
})();

// Verification
console.log("\n--- Verification ---");
for (const p of PATCHES) {
  const guideRow = db
    .prepare("SELECT id FROM guides WHERE slug = ?")
    .get(p.slug) as { id: string };
  const row = db
    .prepare("SELECT time_est FROM steps WHERE guide_id = ? AND step_order = ?")
    .get(guideRow.id, p.stepOrder) as { time_est: string };

  const ok = !row.time_est.includes("—");
  console.log(`${ok ? "OK" : "FAIL"} ${p.slug} step ${p.stepOrder}: ${JSON.stringify(row.time_est)}`);
}
