import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "data", "guides.db"), { readonly: true });

const guides = db.prepare(`
  SELECT id, slug, en_title, en_summary, en_audience, en_overview, price, timeline
  FROM guides WHERE published = 1 ORDER BY slug
`).all() as any[];

for (const g of guides) {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`SLUG:     ${g.slug}`);
  console.log(`TITLE:    ${g.en_title}`);
  console.log(`PRICE:    ${g.price}  |  TIMELINE: ${g.timeline}`);
  console.log(`SUMMARY:  ${g.en_summary}`);
  console.log(`AUDIENCE: ${g.en_audience}`);
  console.log(`OVERVIEW:\n${g.en_overview}`);

  const stepsRows = db.prepare(`
    SELECT step_order, en_title, en_what, en_where, en_address, cost, time_est, en_advice, en_warning
    FROM steps WHERE guide_id = ? ORDER BY step_order
  `).all(g.id) as any[];

  for (const s of stepsRows) {
    console.log(`\n  STEP ${s.step_order}: ${s.en_title}`);
    console.log(`    WHAT:    ${s.en_what}`);
    console.log(`    WHERE:   ${s.en_where}`);
    console.log(`    ADDRESS: ${s.en_address}`);
    console.log(`    COST:    ${s.cost}  |  TIME: ${s.time_est}`);
    if (s.en_advice)  console.log(`    ADVICE:  ${s.en_advice}`);
    if (s.en_warning) console.log(`    WARNING: ${s.en_warning}`);
  }
}

db.close();
