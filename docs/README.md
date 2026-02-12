# SwapPuzzle Documentation Hub

This folder contains the full planning and requirements package for the SwapPuzzle web game.

## Document Index

1. [Product Requirements Document (PRD)](./PRD.md)
2. [Software Requirements Specification (SRS)](./SRS.md)
3. [UX Specification](./UX_SPEC.md)
4. [Architecture Overview](./ARCHITECTURE.md)
5. [Architecture Decision Records (ADR)](./adr/)
6. [Security & Privacy Specification](./SECURITY_PRIVACY.md)
7. [Contributing Guide](./CONTRIBUTING.md)
8. [Code Style Guide](./CODE_STYLE_GUIDE.md)
9. [Testing Strategy](./TESTING_STRATEGY.md)
10. [Release Plan & Roadmap](./RELEASE_PLAN_ROADMAP.md)
11. [Task Tracker](./TASK_TRACKER.md)
12. [Cloudflare Deployment Guide](./CLOUDFLARE_DEPLOYMENT_GUIDE.md)

## Product Context Summary

- The game is web-based and inspired by the provided swap puzzle sample.
- Core gameplay: players swap any two tiles to solve word clues across and down.
- MVP supports both letter tiles and image tiles.
- MVP is mobile-first, accessibility-first, and open-source-ready.
- MVP includes EN/DE/FR/ES support for both UI and puzzle data.
- Cloud target: Cloudflare Pages + Functions + D1.

## Governance Rules

- All features must map to MVP or Phase 2 in the roadmap.
- All merged work must be traceable in `TASK_TRACKER.md`.
- `CHANGELOG.md` is mandatory for every release increment.
