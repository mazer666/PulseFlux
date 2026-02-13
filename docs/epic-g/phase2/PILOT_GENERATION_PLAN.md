# Epic G – Phase 2 Schritt 1: Pilot-Generierung (Chunked)

Status: **In progress**

## Ziel
Pilotdaten für große Wort-/Clue-Mengen erzeugen, aber **aufgeteilt in Chunks**, damit Verarbeitung und Review kontrollierbar bleiben.

## Umsetzung
- Generator: `tools/content_pipeline/pilot_generation.py`
- Ausgabeformat: JSON-Dateien je Sprache (`de/en/fr/es`) plus `manifest.json`
- Chunking: konfigurierbar über `chunk_size`

## Beispiel (kleiner Lauf)
```bash
python - <<'PY'
from tools.content_pipeline.pilot_generation import write_pilot_dataset
write_pilot_dataset('artifacts/pilot_small', per_language=120, chunk_size=30)
PY
```

Ergebnis:
- 4 Sprachen
- je Sprache 120 Einträge
- je Sprache 4 Dateien (`batch_001.json` ... `batch_004.json`)

## Warum Chunking Pflicht ist
- Große Listen bleiben reviewbar.
- Import-Jobs können pro Chunk wiederholt/rollbacked werden.
- Fehlerbehandlung bleibt lokal auf kleine Teilmengen.

## Nächster Schritt
- Batch 1 (kleiner Dry-Run) in QA geben.
- Danach hochskalieren (z. B. 1.250 je Sprache pro Lauf).


## Schritt 2.1 – Review-Sampling (neu)
- Tool: `tools/content_pipeline/review_sample.py`
- Erstellt eine stratifizierte Stichprobe über Sprache (`de/en/fr/es`) und Difficulty (`1-5`).
- Exportiert Review-Dateien als JSON und CSV (`review_sample.json`, `review_sample.csv`).

Beispiel:
```bash
python - <<'PY'
from tools.content_pipeline.review_sample import build_review_sample, write_review_exports
sample = build_review_sample('artifacts/pilot_small', sample_size=500, seed=11)
write_review_exports(sample, 'artifacts/review_batch_001')
PY
```
