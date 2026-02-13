# UX Specification

## 1. UX Principles

1. Mobile-first clarity.
2. Immediate understanding of interactions.
3. Low friction for casual players.
4. Flexible challenge through options.
5. Accessibility by default.

## 2. Core Screens (MVP)

1. Landing/Home
2. Start Overlay (Mode & Options)
3. Puzzle Board Screen
4. In-Game Options Panel (opened via gear icon)
5. Result Screen (Win/Lose)
6. Local Leaderboard Screen
7. Language/Profile Selector

## 3. Primary User Flow

1. Open game.
2. Start Overlay opens above the board (mode/options, language, profile, difficulty, board size).
3. Confirm Start in overlay.
4. Puzzle begins.
5. Swap tiles, browse clues, use fixed hints.
6. Complete puzzle and view score/win animation.
7. Save local result and optionally replay.

## 4. Interaction Design Requirements

- Options are reachable only via a gear button (top-level settings entry point).
- On app launch, options are presented as an overlay before gameplay starts.
- Touch-first: drag tile A onto tile B to swap.
- Fallback: tap tile A + tap tile B to swap.
- A move is counted only when a swap completes; tile selection alone does not consume a move.
- Selected clue highlights corresponding board cells.
- Clue panel supports across/down navigation.
- Tapping the same clue start cell again toggles horizontal/vertical clue orientation.
- Hint button tied to clue context; cannot be purchased/refilled.
- Swap limit status visible when applicable.
- Board layouts may include inactive/blocked cells (visualized clearly as non-playable).
- Correctly placed tiles use a positive success state (color + border/icon support).

## 5. Accessibility Requirements

- WCAG 2.1 AA as design acceptance target.
- Full color contrast compliance for text and controls.
- Keyboard controls for tile and clue navigation.
- Screen reader labels for all actions and clue states.
- Motion sensitivity support (reduced motion option), excluding mandatory win confirmation effect (must still have accessible fallback).

## 6. Visual Design Requirements

- Inspired by provided sample, but improved polish and clarity.
- Theme options available (light/dark/playful/high-contrast).
- Family/Kid profile can switch to softer color and icon presets.
- Win animation is mandatory and delight-focused.
- Clues should allow tonal variety: clear clues plus occasional funny/wordplay clues.

### Suggested accessible color baseline (first pass)
- Background: `#F4F3EF`
- Primary action: `#1F6FEB`
- Accent/selection: `#00A7C4`
- Correct tile: `#6EEB34` with dark text `#111827`
- Blocked cell: `#111827`
- Error/invalid: `#D92D20`

Note: final palette must be contrast-verified (WCAG 2.1 AA) per component state.

## 7. Error and Empty States

- Network unavailable: show retry and local-only mode messaging.
- Puzzle load failure: regenerate option with clear explanation.
- Invalid state detected: safe reset with confirmation prompt.

## 8. UX Metrics

- First puzzle completion rate.
- Input error frequency (wrong taps, mis-swaps).
- Session duration and replay rate (stored locally in MVP if implemented without tracking transmission).
