#!/usr/bin/env python3
"""
Phase 6C-VISAS-PARENTS-PAGE-01 -- Create parents-visa-dubai guide
LOCAL ONLY. Inserts new guide + 7 steps into the DB.

Usage: python3 scripts/create-parents-visa-guide-01.py
"""

import sqlite3
import shutil
import sys
import uuid
from datetime import datetime
from pathlib import Path

DB_PATH = Path('/Users/batyr/Desktop/dubai-guide-site/data/guides.db')
TS      = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
BACKUP  = DB_PATH.parent / f'guides.db.backup-pre-parents-visa-page-01-{TS}'

def sep(title):
    print(f'\n-- {title} {"-" * max(0, 55 - len(title))}')

def abort(msg):
    print(f'\nABORT: {msg}', file=sys.stderr)
    sys.exit(1)

if 'var/www' in str(DB_PATH):
    abort('This is the LOCAL script.')

sep('Phase 6C-VISAS-PARENTS-PAGE-01 -- Create parents-visa-dubai')
print(f'  DB:  {DB_PATH}')
print(f'  TS:  {TS}')

if not DB_PATH.exists():
    abort(f'DB not found: {DB_PATH}')

sep('Creating backup')
shutil.copy2(DB_PATH, BACKUP)
print(f'  Backup: {BACKUP}  OK')

conn = sqlite3.connect(str(DB_PATH))
cur  = conn.cursor()

# ── Safety: check slug does not already exist ─────────────────────────────────

cur.execute("SELECT id FROM guides WHERE slug = 'parents-visa-dubai'")
if cur.fetchone():
    abort("Guide 'parents-visa-dubai' already exists. Aborting to prevent duplicate.")

# ── Guide record ──────────────────────────────────────────────────────────────

GUIDE_ID = str(uuid.uuid4())
NOW      = datetime.now().isoformat()
SLUG     = 'parents-visa-dubai'

sep('Inserting guide record')

EN_TITLE   = "Parents Visa Dubai: Sponsor Mother or Father in the UAE"
EN_SUMMARY = (
    "How to sponsor a parent's UAE residence visa in Dubai. Covers Amer document checklist, "
    "sponsor salary and Ejari notes, relationship attestation, medical fitness, Emirates ID, "
    "and Amer service-centre fee breakdown."
)
EN_AUDIENCE = (
    "UAE residents -- employed, self-employed, or Golden Visa holders -- who want to sponsor "
    "a parent's residence visa in Dubai, via inside-country or outside-country route."
)
EN_OVERVIEW = "\n\n".join([
    "A UAE resident may sponsor a parent's residence visa in Dubai if the file meets Amer and "
    "GDRFA requirements. The process runs entirely through Amer service centres under GDRFA "
    "residency rules. No employer involvement is required -- the file is the sponsor's personal "
    "responsibility.",

    "If the parent is outside the UAE, the entry permit is issued first and the parent travels "
    "to Dubai before the medical and Emirates ID steps. If the parent is already inside the UAE, "
    "the process includes a Change of Status step (Amer fee: AED 698.90) before medical -- "
    "the parent does not need to leave the country.",

    "Amer filing notes: Amer service-centre notes reviewed by Guidex list a monthly income "
    "reference of AED 10,500 and a two-bedroom Ejari for parent sponsorship files. A refundable "
    "deposit of AED 5,000 may also be listed. These figures reflect Amer's internal filing "
    "guidelines and are reviewed case by case at GDRFA -- they are not published statutory "
    "thresholds.",

    "AMER service-centre fee notes (for reference only -- confirm at counter): open file "
    "AED 283.15; entry permit outside UAE AED 439.90, inside UAE AED 1,089.90; change of "
    "status AED 698.90; medical AED 372.50; Emirates ID 1-year AED 286.50, 2-year AED 386.50; "
    "residence stamping 1-year AED 409.90, 2-year AED 510.00. Additional: cancellation inside "
    "UAE AED 189.90, outside UAE AED 289.90; modification AED 372; replacement Emirates ID "
    "AED 486.12; update mobile AED 105; violation committee AED 289.90. Health insurance cost "
    "varies by category and provider. These are Amer service-centre notes shared with Guidex -- "
    "actual fees may vary by file, insurance, typing, and authority review.",

    "Common mistakes: relationship documents (sponsor birth certificate) not fully attested "
    "through the MOFA chain -- the most common reason for file rejection at Amer; name "
    "mismatch between the sponsor birth certificate and the parent's passport; Ejari not "
    "meeting the two-bedroom guideline noted by Amer; 3-month bank statement not ready at "
    "file opening; parent's existing visa status not checked before applying; health insurance "
    "not budgeted.",

    "Guidex can review sponsor eligibility before opening the file, prepare the Amer document "
    "checklist, coordinate attestation, and manage the inside-UAE or outside-UAE filing path "
    "from start to stamping.",
])

