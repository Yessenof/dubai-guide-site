#!/usr/bin/env python3
"""
Phase 6C-VISAS-CONTENT-OPT-01 -- Visa Content Practical Additions (Local)
LOCAL ONLY -- run before any deploy or push.

Updates en_overview / ru_overview for 5 guides and en_advice / ru_advice for 2 steps.
Creates timestamped DB backup before any write.
"""

import sqlite3
import shutil
import sys
from datetime import datetime
from pathlib import Path

DB_PATH   = Path('/Users/batyr/Desktop/dubai-guide-site/data/guides.db')
TS        = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
BACKUP    = DB_PATH.parent / f'guides.db.backup-pre-visa-opt-01-{TS}'

def sep(title):
    print(f'\n-- {title} {"-" * max(0, 55 - len(title))}')

def abort(msg):
    print(f'\nABORT: {msg}', file=sys.stderr)
    sys.exit(1)

# ── Pre-flight ────────────────────────────────────────────────────────────────

sep('Phase 6C-VISAS-CONTENT-OPT-01 -- Local DB Update')
print(f'  DB:  {DB_PATH}')
print(f'  TS:  {TS}')

if not DB_PATH.exists():
    abort(f'DB not found: {DB_PATH}')

# Safety gate: refuse if path looks like production
if 'var/www' in str(DB_PATH):
    abort('Production path detected. Use the production script only with explicit owner approval.')

sep('Creating backup')
shutil.copy2(DB_PATH, BACKUP)
if BACKUP.stat().st_size == 0:
    abort('Backup file is empty.')
print(f'  Backup: {BACKUP}  OK')

# ── Connect ───────────────────────────────────────────────────────────────────

conn = sqlite3.connect(str(DB_PATH))
cur  = conn.cursor()

def append_paras(current, additions):
    """Append new \n\n-separated paragraphs to existing content."""
    parts = [current.strip()] + [p.strip() for p in additions if p.strip()]
    return '\n\n'.join(parts)

# ── Guide overview content ────────────────────────────────────────────────────

sep('Preparing guide overview updates')

GUIDE_UPDATES = {}

# ──────────────────────────────────────────────────────────────────────────────
# 1. employment-visa
# ──────────────────────────────────────────────────────────────────────────────
slug = 'employment-visa'
cur.execute('SELECT id, en_overview, ru_overview FROM guides WHERE slug = ?', (slug,))
row = cur.fetchone()
if not row:
    abort(f'Guide not found: {slug}')
g_id, en_ov, ru_ov = row

GUIDE_UPDATES[slug] = {
    'id': g_id,
    'en_overview': append_paras(en_ov, [
        "What to prepare -- employee provides to the PRO before Step 1: passport (original + copy), passport-size photo with white background, signed offer letter, copy of any existing UAE visa page.",
        "The employer or PRO provides: company trade licence, establishment card, PRO card, and sponsor's original Emirates ID. The company must hold an active establishment card (immigration file) before any visa processing can begin.",
        "Common mistakes: job title in the offer letter does not match the visa category -- causes rejection at MOHRE; starting before the employer has a valid establishment card in place; committing to a start date before the residence visa is stamped in the passport.",
    ]),
    'ru_overview': append_paras(ru_ov, [
        "Что подготовить -- сотрудник передаёт PRO до шага 1: паспорт (оригинал + копия), фото на белом фоне, подписанный оффер (offer letter), копия страницы текущей визы ОАЭ при наличии.",
        "Работодатель или PRO предоставляет: торговую лицензию компании, Establishment Card, PRO Card и оригинал Emirates ID спонсора. У компании должна быть активная Establishment Card (иммиграционный файл) до начала оформления визы.",
        "Частые ошибки: должность в оффере не совпадает с категорией визы -- приводит к отказу в MOHRE; работодатель не оформил Establishment Card до начала процесса; бронирование даты выхода на работу до получения отметки о резидентстве в паспорте.",
    ]),
}
print(f'  {slug}: prepared')

# ──────────────────────────────────────────────────────────────────────────────
# 2. golden-visa-dubai-property
# ──────────────────────────────────────────────────────────────────────────────
slug = 'golden-visa-dubai-property'
cur.execute('SELECT id, en_overview, ru_overview FROM guides WHERE slug = ?', (slug,))
row = cur.fetchone()
if not row:
    abort(f'Guide not found: {slug}')
