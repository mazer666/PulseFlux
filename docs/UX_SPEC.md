# UX Specification

## 1. UX Principles

1. Mobile-first clarity.
2. Immediate understanding of interactions.
3. Low friction for casual players.
4. Flexible challenge through options.
5. Accessibility by default.

## 2. Core Screens (MVP)

1. Landing/Home
2. Mode & Options Selector
3. Puzzle Board Screen
4. Pause/Options Drawer
5. Result Screen (Win/Lose)
6. Local Leaderboard Screen
7. Language/Profile Selector

## 3. Primary User Flow

1. Open game.
2. Select language + profile (standard/family/kid).
3. Choose difficulty and board size.
4. Start puzzle.
5. Swap tiles, browse clues, use fixed hints.
6. Complete puzzle and view score/win animation.
7. Save local result and optionally replay.

## 4. Interaction Design Requirements

- Tap tile A + tile B to swap.
- Selected clue highlights corresponding board cells.
- Clue panel supports across/down navigation.
- Hint button tied to clue context; cannot be purchased/refilled.
- Swap limit status visible when applicable.

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

## 7. Error and Empty States

- Network unavailable: show retry and local-only mode messaging.
- Puzzle load failure: regenerate option with clear explanation.
- Invalid state detected: safe reset with confirmation prompt.

## 8. UX Metrics

- First puzzle completion rate.
- Input error frequency (wrong taps, mis-swaps).
- Session duration and replay rate (stored locally in MVP if implemented without tracking transmission).
