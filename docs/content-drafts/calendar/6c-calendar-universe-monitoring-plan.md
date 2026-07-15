# UAE Calendar Universe — Monitoring Architecture
**Phase:** 6C-CALENDAR-UNIVERSE-AUDIT-01
**Date:** 2026-07-14
**Status:** Design complete

---

## 1. Monitoring principle

The calendar is never complete. Events are announced, moved, cancelled, and replaced continuously.
A monitoring cadence must be embedded into the weekly SEO workflow so the Guidex calendar stays ahead of, not behind, search demand.

---

## 2. Daily checks (5-10 minutes)

| Check | Method | What to look for |
|-------|--------|------------------|
| Etihad Rail announcements | WAM.ae + etihad-rail.ae | Station opening updates, schedule changes, fare changes |
| Major concert/event announcements | Platinumlist "New Events" + The National arts page | New ticket releases for Dubai/Abu Dhabi — especially Coca-Cola Arena, Dubai Opera, Etihad Arena |
| UAE government press releases | mediaoffice.ae, government.ae | Public holiday confirmations, regulatory deadlines, infrastructure launches |
| GITEX / Expand North Star updates | gitex.com, dubaiexhibitioncentre.com | Speaker updates, programme changes, registration status |

**When to escalate:** Any new event with search demand ≥ 200 estimated monthly impressions → create calendar item within 48 hours.

---

## 3. Weekly checks (30-60 minutes per GSC review session)

| Check | Source | Action |
|-------|--------|--------|
| GSC performance by event pages | Google Search Console | Review CTR changes on GITEX, August calendar, event pages |
| Platinumlist / Ticketmaster new listings | dubai.platinumlist.net, ticketmaster.ae/discover/dubai | New shows → add to master inventory → prioritise |
| What's On Dubai weekly | whatson.ae | New family/lifestyle events not on Platinumlist |
| Time Out Dubai weekly | timeoutdubai.com | Concert and culture announcements |
| DWTC events page | dwtc.com/en/events/ | New exhibition adds to October-December calendar |
| Beat The Heat DXB social | @beattheheatdxb Instagram | Performer announces for Jul/Aug nights |
| Dubai Comedy Festival | dubaicomedfest.com | New acts added |
| Dubai Fitness Challenge | dubaifitnesschallenge.com | Programme updates |

---

## 4. Monthly checks (structured source sweep)

Perform a full source sweep on the 1st or 2nd of each month:

| Source type | Sources | Focus |
|-------------|---------|-------|
| Official UAE Government | government.ae, mohre.gov.ae, mohap.gov.ae | New compliance deadlines, holiday confirmations |
| Official Dubai government | media.gov.ae, dubaidet.gov.ae, rta.ae | Transport updates, DFC, DSF, Dubai retail calendar |
| DWTC full calendar | dwtc.com/en/events | H2 2026 exhibition adds |
| ADNEC / Abu Dhabi | adnec.ae/en/eventlisting | New Abu Dhabi exhibitions |
| Expo City Dubai | expocity.ae | New events at Dubai Exhibition Centre |
| Sharjah Tourism | visitsharjah.com + expo-centre.ae | Book Fair confirmation, other Sharjah events |
| RAK Tourism | raktourism.rak.ae | RAK Art Festival dates, NYE details |
| Platinumlist complete scan | dubai.platinumlist.net + abudhabi.platinumlist.net | Full new event listing |
| Ticketmaster AE | ticketmaster.ae | Cross-check Platinumlist |
| Gulf News events roundup | gulfnews.com/lifestyle | Cultural and lifestyle events |
| Songkick Dubai | songkick.com/metro-areas/26664-united-arab-emirates-dubai | Concert discovery |

**Monthly action:** Update master inventory with new candidates. Flag urgent items (within 60 days). Create calendar items for ready candidates.

---

## 5. Dedicated monitoring windows by topic

### 5.1 Global Village Season 31
- **Check frequency:** Weekly from August 1
- **Sources:** globalvillage.ae, Time Out Dubai, Gulf News, @globalvillagedubai Instagram
- **Trigger:** Official opening date announced → immediately create event page + November/October calendar item
- **Expected announcement:** Late August / September 2026
- **Fallback:** If no announcement by Sep 30, create stub page with "expected mid-October" language

### 5.2 Dubai Shopping Festival 2026-27
- **Check frequency:** Monthly until October, then weekly
- **Sources:** dubaidet.gov.ae, timeoutdubai.com, dsf official
- **Trigger:** Performers, special events, DSF night market locations announced → add to event page
- **Current status:** Start date confirmed Dec 5 (DET official). End date Jan 11.
- **Action now:** Create event page as draft; publish when DET confirms performers/events

### 5.3 NYE Dubai (Burj Khalifa + other emirates)
- **Check frequency:** Monthly until October, then weekly from October
- **Sources:** emaar.ae, @Emaar Instagram, RAKTDA, Abu Dhabi NYE venues
- **Trigger:** Emaar NYE page goes live (usually Oct-Nov) → create calendar item + news update
- **Expected:** Multiple NYE firework events: Dubai (Burj Khalifa), RAK (Jebel Jais/waterfront), Abu Dhabi

