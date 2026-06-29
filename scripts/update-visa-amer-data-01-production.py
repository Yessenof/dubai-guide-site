#!/usr/bin/env python3
"""
Phase 6C-VISAS-AMER-DATA-INTEGRATION-01 -- Production DB update
PRODUCTION script -- run on server AFTER git pull, BEFORE npm run build.

Applies identical overview/step updates as the local script.
Creates timestamped DB backup before any write.

Run on server:
  cd /var/www/guidex
  python3 scripts/update-visa-amer-data-01-production.py
"""

import sqlite3
import shutil
import sys
from datetime import datetime
from pathlib import Path

DB_PATH = Path('/var/www/guidex/data/guides.db')
TS      = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
BACKUP  = DB_PATH.parent / f'guides.db.backup-pre-amer-data-integration-01-prod-{TS}'

def sep(title):
    print(f'\n-- {title} {"-" * max(0, 55 - len(title))}')

def abort(msg):
    print(f'\nABORT: {msg}', file=sys.stderr)
    sys.exit(1)

sep('Phase 6C-VISAS-AMER-DATA-INTEGRATION-01 -- Production DB Update')
print(f'  DB:  {DB_PATH}')
print(f'  TS:  {TS}')

if not DB_PATH.exists():
    abort(f'DB not found: {DB_PATH}')

sep('Creating backup')
shutil.copy2(DB_PATH, BACKUP)
if BACKUP.stat().st_size == 0:
    abort('Backup file is empty.')
print(f'  Backup: {BACKUP}  OK')

conn = sqlite3.connect(str(DB_PATH))
cur  = conn.cursor()

def append_paras(current, additions):
    parts = [current.strip()] + [p.strip() for p in additions if p.strip()]
    return '\n\n'.join(parts)

# ── Guide IDs ─────────────────────────────────────────────────────────────────

sep('Loading guide IDs')

for slug in ('employment-visa', 'golden-visa-dubai-property'):
    cur.execute('SELECT id FROM guides WHERE slug = ?', (slug,))
    row = cur.fetchone()
    if not row: abort(f'Guide not found: {slug}')
    if slug == 'employment-visa':
        emp_id = row[0]
    else:
        gld_id = row[0]
    print(f'  {slug}: {row[0]}')

# ── employment-visa overview ───────────────────────────────────────────────────

sep('employment-visa: overview update')

cur.execute('SELECT en_overview, ru_overview FROM guides WHERE id = ?', (emp_id,))
row = cur.fetchone()
if not row: abort('employment-visa not found')
en_ov, ru_ov = row

emp_en_overview_new = append_paras(en_ov, [
    "At the Amer stamping appointment (Step 8), the PRO brings: sponsor original Emirates ID, "
    "passport copy, e-visa confirmation, Emirates ID application reference, Tawjeeh sign-off, "
    "signed final contract, and ILOE insurance. Outstanding ILOE arrears attract an AED 400 "
    "annual fine collected at Amer -- your PRO should confirm ILOE status before booking the "
    "stamping appointment.",
])

emp_ru_overview_new = append_paras(ru_ov, [
    "На встрече по stamping в AMER (шаг 8) PRO приносит: оригинал Emirates ID спонсора, "
    "копию паспорта, e-visa confirmation, подтверждение заявки на Emirates ID, подтверждение "
    "Tawjeeh, подписанный итоговый контракт и страховку ILOE. Задолженность по ILOE влечёт "
    "штраф 400 AED в год -- AMER взимает его прямо на стойке. PRO должен проверить статус "
    "ILOE до записи на этот приём.",
])

cur.execute(
    'UPDATE guides SET en_overview = ?, ru_overview = ?, updated_at = ? WHERE id = ?',
    (emp_en_overview_new, emp_ru_overview_new, datetime.now().isoformat(), emp_id)
)
if cur.rowcount != 1: abort(f'Expected 1 row, got {cur.rowcount}')
print(f'  employment-visa overview: updated')

# ── golden-visa overview ───────────────────────────────────────────────────────