RU_TITLE   = "Виза для родителей в Дубае: как спонсировать маму или отца в ОАЭ"
RU_SUMMARY = (
    "Как спонсировать резидентскую визу родителей в Дубае. Чеклист документов AMER, "
    "аттестация, требования к зарплате и Ejari, сборы по рабочим заметкам AMER."
)
RU_AUDIENCE = (
    "Резиденты ОАЭ -- работающие, самозанятые или обладатели Golden Visa -- "
    "которые хотят спонсировать визу для мамы или папы в Дубае."
)
RU_OVERVIEW = "\n\n".join([
    "Резидент ОАЭ может спонсировать резидентскую визу для родителей в Дубае, если файл "
    "соответствует требованиям AMER и GDRFA. Весь процесс проходит через сервисные центры "
    "AMER под контролем GDRFA. Участие работодателя не требуется -- файл является личной "
    "ответственностью спонсора.",

    "Если родитель находится за пределами ОАЭ, сначала оформляется entry permit и родитель "
    "приезжает в Дубай, затем проходит медосмотр и оформляет Emirates ID. Если родитель уже "
    "находится в ОАЭ, процесс включает шаг смены статуса (Change of Status, сбор AMER: "
    "698,90 AED) до медосмотра -- выезжать из страны не нужно.",

    "Рабочие заметки AMER: по данным AMER, предоставленным Guidex, для файла спонсирования "
    "родителей могут потребоваться: зарплата спонсора от 10 500 AED в месяц, Ejari на "
    "двухкомнатное жильё, выписка по счёту за 3 месяца, свидетельство о рождении спонсора "
    "с полной аттестацией MOFA и возвратный депозит 5 000 AED. Эти данные отражают "
    "внутренние ориентиры AMER и рассматриваются в каждом случае индивидуально в GDRFA -- "
    "они не являются официальными пороговыми значениями.",

    "Примечания по сборам AMER (только для ориентира -- уточняйте в центре): открытие файла "
    "283,15 AED; entry permit снаружи ОАЭ 439,90 AED, изнутри ОАЭ 1 089,90 AED; смена "
    "статуса 698,90 AED; медосмотр 372,50 AED; Emirates ID 1 год 286,50 AED, 2 года "
    "386,50 AED; штамп резидентства 1 год 409,90 AED, 2 года 510,00 AED. Дополнительно: "
    "аннулирование изнутри ОАЭ 189,90 AED, снаружи 289,90 AED; изменение 372 AED; замена "
    "Emirates ID 486,12 AED; обновление телефона 105 AED; нарушение 289,90 AED. Страховка "
    "обязательна, стоимость зависит от категории. Это рабочие заметки AMER -- фактические "
    "суммы могут отличаться по файлу, страховке, обработке и решению GDRFA.",

    "Частые ошибки: неполная аттестация свидетельства о рождении спонсора (самая частая "
    "причина отказа); несоответствие имён в свидетельстве о рождении и паспорте родителя; "
    "Ejari не соответствует требованию к двухкомнатному жилью; выписка по счёту за "
    "3 месяца не готова к моменту подачи; статус визы родителя не уточнён заранее; "
    "медицинская страховка не учтена в бюджете.",

    "Guidex поможет проверить соответствие спонсора требованиям до открытия файла, "
    "подготовить чеклист документов AMER, организовать аттестацию и провести весь процесс "
    "по маршруту изнутри или снаружи ОАЭ до получения визы.",
])