g_id, en_ov, ru_ov = row

GUIDE_UPDATES[slug] = {
    'id': g_id,
    'en_overview': append_paras(en_ov, [
        "What to prepare for a ready freehold property: title deed or e-certificate of title, passport (original + copy), passport-size photo with white background, Emirates ID and residence permit copy if already a UAE resident. If the property carries a mortgage, include a bank NOC -- contact your bank early as the NOC process can take 5-10 working days.",
        "Off-plan and under-construction properties may require additional documents such as the sale and purchase agreement and a payment statement. Confirm eligibility and exact document requirements with DLD before submitting an off-plan file.",
        "After the main Golden Visa is issued, eligible family members -- including spouse, children, and parents -- can be sponsored under a separate sponsorship file. Step 7 covers costs and the application process.",
    ]),
    'ru_overview': append_paras(ru_ov, [
        "Что подготовить для готовой freehold-недвижимости: свидетельство о праве собственности (title deed или e-certificate от DLD), паспорт (оригинал + копия), фото на белом фоне, Emirates ID и копия резидентской визы при наличии. Если на объекте ипотека -- потребуется NOC от банка, оформление занимает до 5-10 рабочих дней, обращайтесь заблаговременно.",
        "Для объектов off-plan или на стадии строительства могут потребоваться дополнительные документы: договор купли-продажи (SPA) и выписка о произведённых платежах. Требования к таким файлам уточняйте в DLD до подачи.",
        "После получения основной Golden Visa на членов семьи -- супруга, детей и родителей -- можно открыть отдельный файл спонсорства. Шаг 7 описывает сборы и порядок действий.",
    ]),
}
print(f'  {slug}: prepared')

# ──────────────────────────────────────────────────────────────────────────────
# 3. spouse-dependent-visa-dubai-outside-country
# ──────────────────────────────────────────────────────────────────────────────
slug = 'spouse-dependent-visa-dubai-outside-country'
cur.execute('SELECT id, en_overview, ru_overview FROM guides WHERE slug = ?', (slug,))
row = cur.fetchone()
if not row:
    abort(f'Guide not found: {slug}')
g_id, en_ov, ru_ov = row

GUIDE_UPDATES[slug] = {
    'id': g_id,
    'en_overview': append_paras(en_ov, [
        "What the sponsor needs: valid Emirates ID (original), passport copy, residence visa copy, signed Ejari tenancy contract, proof of income (salary certificate or trade licence if self-employed).",
        "What the applicant (spouse) needs: passport (original), passport-size photo with white background, MOFA-attested marriage certificate. The marriage certificate must be attested through the correct chain before UAE use -- typically: notarize in the country of issue, authenticate at the relevant foreign ministry, UAE Embassy stamp, then UAE MOFA attestation in the UAE. Allow 2-4 weeks for this process before starting the Amer application.",
        "Common mistakes: starting the Amer family file before MOFA attestation is complete; name mismatch between the marriage certificate and passport; missing Ejari or sponsor income proof.",
    ]),
    'ru_overview': append_paras(ru_ov, [
        "Что нужно спонсору: действующий Emirates ID (оригинал), копия паспорта, копия резидентской визы, подписанный договор аренды Ejari, подтверждение дохода (справка о зарплате или торговая лицензия для самозанятых).",
        "Что нужно заявителю (супругу/супруге): паспорт (оригинал), фото на белом фоне, свидетельство о браке с аттестацией MOFA ОАЭ. Цепочка аттестации: нотариус в стране выдачи документа -- профильное министерство -- штамп посольства ОАЭ -- аттестация MOFA ОАЭ. Закладывайте 2-4 недели на этот процесс до начала подачи через Amer.",
        "Частые ошибки: открытие семейного файла в Amer до завершения аттестации MOFA; несоответствие имени в свидетельстве о браке и паспорте; отсутствие Ejari или подтверждения дохода спонсора.",
    ]),
}
print(f'  {slug}: prepared')

