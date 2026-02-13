# Accessibility Audit Checklist (WCAG 2.1 AA baseline)

- [x] Interactive controls are keyboard reachable.
- [x] Toggle controls expose pressed state (`aria-pressed`).
- [x] Board exposes grid semantics (`role=grid` + `role=gridcell`).
- [x] Game status updates use live regions (`aria-live`).
- [x] Non-text content has alt text labels.
- [x] Overlay can be dismissed with Escape.
- [x] Focus order is logical in setup and clue controls.
- [ ] Automated axe check in CI (future enhancement).