cur.execute("""
    INSERT INTO guides (
        id, slug, category, published, price, timeline, last_updated,
        created_at, updated_at,
        en_title, en_summary, en_audience, en_overview,
        ru_title, ru_summary, ru_audience, ru_overview
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    GUIDE_ID, SLUG, 'visas', 1,
    "AED 2,500–4,000+ (entry permit, medical, Emirates ID, stamping per Amer notes; deposit "
    "and health insurance are additional and may vary)",
    "4–8 weeks from file opening to residence stamping (depends on attestation, entry permit "
    "processing, and medical results)",
    "June 2026",
    NOW, NOW,
    EN_TITLE, EN_SUMMARY, EN_AUDIENCE, EN_OVERVIEW,
    RU_TITLE, RU_SUMMARY, RU_AUDIENCE, RU_OVERVIEW,
))
if cur.rowcount != 1: abort('Guide insert failed')
print(f'  Guide inserted: {GUIDE_ID}')
print(f'  Slug:           {SLUG}')

# ── Steps ─────────────────────────────────────────────────────────────────────

sep('Inserting steps')

STEPS = [
    {
        'step_order': 1,
        'cost':       'Varies by country',
        'time_est':   '2–4 weeks',
        'en_title':   'Attest Relationship Documents',
        'en_what':    (
            "Attest the sponsor's birth certificate through the full chain: notarize in the "
            "country of issue, authenticate at the national foreign ministry, UAE Embassy stamp, "
            "then UAE MOFA attestation. This document proves the parent-child relationship to GDRFA."
        ),
        'en_where':   'UAE MOFA (final step)',
        'en_address': 'Any UAE MOFA attestation centre',
        'en_advice':  (
            "Allow 2–4 weeks for the full attestation chain. Start this step before collecting "
            "any other documents. Both the sponsor birth certificate and the parent's passport "
            "must show consistent name spelling -- any mismatch causes file rejection at Amer."
        ),
        'en_warning': (
            "Amer will reject the family file without fully attested relationship proof. "
            "A digital or unattested copy is not accepted."
        ),
        'ru_title':   'Аттестация документов о родстве',
        'ru_what':    (
            "Аттестовать свидетельство о рождении спонсора по полной цепочке: нотариус в "
            "стране выдачи → профильное министерство → посольство ОАЭ → MOFA ОАЭ. Этот "
            "документ подтверждает родство с родителями для GDRFA."
        ),
        'ru_where':   'MOFA ОАЭ (финальный шаг)',
        'ru_address': 'Любой аттестационный центр MOFA ОАЭ',
        'ru_advice':  (
            "Закладывайте 2–4 недели на полную цепочку аттестации. Начните этот шаг первым, "
            "до сбора остальных документов. Имена в свидетельстве о рождении спонсора и в "
            "паспорте родителя должны совпадать -- любое расхождение приведёт к отказу в AMER."
        ),
        'ru_warning': (
            "AMER не примет семейный файл без полностью аттестованного документа о родстве. "
            "Цифровая копия или неаттестованный документ неприемлемы."
        ),
    },
    {
        'step_order': 2,
        'cost':       '',
        'time_est':   '1–2 days to prepare',
        'en_title':   'Prepare Sponsor Documents',
        'en_what':    (
            "Gather all sponsor-side documents before the Amer visit: physical Emirates ID "
            "(original card, not a copy), passport copy, residence visa copy, Ejari tenancy "
            "contract, 3-month bank statement, and salary proof."
        ),
        'en_where':   'Your own records / employer / bank',
        'en_address': '',
        'en_advice':  (
            "Amer notes reviewed by Guidex list a two-bedroom Ejari and an income reference "
            "of AED 10,500 as filing guidelines for parent sponsorship files. Salary proof: "
            "salary certificate (employed) or trade licence (self-employed or business owner). "
            "These are Amer service-centre references reviewed case by case at GDRFA -- "
            "confirm current requirements before visiting."
        ),
        'en_warning': '',
        'ru_title':   'Подготовка документов спонсора',
        'ru_what':    (
            "Собрать все документы спонсора до визита в AMER: физический Emirates ID (оригинал "
            "карты, не копия), копия паспорта, копия резидентской визы, договор Ejari, выписка "
            "по счёту за 3 месяца и подтверждение дохода."
        ),
        'ru_where':   'Ваши документы / работодатель / банк',
        'ru_address': '',
        'ru_advice':  (
            "По рабочим заметкам AMER для файла спонсирования родителей: Ejari на двухкомнатное "
            "жильё и зарплата спонсора от 10 500 AED. Подтверждение дохода: справка о зарплате "
            "(работающие) или торговая лицензия (самозанятые). Эти данные -- ориентиры AMER, "
            "рассматриваются индивидуально в GDRFA -- уточняйте актуальные требования перед подачей."
        ),
        'ru_warning': '',
    },
    {
        'step_order': 3,
        'cost':       'AED 283.15 (file opening, Amer notes)',
        'time_est':   'Same day',
        'en_title':   'Open Family File at Amer',
        'en_what':    (
            "Submit the complete file at Amer: sponsor's original Emirates ID, passport copy, "
            "residence visa copy, Ejari, salary proof, bank statement, parent's passport, "
            "white-background photo, and attested relationship documents."
        ),
        'en_where':   'Amer service center',
        'en_address': 'Any Amer branch in Dubai',
        'en_advice':  (
            "Sponsor must bring the physical Emirates ID card -- digital copies are not accepted. "
            "A refundable deposit may be requested at this stage (Amer notes reference AED 5,000). "
            "Confirm the deposit requirement and refund process with Amer before visiting."
        ),
        'en_warning': '',
        'ru_title':   'Открытие семейного файла в AMER',
        'ru_what':    (
            "Подать полный пакет в AMER: оригинал Emirates ID спонсора, копия паспорта, копия "
            "резидентской визы, Ejari, подтверждение дохода, выписка по счёту, паспорт родителя, "
            "фото на белом фоне и аттестованные документы о родстве."
        ),
        'ru_where':   'Сервисный центр AMER',
        'ru_address': 'Любое отделение AMER в Дубае',
        'ru_advice':  (
            "Спонсор должен принести физический Emirates ID -- цифровые копии не принимаются. "
            "На этом этапе может потребоваться возвратный депозит (в рабочих заметках AMER -- "
            "5 000 AED). Уточните требование к депозиту и условия возврата в AMER до визита."
        ),
        'ru_warning': '',
    },
    {
        'step_order': 4,
        'cost':       'AED 439.90–1,089.90 (Amer notes)',
        'time_est':   '3–5 working days',
        'en_title':   'Apply for Entry Permit',
        'en_what':    (
            "Amer submits the entry permit application for the parent. If the parent is outside "
            "the UAE, they travel to Dubai once the permit is issued. If the parent is already "
            "inside the UAE, a Change of Status step follows before the medical."
        ),
        'en_where':   'Amer service center',
        'en_address': 'Any Amer branch in Dubai',
        'en_advice':  (
            "Outside UAE entry permit fee per Amer notes: AED 439.90. Inside UAE entry permit: "
            "AED 1,089.90. If the parent is inside the UAE, a Change of Status (Amer fee: "
            "AED 698.90) is required before proceeding to the medical step."
        ),
        'en_warning': '',
        'ru_title':   'Оформление entry permit',
        'ru_what':    (
            "AMER подаёт заявку на entry permit для родителя. Если родитель за пределами ОАЭ -- "
            "приезжает по разрешению. Если родитель уже внутри ОАЭ -- далее следует шаг смены "
            "статуса перед медосмотром."
        ),
        'ru_where':   'Сервисный центр AMER',
        'ru_address': 'Любое отделение AMER в Дубае',
        'ru_advice':  (
            "Entry permit снаружи ОАЭ по заметкам AMER: 439,90 AED. Изнутри ОАЭ: 1 089,90 AED. "
            "При маршруте внутри страны потребуется дополнительный шаг -- Change of Status "
            "(698,90 AED) -- до медосмотра."
        ),
        'ru_warning': '',
    },
    {
        'step_order': 5,
        'cost':       'AED 372.50 (Amer notes)',
        'time_est':   '1–2 days',
        'en_title':   'Complete Medical Fitness Test',
        'en_what':    (
            "Parent attends a GDRFA-approved medical centre for a blood test and chest X-ray. "
            "Results are submitted electronically to ICA."
        ),
        'en_where':   'GDRFA-approved medical centre',
        'en_address': 'Coordinated through Amer',
        'en_advice':  (
            "Bring passport (original), entry permit copy or change of status confirmation, "
            "white-background photo, and an active email address and mobile number for result "
            "delivery."
        ),
        'en_warning': 'Residence cannot be issued until medical clearance is confirmed by ICA.',
        'ru_title':   'Медицинское освидетельствование',
        'ru_what':    (
            "Родитель проходит медосмотр (анализ крови и рентген грудной клетки) в одобренном "
            "центре GDRFA. Результаты передаются в ICA в электронном виде."
        ),
        'ru_where':   'Одобренный медцентр GDRFA',
        'ru_address': 'Через сервисный центр AMER',
        'ru_advice':  (
            "Взять с собой: оригинал паспорта, копию entry permit или подтверждение смены "
            "статуса, фото на белом фоне, действующий email и номер телефона для доставки "
            "результатов."
        ),
        'ru_warning': 'Резидентская виза не может быть выдана до получения медицинского разрешения ICA.',
    },
    {
        'step_order': 6,
        'cost':       'AED 286.50–386.50 (Amer notes, 1–2 year)',
        'time_est':   '2–3 days (card delivery 5–10 days)',
        'en_title':   'Apply for Emirates ID',
        'en_what':    (
            "Submit the Emirates ID application and complete biometric enrollment (fingerprints "
            "and photo) at an Amer centre."
        ),
        'en_where':   'Amer service center',
        'en_address': 'Any Amer branch in Dubai',
        'en_advice':  (
            "1-year Emirates ID per Amer notes: AED 286.50 / 2-year: AED 386.50. Provide a "
            "correct delivery address -- the card is delivered by post separately from the visa."
        ),
        'en_warning': '',
        'ru_title':   'Заявка на Emirates ID',
        'ru_what':    (
            "Подать заявку на Emirates ID и пройти биометрическую регистрацию (отпечатки "
            "пальцев и фото) в центре AMER."
        ),
        'ru_where':   'Сервисный центр AMER',
        'ru_address': 'Любое отделение AMER в Дубае',
        'ru_advice':  (
            "Emirates ID на 1 год: 286,50 AED / на 2 года: 386,50 AED (по заметкам AMER). "
            "Укажите точный адрес доставки -- карта отправляется почтой отдельно от визы."
        ),
        'ru_warning': '',
    },
    {
        'step_order': 7,
        'cost':       'AED 409.90–510.00 (Amer notes, 1–2 year)',
        'time_est':   '2–3 days',
        'en_title':   'Finalize Residence Visa',
        'en_what':    (
            "Final stamping of the parent's UAE residence visa in their passport at Amer. "
            "The visa is also linked electronically to the Emirates ID."
        ),
        'en_where':   'Amer service center',
        'en_address': 'Any Amer branch in Dubai',
        'en_advice':  (
            "1-year stamping per Amer notes: AED 409.90 / 2-year: AED 510.00. Passport is held "
            "briefly during stamping -- avoid travel bookings until it's returned. Health "
            "insurance must be arranged before or alongside this step."
        ),
        'en_warning': '',
        'ru_title':   'Финализация резидентской визы',
        'ru_what':    (
            "Финальное проставление штампа резидентской визы ОАЭ в паспорте родителя в AMER. "
            "Виза также привязывается в электронном виде к Emirates ID."
        ),
        'ru_where':   'Сервисный центр AMER',
        'ru_address': 'Любое отделение AMER в Дубае',
        'ru_advice':  (
            "Штамп на 1 год: 409,90 AED / на 2 года: 510,00 AED (по заметкам AMER). Паспорт "
            "временно остаётся в AMER -- не планируйте поездки до его возврата. Медицинская "
            "страховка должна быть оформлена до или на этом шаге."
        ),
        'ru_warning': '',
    },
]

for step in STEPS:
    step_id = str(uuid.uuid4())
    cur.execute("""
        INSERT INTO steps (
            id, guide_id, step_order, cost, time_est,
            en_title, en_what, en_where, en_address, en_advice, en_warning,
            ru_title, ru_what, ru_where, ru_address, ru_advice, ru_warning
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        step_id, GUIDE_ID, step['step_order'], step['cost'], step['time_est'],
        step['en_title'], step['en_what'], step['en_where'], step['en_address'],
        step['en_advice'], step['en_warning'],
        step['ru_title'], step['ru_what'], step['ru_where'], step['ru_address'],
        step['ru_advice'], step['ru_warning'],
    ))
    if cur.rowcount != 1: abort(f"Step {step['step_order']} insert failed")
    print(f"  Step {step['step_order']}: {step_id}  ({step['en_title']})")