# ──────────────────────────────────────────────────────────────────────────────
# 4. spouse-dependent-visa-dubai-inside-country
# ──────────────────────────────────────────────────────────────────────────────
slug = 'spouse-dependent-visa-dubai-inside-country'
cur.execute('SELECT id, en_overview, ru_overview FROM guides WHERE slug = ?', (slug,))
row = cur.fetchone()
if not row:
    abort(f'Guide not found: {slug}')
g_id, en_ov, ru_ov = row

GUIDE_UPDATES[slug] = {
    'id': g_id,
    'en_overview': append_paras(en_ov, [
        "What to prepare: same documents as the outside-country route. The marriage certificate must be attested by UAE MOFA before the family file can be opened at Amer -- this applies regardless of whether the applicant is inside or outside the UAE.",
        "The inside-country entry permit (Step 3) carries a higher fee than the outside-country equivalent because it allows the spouse to remain in the UAE throughout the process. Step 4, change of visa status, is an additional step that is not present in the outside-country route.",
    ]),
    'ru_overview': append_paras(ru_ov, [
        "Что подготовить: те же документы, что и в маршруте из-за рубежа. Свидетельство о браке должно пройти аттестацию MOFA ОАЭ до открытия семейного файла в Amer -- это требование действует независимо от того, где находится заявитель.",
        "Entry permit для маршрута внутри страны (шаг 3) дороже, чем для маршрута из-за рубежа: более высокая стоимость отражает возможность оставаться в ОАЭ на протяжении всего процесса. Шаг 4, смена статуса визы, присутствует только в маршруте inside-country.",
    ]),
}
print(f'  {slug}: prepared')

# ──────────────────────────────────────────────────────────────────────────────
# 5. renew-family-visa-dubai
# ──────────────────────────────────────────────────────────────────────────────
slug = 'renew-family-visa-dubai'
cur.execute('SELECT id, en_overview, ru_overview FROM guides WHERE slug = ?', (slug,))
row = cur.fetchone()
if not row:
    abort(f'Guide not found: {slug}')
g_id, en_ov, ru_ov = row

GUIDE_UPDATES[slug] = {
    'id': g_id,
    'en_overview': append_paras(en_ov, [
        "Grace period: UAE residence visas can typically be renewed within a short window after the expiry date without a fine, but the exact period can change. Confirm the current grace period with GDRFA or your Amer center before submitting after the expiry date. Overstaying beyond the grace period may result in a fine that must be cleared before the renewal is accepted.",
    ]),
    'ru_overview': append_paras(ru_ov, [
        "Льготный период: как правило, резидентская виза допускает продление в течение некоторого времени после истечения без штрафа, однако конкретный период может меняться. Уточните актуальный льготный период в GDRFA или центре Amer перед поздней подачей. Если льготный период истёк, до принятия заявки может потребоваться оплата штрафа.",
    ]),
}
print(f'  {slug}: prepared')

# ── Step content updates ──────────────────────────────────────────────────────

sep('Preparing step advice updates')

STEP_UPDATES = {
    # employment-visa Step 1
    '0f358a25-3fa7-4033-a729-ab3079ea5107': {
        'en_advice': (
            "Provide before their visit: passport (original + copy), white background photo, "
            "signed offer letter, and prior UAE visa page if applicable. "
            "The job title must match your visa category exactly. "
            "Some employers arrange ILOE (Involuntary Loss of Employment) insurance at the "
            "Tasheel stage -- confirm with your PRO whether this applies to your contract."
        ),
        'ru_advice': (
            "Передайте до визита: паспорт (оригинал + копия), фото на белом фоне, подписанный "
            "оффер и копию страницы текущей визы ОАЭ при наличии. "
            "Должность в документах должна точно совпадать с категорией визы. "
            "Некоторые работодатели оформляют ILOE (страхование на случай потери работы) "
            "на этапе Tasheel -- уточните у PRO, распространяется ли это на ваш контракт."
        ),
    },
    # golden-visa-dubai-property Step 2
    'c0b5855d-21a6-4cfa-a11c-f540166e9e9b': {
        'en_advice': (
            "Required: passport copy, personal photo, title deed or e-certificate of title, "
            "Emirates ID and residence permit copy if you are a UAE resident. "
            "For mortgaged properties, include a bank NOC -- allow 5-10 working days for the bank to issue it."
        ),
        'ru_advice': (
            "Необходимо: копия паспорта, личное фото, title deed или электронный сертификат "
            "права собственности (Oqood), копия Emirates ID и резидентской визы при наличии. "
            "Для ипотечной недвижимости -- mortgage NOC от банка: "
            "закладывайте 5-10 рабочих дней на его оформление."
        ),
    },
}

