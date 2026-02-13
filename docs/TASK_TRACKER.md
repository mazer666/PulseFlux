# Task Tracker

Use this file to track delivery progress transparently.

## Status Legend

- [ ] Not started
- [~] In progress
- [x] Done

## Epic A - Product and Requirements

- [x] PRD drafted
- [x] SRS drafted
- [x] UX Spec drafted
- [x] Security/Privacy spec drafted

## Epic B - Engineering Foundations

- [x] Initialize frontend application (Next.js + TypeScript)
- [x] Configure Cloudflare deployment bindings
- [x] Setup lint/type/test pipelines
- [x] Add CI security scanning

## Epic C - Gameplay MVP

- [x] Implement board rendering for multiple sizes
- [x] Implement swap-any-two mechanic
- [x] Implement across/down clue engine
- [x] Implement hint behavior (fixed clue-level hints)
- [x] Implement win/lose/continue rule variants
- [x] Implement local leaderboard and storage

## Epic D - Puzzle Intelligence

- [x] Build algorithmic puzzle generation service
- [x] Add solvability and uniqueness quality gates
- [x] Add difficulty rating pipeline
- [x] Integrate multilingual puzzle datasets (EN/DE/FR/ES)
- [x] Add family/kid content filtering

## Epic E - Quality and Compliance

- [x] Accessibility audit checklist and fixes
- [x] Unit/integration/e2e baseline suites
- [x] GDPR/COPPA compliance review pass
- [x] Security hardening pass (rate limiting, headers, validation)

## Epic F - Open Source Enablement

- [x] Contributing guide
- [x] Code style guide
- [x] Testing strategy
- [x] Roadmap and release plan
- [x] Add issue/PR templates
- [x] Add security policy and support channels

## Epic G - Massive Word & Clue Content Pipeline

### Phase 1 (2-4 weeks): Foundation

Status: **Done** (see `docs/EPIC_G_PHASE1_DELIVERABLES.md`)

- [x] Finalize target languages and age-rating standards
- [x] Select 3-5 license-safe word sources per language
- [x] Implement content data model + status workflow (`draft/reviewed/approved/deprecated`)
- [x] Define V1 prompting standards per language (clarity, humor, safety, no word leak)
- [x] Implement V1 auto-QA checks (policy, ambiguity, similarity, readability, leak detection)
- [x] Build reviewer queue MVP for human spot checks and gold-set curation

### Phase 2 (4-8 weeks): Scale-up

- [ ] Run pilot generation of 5,000-20,000 entries across priority languages
- [ ] Perform manual review sample (minimum 500 entries) and feed back into prompts/rules
- [ ] Add hybrid clue production flow (templates + LLM + human-in-the-loop)
- [ ] Enable multi-clue candidate ranking per word (clarity, originality, solvability, compliance)
- [ ] Introduce difficulty model with telemetry features (solve rate, time-to-solve, skips, hints)
- [ ] Launch A/B tests for clue variants and publish versioned datasets

### Phase 3 (ongoing): Optimization

- [ ] Calibrate dynamic difficulty buckets per language and audience segment
- [ ] Expand localization quality checks with meaning-first, culture-aware clue authoring
- [ ] Monitor mandatory KPIs (% approved, % policy-safe, % ambiguous, solve rate by bucket, median TTS, report rate)
- [ ] Add drift detection + rollback-safe publish process for continuous releases
- [ ] Introduce personalized clue style packs and trend/topic integration workflow
