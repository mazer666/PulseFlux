# Epic G – Phase 1 Deliverables (Implemented MVP)

Status: **Done (MVP implemented, pending operational rollout)**

This document records the concrete outputs implemented for Epic G Phase 1.

## 1) Target languages and age-rating standards

Defined in `docs/epic-g/phase1/PHASE1_EXECUTION.md`.

- Target languages: `de`, `en`, `fr`, `es`
- Baseline: family-friendly / kid-safe default
- Hard safety exclusions documented

## 2) License-safe source shortlist (3-5 per language)

Defined in `docs/epic-g/phase1/SOURCE_SHORTLIST_V1.md`.

- 4 candidate sources per language documented
- Mandatory `source_trace` metadata fields established
- Legal/reviewer gate policy documented

## 3) Content data model + status workflow

Implemented in `tools/content_pipeline/phase1_model.py`.

Canonical fields include:
- `entry_id`, `language`, `word`, `lemma`, `pos`
- `difficulty`, `difficulty_confidence`
- `clue_text`, `clue_style`
- `safety_flags`, `quality_scores`
- `source_trace`, `status`, `version`

Workflow states implemented:
1. `draft`
2. `reviewed`
3. `approved`
4. `deprecated`

## 4) Prompting standards V1 (per language)

Defined in `docs/epic-g/phase1/PROMPT_STANDARDS_V1.md`.

- No word leak
- One likely solution
- Age-appropriate tone
- Max clue length constraints
- Locale-aware wrappers for `de/en/fr/es`

## 5) Auto-QA checks V1

Implemented in `tools/content_pipeline/auto_qa.py`.

Checks included:
- Policy check
- Leak check
- Readability check
- Ambiguity check
- Similarity check

Gate policy:
- Hard fail: policy/leak
- Soft flag: ambiguity/similarity/readability

## 6) Reviewer queue MVP

Implemented in `tools/content_pipeline/reviewer_queue.py`.

- Queue item schema and review decisions
- Actions: approve, request_edit, reject/deprecate, escalate
- Fixed reason-code set
- Admin UI MVP available at `/admin/reviewer-queue`

## Exit criteria met for Phase 1

- [x] Scope/rating standards defined
- [x] License-safe source policy + shortlist template defined
- [x] Data model and lifecycle states defined
- [x] Prompting standards V1 defined
- [x] Auto-QA checks V1 defined
- [x] Reviewer queue MVP process defined