for step_id, data in STEP_UPDATES.items():
    print(f'  step {step_id[:8]}...: prepared')

# ── Write to DB ───────────────────────────────────────────────────────────────

sep('Writing guide overview updates')

for slug, data in GUIDE_UPDATES.items():
    cur.execute(
        'UPDATE guides SET en_overview = ?, ru_overview = ?, updated_at = ? WHERE id = ?',
        (data['en_overview'], data['ru_overview'], datetime.now().isoformat(), data['id'])
    )
    if cur.rowcount != 1:
        abort(f'Expected 1 row updated for {slug}, got {cur.rowcount}')
    print(f'  {slug}: {cur.rowcount} row updated')

sep('Writing step advice updates')

for step_id, data in STEP_UPDATES.items():
    cur.execute(
        'UPDATE steps SET en_advice = ?, ru_advice = ? WHERE id = ?',
        (data['en_advice'], data['ru_advice'], step_id)
    )
    if cur.rowcount != 1:
        abort(f'Expected 1 row for step {step_id[:8]}, got {cur.rowcount}')
    print(f'  step {step_id[:8]}...: {cur.rowcount} row updated')

conn.commit()

# ── Verify ────────────────────────────────────────────────────────────────────

sep('Verification')

FORBIDDEN = [
    '  --',             # double-space dash artifact
    'AED 10,500',       # salary threshold -- do not publish as a rule
    'AED 5,000 deposit',
    '48% share',
    'Ukraine 1-year',
    'official fee AED 15,000',
    'guaranteed',
]

any_fail = False

for slug, data in GUIDE_UPDATES.items():
    cur.execute('SELECT en_overview, ru_overview FROM guides WHERE id = ?', (data['id'],))
    row = cur.fetchone()
    if not row:
        print(f'  FAIL: {slug} not found after update', file=sys.stderr)
        any_fail = True
        continue
    en_ov, ru_ov = row
    if en_ov != data['en_overview']:
        print(f'  FAIL: {slug} en_overview mismatch', file=sys.stderr)
        any_fail = True
    if ru_ov != data['ru_overview']:
        print(f'  FAIL: {slug} ru_overview mismatch', file=sys.stderr)
        any_fail = True
    for text in [en_ov, ru_ov]:
        for forbidden in FORBIDDEN:
            if forbidden in text:
                print(f'  FAIL: {slug} contains forbidden phrase: "{forbidden}"', file=sys.stderr)
                any_fail = True
    if not any_fail:
        print(f'  {slug}: PASS')

for step_id, data in STEP_UPDATES.items():
    cur.execute('SELECT en_advice, ru_advice FROM steps WHERE id = ?', (step_id,))
    row = cur.fetchone()
    if not row:
        print(f'  FAIL: step {step_id[:8]} not found', file=sys.stderr)
        any_fail = True
        continue
    en_adv, ru_adv = row
    if en_adv != data['en_advice']:
        print(f'  FAIL: step {step_id[:8]} en_advice mismatch', file=sys.stderr)
        any_fail = True
    if ru_adv != data['ru_advice']:
        print(f'  FAIL: step {step_id[:8]} ru_advice mismatch', file=sys.stderr)
        any_fail = True
    for text in [en_adv, ru_adv]:
        for forbidden in FORBIDDEN:
            if forbidden in text:
                print(f'  FAIL: step {step_id[:8]} contains forbidden phrase: "{forbidden}"', file=sys.stderr)
                any_fail = True
    if not any_fail:
        print(f'  step {step_id[:8]}...: PASS')

conn.close()

if any_fail:
    abort('Verification failed -- see errors above.')

sep('LOCAL UPDATE COMPLETE -- ALL PASS')
print(f'  DB:              {DB_PATH}')
print(f'  Backup:          {BACKUP}')
print(f'  Guides updated:  {len(GUIDE_UPDATES)}')
print(f'  Steps updated:   {len(STEP_UPDATES)}')
print()
print('  Next: edit hub TSX files, then run: npm run build')
