// Phase 6C-UI-02 — Automated visual QA screenshots
// Run with: node docs/content-drafts/ui/6c-ui-02-screenshot-qa.js
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const BASE = "http://localhost:3000";
const OUT = path.join(__dirname, "6c-ui-02-screenshots");

const DESKTOP = { width: 1280, height: 900 };
const MOBILE  = { width: 390, height: 844 };  // iPhone 14 Pro

const ROUTES = [
  { path: "/",                                      name: "home"                      },
  { path: "/ru",                                    name: "ru-home"                   },
  { path: "/calendar",                              name: "calendar"                  },
  { path: "/ru/calendar",                           name: "ru-calendar"               },
  { path: "/calendar/october-2026-dubai-calendar",  name: "october-calendar"          },
  { path: "/ru/calendar/october-2026-dubai-calendar", name: "ru-october-calendar"     },
  { path: "/guides/employment-visa",                name: "employment-visa"            },
  { path: "/find-my-visa",                          name: "find-my-visa"              },
];

// Scroll to trigger StickyRouteCta on pages where it should appear
const SCROLL_ON = ["/guides/employment-visa"];

async function shot(page, url, filename, scroll) {
  await page.goto(url, { waitUntil: "networkidle" });
  if (scroll) {
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: filename, fullPage: false });
  // Also full-page for content check
  const fullName = filename.replace(".png", "-full.png");
  await page.screenshot({ path: fullName, fullPage: true });
  console.log("  ✓", path.basename(filename));
}

async function runQA() {
  const browser = await chromium.launch({ headless: true });

  for (const viewport of [
    { label: "desktop", size: DESKTOP },
    { label: "mobile",  size: MOBILE  },
  ]) {
    const ctx = await browser.newContext({
      viewport: viewport.size,
      deviceScaleFactor: viewport.label === "mobile" ? 2 : 1,
    });
    const page = await ctx.newPage();
    console.log(`\n── ${viewport.label} (${viewport.size.width}×${viewport.size.height}) ──`);

    for (const route of ROUTES) {
      const scroll = SCROLL_ON.includes(route.path);
      const filename = path.join(OUT, `${route.name}-${viewport.label}.png`);
      await shot(page, BASE + route.path, filename, scroll);
    }

    await ctx.close();
  }

  await browser.close();
  console.log("\nAll screenshots saved to:", OUT);
}

runQA().catch((e) => { console.error(e); process.exit(1); });
