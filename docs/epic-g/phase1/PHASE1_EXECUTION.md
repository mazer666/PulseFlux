# Epic G – Phase 1 Execution (Schrittweise)

Status: **Done (MVP umgesetzt, nächste Ausbaustufe offen)**

Dieses Dokument setzt die Phase 1 praktisch um und hält den Stand pro Schritt fest.

## Schritt 1 – Zielsprachen & Altersrating (abgeschlossen)

### Entscheidung
- Zielsprachen für Start: `de`, `en`, `fr`, `es`
- Sicherheits-/Rating-Basis: family-friendly, kid-safe per default
- Harte No-Go-Klassen: sexual content, hate/extremism, self-harm instructions, targeted harassment
- Inline-Feedback übernommen: **kein teen-Mode in Phase 1**

## Schritt 2 – Lizenzsichere Quellen shortlist (abgeschlossen, mit Review-Pflicht)

Siehe vollständige Liste in `SOURCE_SHORTLIST_V1.md`.

### Entscheidung
- Inline-Feedback übernommen: **zentrale Lizenzfreigabe reicht**
- Pro Importlauf bleibt der verpflichtende Reviewer-Signoff in `source_trace`

## Schritt 3 – Content-Datenmodell & Workflow (abgeschlossen)

- Implementiert als Python-Referenzmodell: `tools/content_pipeline/phase1_model.py`
- Lifecycle: `draft -> reviewed -> approved -> deprecated`

### Nächster sinnvoller Ausbau
- JSON-Schema-Export für direkte API-Validierung, damit API und Batch-Jobs dieselben Regeln teilen.

## Schritt 4 – Prompt-Standards V1 je Sprache (abgeschlossen)

Siehe `PROMPT_STANDARDS_V1.md` mit Sprachvarianten und harten Guardrails.

### Ergebnis
- Für Phase 1 konservativer + leichter Humor-Stil, weitere Varianten in Phase 2.

## Schritt 5 – Auto-QA Checks V1 (abgeschlossen, MVP)

- Implementiert in `tools/content_pipeline/auto_qa.py`
- Checks: policy, leak, readability, ambiguity, similarity

### Ergebnis
- Soft-Flag für ambiguity/similarity/readability
- Hard-Fail für policy/leak

## Schritt 6 – Reviewer Queue MVP (abgeschlossen)

- Logik implementiert in `tools/content_pipeline/reviewer_queue.py`
- Aktionen: approve, request_edit, reject/deprecate, escalate
- Reason Codes sind fest vorgegeben.
- Inline-Feedback übernommen: **Admin-UI gebaut** unter `/admin/reviewer-queue`