sep('golden-visa: overview update')

cur.execute('SELECT en_overview, ru_overview FROM guides WHERE id = ?', (gld_id,))
row = cur.fetchone()
if not row: abort('golden-visa not found')
en_ov, ru_ov = row

gld_en_overview_new = append_paras(en_ov, [
    "Joint ownership with a spouse: if a freehold property is co-owned, the spouse with the "
    "higher registered ownership percentage is the applicant. A MOFA-attested marriage "
    "certificate is required in addition to the standard property documents.",

    "Amer service-centre fee notes: Amer centres typically quote all-in package figures of "
    "approximately AED 15,000 for property Golden Visa applicants below age 65 and AED 17,000 "
    "for applicants above 65. These figures cover government fees, Emirates ID, and "
    "service-centre handling charges. Actual cost varies by file, insurance, medical fees, "
    "and processing route.",
])

gld_ru_overview_new = append_paras(ru_ov, [
    "Совместное владение с супругом: если freehold-объект зарегистрирован на двух владельцев, "
    "заявителем выступает тот, у кого доля собственности выше. Дополнительно потребуется "
    "свидетельство о браке с аттестацией MOFA ОАЭ.",

    "Примечания по сборам AMER: сервисные центры AMER, как правило, называют итоговые цифры "
    "пакета -- около 15 000 AED для заявителей до 65 лет и 17 000 AED старше 65 лет. "
    "В пакет включены государственные сборы, Emirates ID и услуги центра. Фактическая "
    "стоимость зависит от типа файла, страховки, медосмотра и маршрута оформления.",
])

cur.execute(
    'UPDATE guides SET en_overview = ?, ru_overview = ?, updated_at = ? WHERE id = ?',
    (gld_en_overview_new, gld_ru_overview_new, datetime.now().isoformat(), gld_id)
)
if cur.rowcount != 1: abort(f'Expected 1 row, got {cur.rowcount}')
print(f'  golden-visa overview: updated')

# ── Step updates ──────────────────────────────────────────────────────────────

sep('Step updates')

