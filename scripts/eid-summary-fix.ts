/**
 * Phase 6C-31 Task 2: Compress Eid Al Adha 2026 en_summary fields from 3 sentences to 2.
 * Updates news, event, and calendar records in local DB, then republishes each.
 * Run: npx tsx scripts/eid-summary-fix.ts
 */

import {
  updateNewsDraft,
  publishNews,
  updateEventDraft,
  publishEvent,
  updateCalendarDraft,
  publishCalendar,
} from "../lib/db/news-events-calendar-admin";

const NEWS_ID    = "5b1eecec-e64a-4cc9-9f67-c6cb2b55e1e4";
const EVENT_ID   = "8532feee-1d6f-4ed3-b716-61712b473ca3";
const CALENDAR_ID = "6ce82fda-d696-4040-b6c3-3d74c17347ea";

const NEWS_SUMMARY = "The UAE has confirmed Eid Al Adha 2026 begins on 27 May, with a federal government holiday from 25 to 29 May and work resuming on 1 June. MoHRE confirmed the private sector holiday from 26 to 29 May.";

const EVENT_SUMMARY = "Eid Al Adha 2026 begins in the UAE on 27 May, with a federal holiday from 25 to 29 May and private sector holiday from 26 to 29 May (MoHRE). This page covers confirmed dates, holiday scope, and planning notes for residents, businesses, and families.";

const CALENDAR_SUMMARY = "The UAE has confirmed Eid Al Adha 2026 begins on 27 May, with a federal holiday from 25 to 29 May and work resuming on 1 June. Confirmed dates and planning notes for residents, families, and businesses.";

function assertNoEmDash(label: string, value: string) {
  if (value.includes("—")) {
    console.error(`ABORT: em dash found in ${label}`);
    process.exit(1);
  }
}

// Pre-flight
assertNoEmDash("NEWS_SUMMARY", NEWS_SUMMARY);
assertNoEmDash("EVENT_SUMMARY", EVENT_SUMMARY);
assertNoEmDash("CALENDAR_SUMMARY", CALENDAR_SUMMARY);
console.log("Pre-flight passed: no em dashes.");

// --- News ---
console.log("\n=== Updating news summary ===");
const newsUpdate = updateNewsDraft(NEWS_ID, { en_summary: NEWS_SUMMARY });
if (!newsUpdate.ok) {
  console.error("updateNewsDraft failed:", newsUpdate.errors);
  process.exit(1);
}
if (newsUpdate.warnings.length) console.log("Warnings:", newsUpdate.warnings);
const newsPub = publishNews(NEWS_ID);
if (!newsPub.ok) {
  console.error("publishNews failed:", newsPub.errors);
  process.exit(1);
}
if (newsPub.warnings.length) console.log("Warnings:", newsPub.warnings);
console.log("News: summary updated and republished.");

// --- Event ---
console.log("\n=== Updating event summary ===");
const eventUpdate = updateEventDraft(EVENT_ID, { en_summary: EVENT_SUMMARY });
if (!eventUpdate.ok) {
  console.error("updateEventDraft failed:", eventUpdate.errors);
  process.exit(1);
}
if (eventUpdate.warnings.length) console.log("Warnings:", eventUpdate.warnings);
const eventPub = publishEvent(EVENT_ID);
if (!eventPub.ok) {
  console.error("publishEvent failed:", eventPub.errors);
  process.exit(1);
}
if (eventPub.warnings.length) console.log("Warnings:", eventPub.warnings);
console.log("Event: summary updated and republished.");

// --- Calendar ---
console.log("\n=== Updating calendar summary ===");
const calUpdate = updateCalendarDraft(CALENDAR_ID, { en_summary: CALENDAR_SUMMARY });
if (!calUpdate.ok) {
  console.error("updateCalendarDraft failed:", calUpdate.errors);
  process.exit(1);
}
if (calUpdate.warnings.length) console.log("Warnings:", calUpdate.warnings);
const calPub = publishCalendar(CALENDAR_ID);
if (!calPub.ok) {
  console.error("publishCalendar failed:", calPub.errors);
  process.exit(1);
}
if (calPub.warnings.length) console.log("Warnings:", calPub.warnings);
console.log("Calendar: summary updated and republished.");

// --- Verify ---
console.log("\n=== Verification ===");
import Database from "better-sqlite3";
const db = new Database("data/guides.db");
const news = db.prepare("SELECT slug, en_summary, status FROM news_posts WHERE id = ?").get(NEWS_ID) as { slug: string; en_summary: string; status: string };
const event = db.prepare("SELECT slug, en_summary, status FROM events WHERE id = ?").get(EVENT_ID) as { slug: string; en_summary: string; status: string };
const cal = db.prepare("SELECT slug, en_summary, status FROM calendar_pages WHERE id = ?").get(CALENDAR_ID) as { slug: string; en_summary: string; status: string };

console.log(`NEWS    [${news.status}] ${news.slug}`);
console.log(`  summary: "${news.en_summary}"`);
console.log(`EVENT   [${event.status}] ${event.slug}`);
console.log(`  summary: "${event.en_summary}"`);
console.log(`CALENDAR [${cal.status}] ${cal.slug}`);
console.log(`  summary: "${cal.en_summary}"`);

console.log("\nDone. All three summaries compressed to 2 sentences and republished.");
