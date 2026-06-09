/**
 * Phase 6C-100A: Local import — Hijri New Year 2026 (June 15)
 *
 * What this does:
 * 1. Backs up local DB before any write
 * 2. Adds JUN-15-HIJRI public holiday entry to june-2026-dubai-calendar dates_json
 * 3. Sets has_islamic_dates=1 on that calendar page
 * 4. Inserts news post: uae-hijri-new-year-holiday-june-15-2026
 *
 * Source: Gulf News reporting FAHR + MoHRE joint announcement
 * Source URL: https://gulfnews.com/uae/uae-declares-monday-a-public-holiday-for-islamic-new-year-1.500562040
 *
 * LOCAL ONLY — no production DB write
 */

import Database from "better-sqlite3";
import { execSync } from "child_process";
import { readFileSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { randomUUID } from "crypto";
import path from "path";

const DB_PATH = path.resolve(__dirname, "../data/guides.db");
const BACKUP_DIR = path.resolve(__dirname, "../backups/local");

function main() {
  // ── Backup ──────────────────────────────────────────────────────────────────
  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupPath = path.join(BACKUP_DIR, `guides.db.pre-hijri-6c100a-${ts}`);
  copyFileSync(DB_PATH, backupPath);
  console.log("✓ Local DB backed up to:", backupPath);

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // ── PART 1: Update june-2026-dubai-calendar ─────────────────────────────────
  const CAL_SLUG = "june-2026-dubai-calendar";
  const calRow = db.prepare("SELECT id, dates_json, has_islamic_dates FROM calendar_pages WHERE slug = ?").get(CAL_SLUG) as { id: string; dates_json: string; has_islamic_dates: number } | undefined;
  if (!calRow) throw new Error(`Calendar page not found: ${CAL_SLUG}`);

  const existingDates: Array<Record<string, unknown>> = JSON.parse(calRow.dates_json || "[]");

  // Guard: abort if entry already exists
  if (existingDates.some((d) => d.id === "JUN-15-HIJRI")) {
    console.log("⚠ JUN-15-HIJRI already exists in dates_json — skipping calendar update.");
  } else {
    const hijriEntry = {
      id: "JUN-15-HIJRI",
      date: "2026-06-15",
      label_en: "UAE public holiday: Hijri New Year 1448 AH",
      label_ru: "Выходной в ОАЭ: исламский Новый год 1448 г.х.",
      short_label_en: "Hijri New Year holiday",
      short_label_ru: "Выходной: исл. Новый год",
      type: "public-holiday",
      confidence: "confirmed",
      priority: 1,
      detail_url: "/news/uae-hijri-new-year-holiday-june-15-2026",
      brief_en:
        "Monday, 15 June 2026 is a UAE public holiday for Hijri New Year 1448 AH. Applies to federal government entities (FAHR) and private sector establishments (MoHRE). Dubai Government (DGHR) confirmed the same date for Dubai government employees. Work resumes Tuesday, 16 June for standard schedules. Essential and shift-based services may follow separate arrangements.",
      brief_ru:
        "Понедельник, 15 июня 2026 года, объявлен выходным в ОАЭ по случаю исламского Нового года 1448 года хиджры. Выходной распространяется на федеральные государственные органы (FAHR) и организации частного сектора (MoHRE). Органы управления персоналом Дубая (DGHR) подтвердили тот же день для муниципальных служащих. При стандартном графике работа возобновляется во вторник, 16 июня. Для сменных и жизненно важных служб могут действовать отдельные расписания.",
      source_label_en: "Gulf News: FAHR + MoHRE announcement",
      source_label_ru: "Gulf News: объявление FAHR и MoHRE",
      source_url:
        "https://gulfnews.com/uae/uae-declares-monday-a-public-holiday-for-islamic-new-year-1.500562040",
      source_status: "confirmed",
      cta_type: "open_source",
      cta_url:
        "https://gulfnews.com/uae/uae-declares-monday-a-public-holiday-for-islamic-new-year-1.500562040",
      cta_label_en: "Source: Gulf News",
      cta_label_ru: "Источник: Gulf News",
      emirate: "UAE",
      risk_level: "low",
      lifecycle: "event_fixed",
      noindex_after: "2026-06-16",
      archive_action: "keep",
    };

    // Insert at beginning so priority-1 holiday appears first
    const updatedDates = [hijriEntry, ...existingDates];

    db.prepare(
      "UPDATE calendar_pages SET dates_json = ?, has_islamic_dates = 1, updated_at = datetime('now') WHERE slug = ?"
    ).run(JSON.stringify(updatedDates), CAL_SLUG);

    const verify = db.prepare("SELECT dates_json, has_islamic_dates FROM calendar_pages WHERE slug = ?").get(CAL_SLUG) as { dates_json: string; has_islamic_dates: number };
    const verifyDates = JSON.parse(verify.dates_json);
    const found = verifyDates.find((d: Record<string, unknown>) => d.id === "JUN-15-HIJRI");
    if (!found) throw new Error("ASSERTION FAILED: JUN-15-HIJRI not found after insert");
    if (verify.has_islamic_dates !== 1) throw new Error("ASSERTION FAILED: has_islamic_dates not updated");
    if (verifyDates.length !== existingDates.length + 1) throw new Error(`ASSERTION FAILED: expected ${existingDates.length + 1} dates, got ${verifyDates.length}`);
    console.log(`✓ June 2026 calendar updated: ${existingDates.length} → ${verifyDates.length} dates`);
    console.log(`✓ JUN-15-HIJRI date: ${found.date}, type: ${found.type}, priority: ${found.priority}`);
    console.log(`✓ has_islamic_dates: ${verify.has_islamic_dates}`);
  }

  // ── PART 2: Insert news post ─────────────────────────────────────────────────
  const NEWS_SLUG = "uae-hijri-new-year-holiday-june-15-2026";
  const existingPost = db.prepare("SELECT id FROM news_posts WHERE slug = ?").get(NEWS_SLUG);
  if (existingPost) {
    console.log("⚠ News post already exists — skipping news insert.");
  } else {
    const now = new Date().toISOString();
    const newsId = randomUUID();

    db.prepare(`
      INSERT INTO news_posts (
        id, slug, status, category, tags_json,
        en_title, en_summary, en_body, en_seo_title, en_meta_description,
        ru_published, ru_title, ru_summary, ru_body, ru_seo_title, ru_meta_description,
        source_url, source_label, date_published, date_updated,
        noindex, featured_homepage, featured_digest,
        related_guide_slug, related_service_slug, related_tool_slug,
        created_at, updated_at
      ) VALUES (
        ?, ?, 'published', 'government', '[]',
        ?, ?, ?, ?, ?,
        1, ?, ?, ?, ?, ?,
        ?, 'media_citing_official', '2026-06-09', '2026-06-09',
        0, 0, 0,
        '', '', '',
        ?, ?
      )
    `).run(
      newsId,
      NEWS_SLUG,
      // EN fields
      "UAE confirms Hijri New Year holiday on 15 June 2026",
      "Monday, 15 June 2026 is a UAE public holiday for Hijri New Year 1448 AH. The Federal Authority for Government Human Resources (FAHR) and the Ministry of Human Resources and Emiratisation (MoHRE) confirmed the holiday covers both federal government entities and private sector establishments. Work resumes Tuesday, 16 June.",
      `The Federal Authority for Government Human Resources (FAHR) and the Ministry of Human Resources and Emiratisation (MoHRE) have announced that Monday, 15 June 2026, will be an official public holiday across the UAE for Hijri New Year 1448 AH. Dubai Government Human Resources Department (DGHR) confirmed the same date as a holiday for Dubai government employees.

| Sector | Date | Confirmed | Authority |
|---|---|---|---|
| Federal government | Mon 15 June 2026 | Yes | FAHR |
| Private sector | Mon 15 June 2026 | Yes | MoHRE |
| Dubai Government | Mon 15 June 2026 | Yes | DGHR |

Work resumes on Tuesday, 16 June 2026 for employees on standard schedules. Essential services and shift-based roles may follow separate arrangements announced by individual employers or authorities.

For residents on a Saturday-Sunday weekend, 15 June falls immediately after the regular weekend, creating a three-day break: Saturday 13, Sunday 14, and Monday 15 June.

Hijri New Year marks the start of 1 Muharram, the first month of the Islamic calendar. The UAE pre-sets the holiday date in its official annual calendar rather than making it subject to local moon sighting.

Source: Gulf News, reporting FAHR + MoHRE joint announcement.`,
      "UAE Hijri New Year Holiday 2026: Monday 15 June Confirmed",
      "UAE public holiday Monday 15 June 2026 for Hijri New Year 1448 AH. Applies to federal government and private sector (FAHR + MoHRE). Work resumes 16 June.",
      // RU fields
      "В ОАЭ подтвердили выходной на исламский Новый год 15 июня 2026 года",
      "Понедельник, 15 июня 2026 года, объявлен выходным в ОАЭ по случаю исламского Нового года 1448 года хиджры. Выходной распространяется на федеральные государственные органы (FAHR) и организации частного сектора (MoHRE). Работа возобновляется 16 июня.",
      `Федеральное ведомство по кадровым ресурсам правительства (FAHR) и Министерство трудовых ресурсов и эмиратизации (MoHRE) объявили, что понедельник, 15 июня 2026 года, является официальным государственным выходным в ОАЭ по случаю исламского Нового года 1448 года хиджры. Управление кадровых ресурсов Дубая (DGHR) подтвердило тот же день для сотрудников муниципальных органов власти.

| Сектор | Дата | Подтверждено | Орган |
|---|---|---|---|
| Федеральные ведомства | Пн, 15 июня 2026 | Да | FAHR |
| Частный сектор | Пн, 15 июня 2026 | Да | MoHRE |
| Органы власти Дубая | Пн, 15 июня 2026 | Да | DGHR |

При стандартном графике работа возобновляется во вторник, 16 июня 2026 года. Для сменных работников и жизненно важных служб могут быть установлены отдельные расписания — их объявят работодатели или профильные ведомства.

Для тех, чей выходной приходится на субботу и воскресенье, 15 июня идёт сразу после обычного уикенда — получается три нерабочих дня подряд: суббота 13-го, воскресенье 14-го и понедельник 15-го июня.

Исламский Новый год знаменует начало 1 мухаррама — первого месяца исламского лунного календаря. ОАЭ заранее устанавливают дату праздника в официальном государственном календаре.

Источник: Gulf News по объявлению FAHR и MoHRE.`,
      "Выходной на исламский Новый год 2026 в ОАЭ: подтверждён понедельник, 15 июня",
      "Выходной в ОАЭ 15 июня 2026 г. по случаю исламского Нового года 1448 г.х. Распространяется на федеральные органы и частный сектор (FAHR + MoHRE). Работа возобновляется 16 июня.",
      // source
      "https://gulfnews.com/uae/uae-declares-monday-a-public-holiday-for-islamic-new-year-1.500562040",
      // created_at, updated_at
      now,
      now
    );

    const verifyNews = db.prepare("SELECT id, status, en_title, ru_published, noindex FROM news_posts WHERE slug = ?").get(NEWS_SLUG) as { id: string; status: string; en_title: string; ru_published: number; noindex: number } | undefined;
    if (!verifyNews) throw new Error("ASSERTION FAILED: news post not found after insert");
    if (verifyNews.status !== "published") throw new Error("ASSERTION FAILED: news post not published");
    if (verifyNews.ru_published !== 1) throw new Error("ASSERTION FAILED: ru_published not 1");
    if (verifyNews.noindex !== 0) throw new Error("ASSERTION FAILED: noindex should be 0");
    console.log(`✓ News post inserted: ${NEWS_SLUG}`);
    console.log(`  id: ${verifyNews.id}`);
    console.log(`  status: ${verifyNews.status}`);
    console.log(`  ru_published: ${verifyNews.ru_published}`);
    console.log(`  noindex: ${verifyNews.noindex}`);
  }

  db.close();
  console.log("\n✓ All assertions passed. Local import complete.");
  console.log("  Next: run npm run build, then local QA.");
  console.log("  Do NOT deploy or push until owner approves.");
}

main();