STEP_UPDATES = {

    '01fa8cb4-1358-4efb-886c-a9daf95da782': {
        'en_advice': (
            "Your PRO needs the MOHRE labor number (MB number, issued after Step 1) to open "
            "the Amer entry permit file. All remaining steps depend on this approval -- "
            "your PRO should track it and notify you as soon as it clears."
        ),
        'ru_advice': (
            "PRO потребуется регистрационный номер MOHRE (MB number -- формируется после шага "
            "1), чтобы открыть файл entry permit в AMER. Все последующие шаги зависят от "
            "этого одобрения -- попросите PRO отслеживать статус и сообщить вам сразу, как "
            "только разрешение будет готово."
        ),
    },

    '1bae9611-3f3e-4a00-9809-844354e00eac': {
        'en_advice': (
            "Bring your passport (original), entry permit copy, passport-size photo "
            "(white background), and an active email address and mobile number -- "
            "the clinic registers these for result delivery."
        ),
        'ru_advice': (
            "Возьмите с собой оригинал паспорта, копию entry permit, фото на белом фоне "
            "(паспортный формат), а также действующий email и номер телефона -- "
            "клиника регистрирует их для доставки результатов."
        ),
    },

    '0ceed4bb-658a-4703-88db-01ebd991c924': {
        'en_advice': (
            "At the Amer stamping counter, the PRO brings: sponsor original Emirates ID, "
            "passport copy, e-visa confirmation, Emirates ID application reference, "
            "Tawjeeh sign-off (for the applicable labor category), signed final contract, "
            "and ILOE insurance. If ILOE arrears are outstanding, Amer collects an AED 400 "
            "annual fine at this stage -- your PRO should resolve this before booking the "
            "appointment. Your passport is held briefly during stamping -- avoid booking "
            "travel until it's returned."
        ),
        'ru_advice': (
            "На стойке stamping в AMER PRO предъявляет: оригинал Emirates ID спонсора, "
            "копию паспорта, e-visa confirmation, подтверждение заявки на Emirates ID, "
            "подтверждение Tawjeeh (для соответствующей категории труда), подписанный "
            "итоговый контракт и полис ILOE. При наличии задолженности по ILOE AMER взимает "
            "штраф 400 AED в год прямо на этом шаге -- PRO должен урегулировать это до "
            "записи на приём. Паспорт временно остаётся у PRO на время stamping -- "
            "не планируйте поездки до его возврата."
        ),
    },

    'c0b5855d-21a6-4cfa-a11c-f540166e9e9b': {
        'en_advice': (
            "Ready freehold: title deed (AED 2M+, fully paid), passport copy, photo, "
            "Emirates ID and residence permit copy if a UAE resident. "
            "Off-plan or under construction: initial sale contract, statement of account "
            "confirming at least 30% of purchase price paid, passport, photo, Emirates ID "
            "if a UAE resident. "
            "Mortgaged: title deed, instalment plan, bank NOC (allow 5-10 working days), "
            "passport, photo, Emirates ID if a UAE resident. "
            "Joint ownership with spouse: the partner with the higher registered share applies; "
            "add a MOFA-attested marriage certificate to the standard documents."
        ),
        'ru_advice': (
            "Готовая недвижимость: title deed на сумму от 2 млн AED (полностью оплачена), "
            "копия паспорта, фото, копия Emirates ID и резидентской визы при наличии. "
            "Off-plan или строящийся объект: договор купли-продажи (initial contract of sale), "
            "выписка (SOA) с подтверждением оплаты не менее 30% стоимости, паспорт, фото, "
            "Emirates ID при наличии. "
            "Ипотека: title deed, план платежей, NOC банка (5-10 рабочих дней), паспорт, "
            "фото, Emirates ID. "
            "Совместное владение с супругом: подаёт партнёр с большей зарегистрированной "
            "долей; добавляется свидетельство о браке с аттестацией MOFA."
        ),
    },

    'f56ce9a9-2904-4923-bcf6-d9d5b5187a40': {
        'en_advice': (
            "Cost covers DLD fees (AED 4,020), residency permit confirmation (AED 2,856.75), "
            "and administrative fees (AED 1,155). Amer service centres may quote all-in package "
            "figures -- approximately AED 15,000 for applicants below age 65 and AED 17,000 "
            "above 65, covering government fees, Emirates ID, and service-centre handling. "
            "Actual cost varies by file, insurance, and medical fees."
        ),
        'ru_advice': (
            "Стоимость AED 8 031.75 включает: сборы DLD (AED 4 020), подтверждение разрешения "
            "на резидентство (AED 2 856.75) и административные сборы (AED 1 155). Сервисные "
            "центры AMER могут называть итоговый пакет: ориентировочно 15 000 AED для "
            "заявителей до 65 лет и 17 000 AED старше 65 лет, включая госсборы, Emirates ID "
            "и услуги центра. Фактическая стоимость зависит от типа файла, страховки и "
            "медосмотра."
        ),
    },

    '2b5f4024-f752-4983-ae98-4c3f4061208e': {
        'en_advice': (
            "Each family member requires a separate sponsorship file. Costs are AED 5,774.50 "
            "residence permit plus AED 318.75 file opening, plus AED 100 per sponsored person. "
            "For parent sponsorship, Amer notes may list: sponsor salary of AED 10,500, "
            "two-bedroom Ejari, 3-month bank statement, sponsor birth certificate attested by "
            "MOFA, proof of relationship, and a refundable deposit (Amer notes reference "
            "AED 5,000). Final requirements are reviewed case by case at GDRFA."
        ),
        'ru_advice': (
            "Для каждого члена семьи открывается отдельный файл. Ориентировочные сборы: "
            "5 774.50 AED за резидентскую визу, 318.75 AED за открытие файла, 100 AED с "
            "человека. При спонсировании родителей AMER может запросить: зарплату спонсора "
            "от 10 500 AED, Ejari на двухкомнатное жильё, выписку по счёту за 3 месяца, "
            "свидетельство о рождении спонсора с аттестацией MOFA, подтверждение родства и "
            "возвратный депозит (в рабочих материалах AMER фигурируют 5 000 AED). Итоговый "
            "список требований определяется индивидуально в GDRFA."
        ),
    },
}

