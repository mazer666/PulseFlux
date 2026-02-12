# Product Requirements Document (PRD)

## 1. Product Vision

SwapPuzzle is a premium-quality web puzzle game where players solve clue-based grids by swapping any two tiles.
The product goal is to deliver a "best-in-class" player experience: polished UX, smart puzzle generation, and scalable architecture for future competitive modes.

## 2. Product Goals

### Primary Goals (MVP)

1. Deliver a highly engaging puzzle loop for casual puzzle fans.
2. Achieve excellent usability on mobile, then desktop, then tablet.
3. Support multiple puzzle board sizes in MVP.
4. Support both letter tiles and image-based tiles in MVP.
5. Launch with multilingual support (EN/DE/FR/ES) for UI and puzzle data.
6. Be open-source-friendly with complete documentation and contribution standards.

### Success Criteria

- D1: First playable puzzle starts in less than 3 user actions from landing page.
- D2: Core game interactions remain smooth on mid-range mobile devices.
- D3: Accessibility baseline reaches WCAG 2.1 AA compliance targets.
- D4: Puzzle generation always returns solvable boards passing quality gates.
- D5: 365 launch puzzles available across supported configurations.

## 3. Target Audience

- Primary: Casual puzzle fans.
- Secondary (future-ready): Family mode and kid-friendly mode through content profiles and visual presets.

## 4. User Segments and Needs

1. **Quick Solver**: wants short, clear, mobile-friendly daily sessions.
2. **Strategic Solver**: wants optional constraints (swap limits, score pressure).
3. **Relaxed Player**: wants no pressure and optional continuation after swap depletion.
4. **Family/Kid Mode User**: wants safe clues and age-appropriate content set.

## 5. MVP Scope

### Included

- Guest mode (no account required).
- Local-only player data storage.
- Local best-scores leaderboard.
- Puzzle boards with multiple sizes.
- Two tile types: letters and simple semantic image tiles.
- Across/Down clue model.
- Configurable difficulty behaviors (e.g., swap limits on/off).
- One hint per row/column clue context (fixed, non-purchasable).
- English, German, French, Spanish language options.
- Cloudflare deployment blueprint (Pages + Functions + D1).

### Excluded (Phase 2+)

- Account login (Google/Apple/Email).
- Global multiplayer and versus races.
- Purchasable hints and monetization.
- Audio/music system.
- Author/editor internal content tool.

## 6. Core Experience Requirements

- Swapping any two tiles must be intuitive and responsive.
- Win condition: all target words are correct.
- Lose condition: optional mode where game ends at 0 swaps.
- Continue option: optional mode to keep playing at 0 swaps.
- Mandatory win animation feedback.
- UI themes and visual styles must be optional/selectable.

## 7. Non-Functional Product Requirements

- Mobile-first responsive behavior.
- Fast initial loading and smooth interaction loops.
- High accessibility: contrast, keyboard support, screen reader semantics.
- Secure defaults and privacy-first implementation.
- Source clarity suitable for beginner developers.

## 8. Open Source Product Expectations

- GPL licensing model.
- Clear onboarding for external contributors.
- Transparent changelog and task tracking.
- High-comment, explanatory code standards for readability.

## 9. Risks and Mitigation

1. **Risk:** Quality of algorithmic generation varies by language.
   **Mitigation:** enforce validation gates and curated fallback pools.
2. **Risk:** Image-based tiles increase complexity.
   **Mitigation:** define strict MVP image token schema and constraints.
3. **Risk:** Accessibility regressions during rapid iteration.
   **Mitigation:** CI accessibility checks and review checklist.
4. **Risk:** Scope creep from "best ever" ambition.
   **Mitigation:** strict MVP/Phase-2 boundary in roadmap.

## 10. Product Phasing

- MVP: polished single-player guest experience with multilingual support.
- Phase 2: accounts, cloud saves, global leaderboards, versus modes.
- Phase 3: advanced social, live events, creator tools, deeper personalization.
