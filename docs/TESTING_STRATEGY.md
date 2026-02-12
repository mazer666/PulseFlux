# Testing Strategy

## 1. Testing Goals

- Ensure puzzle correctness and stability.
- Prevent regressions in gameplay and accessibility.
- Guarantee confidence for open-source contributions.

## 2. Test Pyramid

1. **Unit Tests**
   - Puzzle generation rules.
   - Swap logic and board state updates.
   - Score calculations.
2. **Integration Tests**
   - API endpoint behavior.
   - Data contract integrity between frontend and backend.
3. **End-to-End Tests**
   - Full solve flow on key device viewports.
   - Language switch and puzzle loading.
   - Accessibility smoke checks.

## 3. Mandatory Automated Checks in CI

- Lint
- Type check
- Unit/integration test suite
- E2E suite (headless)
- Dependency vulnerability scan
- Build verification

## 4. Accessibility Testing

- Automated checks in CI (axe or equivalent).
- Manual keyboard navigation checks for critical flows.
- Screen reader smoke test checklist per release.

## 5. Quality Gates for Release

- All CI checks green.
- No critical/high security findings unresolved.
- No blocker or critical gameplay bugs.
- Core user flow pass on mobile viewport.

## 6. "Best-in-Class" Practical Definition

For MVP acceptance, target:

- Robust puzzle validity checks.
- Stable interaction performance on mobile.
- Excellent usability for first-time players.