sep('Verifying step IDs exist in production DB')
for step_id in STEP_UPDATES:
    cur.execute('SELECT id FROM steps WHERE id = ?', (step_id,))
    if not cur.fetchone():
        abort(f'Step ID not found in production DB: {step_id}')
    print(f'  step {step_id[:8]}...: found  OK')

sep('Writing step updates')
for step_id, data in STEP_UPDATES.items():
    cur.execute(
        'UPDATE steps SET en_advice = ?, ru_advice = ? WHERE id = ?',
        (data['en_advice'], data['ru_advice'], step_id)
    )
    if cur.rowcount != 1:
        abort(f'Expected 1 row for step {step_id[:8]}, got {cur.rowcount}')
    print(f'  step {step_id[:8]}...: updated')

conn.commit()

# ── Verification ──────────────────────────────────────────────────────────────

sep('Verification')

FORBIDDEN = [
    '  --',
    'guaranteed',
    'always required',
    'universal law',
    '48% share',
    'Ukraine 1-year',
]

any_fail = False

for guide_id, slug, en_new, ru_new in [
    (emp_id, 'employment-visa', emp_en_overview_new, emp_ru_overview_new),
    (gld_id, 'golden-visa-dubai-property', gld_en_overview_new, gld_ru_overview_new),
]:
    cur.execute('SELECT en_overview, ru_overview FROM guides WHERE id = ?', (guide_id,))
    row = cur.fetchone()
    if not row:
        print(f'  FAIL: {slug} not found', file=sys.stderr); any_fail = True; continue
    en_ov_check, ru_ov_check = row
    if en_ov_check != en_new:
        print(f'  FAIL: {slug} en_overview mismatch', file=sys.stderr); any_fail = True
    if ru_ov_check != ru_new:
        print(f'  FAIL: {slug} ru_overview mismatch', file=sys.stderr); any_fail = True
    for f in FORBIDDEN:
        for field, text in [('en_overview', en_ov_check), ('ru_overview', ru_ov_check)]:
            if f in text:
                print(f'  FAIL: {slug} {field} contains "{f}"', file=sys.stderr)
                any_fail = True
    if not any_fail:
        print(f'  {slug} overview: PASS')

for step_id, data in STEP_UPDATES.items():
    cur.execute('SELECT en_advice, ru_advice FROM steps WHERE id = ?', (step_id,))
    row = cur.fetchone()
    if not row:
        print(f'  FAIL: step {step_id[:8]} not found', file=sys.stderr); any_fail = True; continue
    en_adv, ru_adv = row
    if en_adv != data['en_advice']:
        print(f'  FAIL: step {step_id[:8]} en_advice mismatch', file=sys.stderr); any_fail = True
    if ru_adv != data['ru_advice']:
        print(f'  FAIL: step {step_id[:8]} ru_advice mismatch', file=sys.stderr); any_fail = True
    for f in FORBIDDEN:
        for field, text in [('en_advice', en_adv), ('ru_advice', ru_adv)]:
            if f in text:
                print(f'  FAIL: step {step_id[:8]} {field} contains "{f}"', file=sys.stderr)
                any_fail = True
    if not any_fail:
        print(f'  step {step_id[:8]}...: PASS')

conn.close()

if any_fail:
    abort('Verification failed.')

sep('PRODUCTION UPDATE COMPLETE -- ALL PASS')
print(f'  DB:             {DB_PATH}')
print(f'  Backup:         {BACKUP}')
print(f'  Guides updated: 2 overviews (employment-visa, golden-visa-dubai-property)')
print(f'  Steps updated:  {len(STEP_UPDATES)} step advice fields')
print()
print('  Next: run zero-downtime deploy')
print('    bash scripts/deploy-zero-downtime.sh')
