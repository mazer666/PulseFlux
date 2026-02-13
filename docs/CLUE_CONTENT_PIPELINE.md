# Strategie für große Wort- und Clue-Datenmengen

Dieses Dokument beschreibt einen umsetzbaren Ansatz, um **sehr große Mengen** an tatsächlich verfügbaren Wörtern und qualitativ guten Clues aufzubauen, zu prüfen und kontinuierlich zu verbessern – inklusive Standard-Compliance, Schwierigkeitsgraden und Mehrsprachigkeit.

## 1. Zielbild

Wir bauen eine "Content Factory" statt einer einmaligen Liste:

1. **Wortquellen ingestieren** (pro Sprache)
2. **Wörter normalisieren und freigeben** (lizenz- und policy-konform)
3. **Clues generieren** (regelbasiert + LLM + menschliche Kuratierung)
4. **Qualität messen** (Spielbarkeit, Humor, Eindeutigkeit, Fairness)
5. **Schwierigkeitsgrad kalibrieren** (mit Telemetrie)
6. **Versioniert ausrollen** (A/B Tests, Rollback-fähig)

## 2. Datenmodell (minimal)

Pro Eintrag (pro Sprache):

- `entry_id` (stabil)
- `language` (z. B. `de`, `en`, `fr`)
- `word`
- `lemma` / `pos` (optional, hilfreich)
- `difficulty` (1-5 + confidence)
- `clue_text`
- `clue_style` (neutral, witzig, trivia, wortspiel)
- `safety_flags` (toxicity, policy, age-rating)
- `quality_scores` (ambiguity, fun, solve_rate_prediction)
- `source_trace` (Quelle/Lizenz/Generationsweg)
- `status` (`draft`, `reviewed`, `approved`, `deprecated`)
- `version`

## 3. Wortinventar: groß, aber kontrolliert

### 3.1 Quelltypen

- Offene Lexika/Wortlisten je Sprache (nur klare Lizenzen)
- Häufigkeitslisten (Korpus-basiert, um Spielbarkeit zu erhöhen)
- Domänenlisten (Alltag, Popkultur, Schule, Natur etc.)
- Optional: interne kuratierte Listen für Marken-Ton

### 3.2 Filterung

- Duplikate, Flexionsvarianten und Schreibvarianten zusammenführen
- Entfernen: Obszönität, Hate, sensible Eigennamen (je Rating)
- Länge, Buchstabenmuster, Sonderzeichen-Regeln pro Spielmodus
- Sprachecht-Prüfung (z. B. Wortform-Wahrscheinlichkeit)

### 3.3 Lizenz- und Compliance-Gate

- Jeder Import hat verpflichtende Lizenz-Metadaten
- Nur Quellen mit klarer Nutzbarkeit für Produkt + Distribution
- Auditierbare Herkunft je Wort (`source_trace`)

## 4. Clue-Erstellung: Hybrid-Ansatz

### 4.1 Drei Produktionswege

1. **Template-basiert** für robuste Baseline
2. **LLM-generiert** für Vielfalt/Humor
3. **Human-in-the-loop** für Top-Sets und heikle Bereiche

### 4.2 Prompting-Standard (pro Sprache)

Definiert harte Regeln:

- keine Wortwiederholung im Clue
- möglichst eindeutige Lösung
- altersgerechter Humor
- kulturell lokalisiert statt wörtlich übersetzt
- maximale Länge und Lesbarkeit

### 4.3 Mehrere Clues pro Wort

Pro Wort 3-8 Clues erzeugen und intern ranken:

- Klarheit
- Originalität
- Lösbarkeit
- Regelkonformität

Bestes Clue wird Standard; weitere Varianten bleiben für Rotation und A/B.

## 5. Qualitätsbewertung (automatisiert + menschlich)

### 5.1 Automatische Checks

- Policy/Safety-Scanner
- Ambiguitäts-Heuristik (mehrdeutige Hinweise markieren)
- Similarity-Check (Dubletten/zu ähnliche Clues)
- Lesbarkeits- und Längen-Check
- "Leak"-Check (Teile des Zielworts im Clue)