conn.commit()

# ── Verify ────────────────────────────────────────────────────────────────────

sep('Verification')

cur.execute("SELECT id, slug, published, en_title, ru_title FROM guides WHERE slug='parents-visa-dubai'")
g = cur.fetchone()
if not g: abort('Guide not found after insert')
if not g[2]: abort('Guide not published')
if not g[3]: abort('en_title empty')
if not g[4]: abort('ru_title empty')
print(f'  Guide:      {g[1]}  published={g[2]}  OK')
print(f'  EN title:   {g[3]}')
print(f'  RU title:   {g[4]}')

cur.execute("SELECT COUNT(*) FROM steps WHERE guide_id = ?", (GUIDE_ID,))
step_count = cur.fetchone()[0]
if step_count != 7: abort(f'Expected 7 steps, found {step_count}')
print(f'  Steps:      {step_count}  OK')

FORBIDDEN = ['guaranteed', 'always required', 'universal law', '  --',
             '48% share', 'Ukraine 1-year']

cur.execute("SELECT en_overview, ru_overview FROM guides WHERE id = ?", (GUIDE_ID,))
ov = cur.fetchone()
for field, text in [('en_overview', ov[0]), ('ru_overview', ov[1])]:
    for phrase in FORBIDDEN:
        if phrase in text:
            abort(f'{field} contains forbidden phrase: "{phrase}"')
print(f'  Content:    no forbidden phrases  OK')

conn.close()

sep('COMPLETE -- ALL PASS')
print(f'  Slug:    {SLUG}')
print(f'  ID:      {GUIDE_ID}')
print(f'  Backup:  {BACKUP}')
print()
print('  Next: update lib/related-guides.ts, hub pages, source notes, then build')
