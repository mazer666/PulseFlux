# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose

This document defines functional and non-functional requirements for the SwapPuzzle web application.

### 1.2 Scope

SwapPuzzle is an online web game where users solve clue-based word grids by swapping tiles. The system supports letters and image tiles, multilingual puzzle data, and configurable gameplay modes.

### 1.3 Definitions

- **Tile:** A movable board unit containing a letter or image token.
- **Across/Down clue:** Clue tied to horizontal/vertical word target.
- **Quality Gate:** Automated check proving puzzle validity and playability.

## 2. Overall Description

### 2.1 Product Perspective

- Cloud-hosted web application.
- Guest-first MVP with local state.
- Backend services available for puzzle generation, validation, and future extensibility.

### 2.2 User Classes

- Guest player.
- Future registered player.
- Maintainer/contributor.

### 2.3 Constraints

- Must run in modern browsers.
- Must support EN/DE/FR/ES from MVP.
- Must comply with GDPR baseline and COPPA considerations.
- No analytics tracking in MVP.

## 3. Functional Requirements

### FR-001: Start Game

- The system shall allow a user to start a new puzzle from a game lobby/state screen.

### FR-002: Tile Swap

- The system shall allow swapping any two non-blocked tiles in a board.
- The system shall animate swap transitions.

### FR-003: Board Sizes

- The system shall support multiple board sizes in MVP (minimum: 5x5, 7x7, 9x9).

### FR-004: Tile Types

- The system shall support letter tiles.
- The system shall support image tiles representing word components.

### FR-005: Clue Navigation

- The system shall provide across/down clue browsing.
- The system shall highlight selected clue range on board.

### FR-006: Hint Rules

- The system shall provide fixed hints (non-purchasable).
- The system shall provide one clue-level hint per horizontal/vertical context.

### FR-007: Difficulty Options

- The system shall allow user-selectable difficulty profiles.
- Profiles may toggle swap-cost rules and fail-at-zero mode.

### FR-008: Win/Lose Logic

- The system shall detect solved state when all target words are correct.
- The system shall optionally end game on 0 swaps (if enabled).
- The system shall optionally allow continuation at 0 swaps.

### FR-009: Scoring

- The system shall calculate score from solve time, swaps, and difficulty modifiers.
- The system shall store local best scores per mode and language.

### FR-010: Family/Kid Mode

- The system shall offer content profile selection.
- Kid profile shall use only approved family-safe clue datasets.

### FR-011: Internationalization

- The system shall provide UI localization in EN/DE/FR/ES.
- The system shall provide puzzle datasets per language.

### FR-012: Data Persistence (MVP)

- The system shall store guest settings and progress locally in browser storage.

### FR-013: Backend API

- The system shall expose APIs for puzzle generation and puzzle validation.
- The system shall be deployable on Cloudflare Functions.

### FR-014: Local Leaderboard

- The system shall show local-device leaderboard entries in MVP.

### FR-015: Documentation and Contribution

- The project shall include full docs under `/docs`.
- The project shall include contribution workflow and coding standards.

## 4. Non-Functional Requirements

### NFR-001 Performance

- Time-to-interactive target under 3 seconds on mid-range mobile (stable network).
- 60fps target for core interactions where feasible.

### NFR-002 Accessibility

- Target conformance: WCAG 2.1 AA.
- Keyboard navigability and visible focus indicators are mandatory.

### NFR-003 Security

- Input validation for all API parameters.
- Output encoding for user-visible dynamic data.
- Rate limiting on puzzle generation endpoints.

### NFR-004 Privacy

- No analytics tracking in MVP.
- Data minimization and clear retention policy.

### NFR-005 Maintainability

- High-comment educational code style.
- Mandatory linting, formatting, and typed interfaces.

### NFR-006 Reliability

- Graceful failure for API/network errors.
- User-friendly retry states.

### NFR-007 Portability

- Deployable on Cloudflare platform stack.

## 5. External Interface Requirements

### 5.1 User Interface

- Responsive layout for mobile/desktop/tablet.
- Theme options and accessibility controls.

### 5.2 Software Interfaces

- Cloudflare D1 for puzzle metadata/state extensions.
- Cloudflare Functions for backend services.
- Cloudflare Pages for frontend deployment.

## 6. Quality Gates for Puzzle Generation

- G1: Puzzle must be solvable.
- G2: Puzzle must have unique accepted target solution set.
- G3: Clues must map to approved word list entries.
- G4: Difficulty rating must be assigned.
- G5: Family mode filter must pass for child-safe pools.

## 7. Future Requirements (Phase 2+)

- Account authentication (Google/Apple/Email).
- Global leaderboard with anti-cheat enhancement.
- Multiplayer versus race mode.
- Authoring tools for puzzle editors.