### 5.2 Menschliche Review-Stufen

- **Stufe A:** Stichproben bei neuen Quellen/Prompts
- **Stufe B:** Fokusprüfung bei schlechten KPI-Segmenten
- **Stufe C:** Gold-Set-Kuration (Startkatalog, Featured-Sets)

## 6. Schwierigkeit kalibrieren

Schwierigkeit nicht nur "gefühlte" Redaktion, sondern datenbasiert:

- Features: Worthäufigkeit, Wortlänge, Konkretheit, Clue-Typ
- Online-KPIs: Solve-Rate, Zeit bis Lösung, Skip-Rate, Hint-Nutzung
- Modell: Difficulty-Score mit periodischer Rekalibrierung
- Ergebnis: dynamische Einstufung je Sprache + Segment (z. B. Alter)

## 7. Mehrsprachigkeit sauber lösen

### 7.1 "Meaning-first", nicht "translation-first"

Nicht nur ein deutsches Clue übersetzen. Stattdessen:

- gemeinsames Konzept/Intent pro Eintrag
- pro Sprache eigene, kulturell passende Clues
- Sprachexpert:innen für Spot-Checks

### 7.2 Sprachspezifische Regeln

- Tokenisierung/Plural/Sonderzeichen je Sprache
- Verbots- und Sensitivitätslisten je Region
- unterschiedliche Humor-Register zulassen

## 8. Produktionsprozess (Pipeline)

1. **Ingest Job** (Wortquellen)
2. **Normalize Job** (Dedup + Filter + Lizenz)
3. **Generate Job** (Clue-Kandidaten)
4. **Score Job** (Qualität + Policy + Schwierigkeit)
5. **Review Queue** (Human QA)
6. **Publish Job** (versioniertes Dataset)
7. **Observe Job** (Telemetry + Drift Detection)

Alles idempotent, versioniert, rückrollbar.

## 9. KPI-Set (Pflichtmetriken)

- `% approved clues`
- `% policy-safe`
- `% ambiguous flagged`
- Solve-Rate je Difficulty-Bucket
- Median Time-to-Solve
- Spielerbewertung ("war der Clue gut/funny?")
- Report-Rate (unangemessen/falsch)

## 10. Rollout-Plan (praktisch)

### Phase 1 (2-4 Wochen): Fundament

- Datenmodell und Lizenz-Tracking
- Baseline-Generator (Template + LLM)
- Auto-Checks + einfache Reviewer-Oberfläche

### Phase 2 (4-8 Wochen): Skalierung

- Mehrsprachige Erweiterung (2-3 Kernsprachen)
- Difficulty-Modell mit Telemetrie-Feedback
- A/B Tests für Clue-Varianten

### Phase 3 (laufend): Optimierung

- Humor-/Style-Personalisierung
- Segment-spezifische Packs
- halbautomatische Trend-Themen-Integration

## 11. Team-Setup

- **Content Engineering:** Pipeline, Scoring, Tooling
- **Linguistik/Localization:** Sprachqualität + Kulturfit
- **Trust & Safety:** Richtlinien, Eskalationen, Audits
- **Game Design:** Spielbarkeit und Difficulty-Tuning
- **Data Science:** KPI, Modellierung, Experimentauswertung

## 12. Konkrete nächste 10 Tage

1. Zielsprachen und Altersrating final festlegen
2. 3-5 lizenzsaubere Wortquellen pro Sprache auswählen
3. Datenmodell + Statusworkflow in Schema gießen
4. Prompt-Standard V1 pro Sprache definieren
5. Auto-QA Checks V1 implementieren
6. 5.000-20.000 Einträge als Pilot generieren
7. Manuelle Stichprobe (mind. 500) reviewen
8. Difficulty-Buckets initial labeln
9. Kleiner Live-Test (5-10 % Traffic)
10. KPI-Review + Iterationsplan für Sprint 2

---

Kurz gesagt: Für "riesige Datenmengen mit guten Clues" braucht ihr eine **skalierbare Content-Pipeline** mit klaren Qualitätsgates und laufender Kalibrierung, nicht nur einen einmaligen Content-Export.