### 5.4 Ramadan 2027 preparation
- **Check frequency:** Monthly from December 2026
- **Sources:** Islamic calendar estimates, UAE government announcement (usually 30-60 days ahead)
- **Expected start:** ~March 17-18, 2027 (Islamic calendar estimate — NOT confirmed)
- **Action when confirmed:** Create Ramadan 2027 hub page, update March 2027 calendar

### 5.5 Etihad Rail milestones
- **Check frequency:** Monthly for Dec 30 milestone; then for Mar 30, 2027
- **Sources:** etihad-rail.ae, WAM.ae, Khaleej Times transport desk
- **Triggers:** 
  - Sep 30: Dubai + Al Dhaid stations open → update guide page + Sept calendar
  - Dec 30: Al Dhafra stations → update guide page + Dec calendar
  - Mar 30, 2027: Sharjah station → update guide + March 2027 calendar

### 5.6 Concert cancellations and changes
- **Check frequency:** Weekly
- **Sources:** Platinumlist (cancelled shows), Ticketmaster, artist social accounts
- **What to watch:** Any event with a calendar item → verify still happening 30 days before
- **Action on cancellation:** Update calendar item status to "cancelled"; preserve as historical note

---

## 6. Event lifecycle management

| Stage | Action | Timing |
|-------|--------|--------|
| Discovered | Add to master inventory | Same day |
| Confirmed | Create calendar item (Level A minimum) | Within 48 hours |
| Within 30 days | Verify status + ticket availability | Weekly |
| Within 7 days | Confirm not cancelled/moved | Daily check |
| Completed | Mark as past; keep for historical reference | Day after |
| Cancelled | Mark as cancelled; note refund info if available | Same day |
| Recurring annual | Flag for next-year monitoring; set September reminder | After completion |

---

## 7. Source confidence refresh schedule

| Source | Refresh | Notes |
|--------|---------|-------|
| WAM.ae (official UAE news) | Daily | Government announcements |
| Dubai Media Office | Daily | Dubai-specific official news |
| Platinumlist | Weekly | Full new-event scan |
| DWTC calendar | Monthly | Exhibition adds |
| ADNEC calendar | Monthly | Abu Dhabi exhibition adds |
| Time Out Dubai | Weekly | Entertainment news |
| The National arts page | Weekly | Concert/show roundups |
| Gulf News events | Weekly | Lifestyle and culture |
| Global tourism sites (VisitDubai, VisitAbuDhabi) | Monthly | Major event calendar updates |
| Sharjah official | Monthly (increase to weekly Nov-Dec) | Book Fair, government events |
| RAK tourism | Monthly | RAK Art, NYE |
| FTA (Federal Tax Authority) | Monthly | Compliance deadline announcements |
| KHDA / MoE | Quarterly | School calendar updates |
| Etihad Rail | Monthly (increase to weekly Sep-Dec) | Station opening milestones |

---

## 8. Content freshness rules

Every calendar item must have a `last_verified_date`. The following review schedule applies:

| Time to event | Review frequency |
|--------------|-----------------|
| > 90 days | Monthly |
| 30-90 days | Every 2 weeks |
| 7-30 days | Weekly |
| < 7 days | Every 2 days |
| Public holiday (moon-sighting dependent) | Daily in final week |
| Passed event | Archive (keep in month page for historical reference) |
| Recurring annual event | Flag for next edition creation after 3 months |

---

## 9. Alert conditions (escalate immediately)

These conditions require same-day response:

- Official confirmation of major Islamic holiday dates (Mawlid, Eid, Ramadan)
- Etihad Rail station opening — confirmed or delayed
- Global Village Season 31 opening date confirmed
- DSF start/performer announcement
- NYE Burj Khalifa confirmed by Emaar
- Major event cancellation (Offlimits, F1, GITEX, Atif Aslam)
- New Coca-Cola Arena show announced < 60 days out
- New major government deadline or amnesty period announced
- RAK Art Festival date confirmed

---

## 10. Annual calendar refresh cadence

| Period | Action |
|--------|--------|
| September each year | Begin building next year's Q1 calendar (Jan-Mar) |
| October each year | Launch Global Village + DFC season content |
| November each year | Prep December/NYE content; begin Ramadan watch |
| December each year | Publish next year's public holiday guide; update Etihad Rail milestones |
| January each year | Review DSF performance; set up Feb-Mar event tracking |
| February each year | Watch for Ramadan start confirmation; Dubai Marathon |
| March-April each year | Eid Al Fitr coverage; summer events early-preview |
| May each year | ATM coverage; Eid Al Adha watch |
| June each year | Hijri New Year; begin DSS coverage |
| July-August each year | Summer programme (Modesh World, DSS, concerts) |
