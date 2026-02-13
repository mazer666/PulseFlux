# Epic G – Phase 1 Source Shortlist V1

> Ziel: 3-5 lizenzsichere Quellen pro Sprache, inkl. klarer Nachverfolgbarkeit.

## Deutsch (`de`)
1. Wikimedia/Wiktionary Dumps (CC BY-SA 3.0)
2. OpenThesaurus (Open Database License, ODbL)
3. Leipzig Corpora Collection Wortfrequenzlisten (research/open terms, vor Import prüfen)
4. Intern kuratierte Allowlist (proprietary/internal)

## Englisch (`en`)
1. Wikimedia/Wiktionary Dumps (CC BY-SA 3.0)
2. Wordfreq project lists (MIT)
3. WordNet (Princeton WordNet License)
4. Intern kuratierte Allowlist (proprietary/internal)

## Französisch (`fr`)
1. Wikimedia/Wiktionary Dumps (CC BY-SA 3.0)
2. Lexique (open academic lexicon; terms vor Import prüfen)
3. Open Multilingual WordNet (CC BY 4.0)
4. Intern kuratierte Allowlist (proprietary/internal)

## Spanisch (`es`)
1. Wikimedia/Wiktionary Dumps (CC BY-SA 3.0)
2. Open Multilingual WordNet (CC BY 4.0)
3. Frequency-based open corpora lists (terms vor Import prüfen)
4. Intern kuratierte Allowlist (proprietary/internal)

## Pflichtfelder für `source_trace`
- `source_name`
- `source_url`
- `license_id`
- `imported_at` (UTC timestamp)
- `reviewer`

## Gate-Regel
Keine Quelle darf produktiv ingestiert werden ohne:
1. dokumentierte Lizenz,
2. Link auf Ursprung,
3. Reviewer-Signoff.
