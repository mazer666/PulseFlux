# Epic G – Phase 1 Deliverables (Completed)

Status: **Done**

This document records the concrete outputs completed for Epic G Phase 1.

## 1) Target languages and age-rating standards

### Scope
- Target languages for initial production: `de`, `en`, `fr`, `es`.
- Audience/rating baseline: **family-friendly** with kid-safe filtering by default.

### Policy baseline
- No explicit sexual content, hate speech, extremist content, self-harm instructions, or targeted harassment in words/clues.
- No clues that disclose or include the target word directly (full word, stem, obvious substring leaks).
- Humor must stay non-offensive and age-appropriate.

## 2) License-safe source shortlist (3-5 per language)

Use only sources with explicit licenses compatible with product distribution. Keep license metadata in `source_trace`.

- **Open frequency lists / corpus-derived lists** (language-specific)
- **Open lexicon/dictionary exports** with clear redistribution terms
- **Internal curated allowlists** (brand-safe vocabulary)
- **Educational/common-vocabulary sets** with explicit licensing

> Operational rule: every source import must include: source name, URL/repo, license id/text, ingestion timestamp, and reviewer sign-off.

## 3) Content data model + status workflow

## Canonical fields
- `entry_id` (stable)
- `language`
- `word`
- `lemma`
- `pos`
- `difficulty` (`1-5`)
- `difficulty_confidence`
- `clue_text`
- `clue_style` (`neutral|funny|trivia|wordplay`)
- `safety_flags`
- `quality_scores` (`ambiguity|readability|similarity|predicted_solve_rate`)
- `source_trace`
- `status` (`draft|reviewed|approved|deprecated`)
- `version`

### Workflow
1. `draft` after generation/ingest
2. `reviewed` after automated checks + reviewer pass
3. `approved` after release gate
4. `deprecated` when superseded or policy-removed

## 4) Prompting standards V1 (per language)

All prompt templates must enforce:
- clear, concise clue in target language
- no repetition of answer word or close variant
- one likely solution only (low ambiguity)
- age-appropriate tone
- max clue length (default: 90 chars)
- no niche references unless marked higher difficulty

Language adaptation rule:
- keep intent/meaning, not literal translation
- localize idioms and humor to locale

## 5) Auto-QA checks V1

Required checks before human review:
- **Policy check**: profanity/hate/unsafe category filters
- **Ambiguity check**: lexical overlap with known distractors
- **Similarity check**: near-duplicate clue detection
- **Readability check**: length + complexity threshold by difficulty
- **Leak check**: target word/stem/substring leakage

Gate policy:
- hard fail on policy or leak
- soft flag on ambiguity/similarity/readability for reviewer triage

## 6) Reviewer queue MVP

### Queue fields
- `entry_id`, `language`, `word`, `clue_text`, `auto_flags`, `score_summary`, `source_trace`, `status`

### Actions
- approve
- request edit (with reason code)
- reject/deprecate
- escalate to trust & safety

### Reason codes
- policy_risk
- ambiguity
- too_easy_or_too_hard
- poor_localization
- unfunny_or_low_quality
- duplicate

## Exit criteria met for Phase 1

- [x] Scope/rating standards defined
- [x] License-safe source policy + shortlist template defined
- [x] Data model and lifecycle states defined
- [x] Prompting standards V1 defined
- [x] Auto-QA checks V1 defined
- [x] Reviewer queue MVP process defined
