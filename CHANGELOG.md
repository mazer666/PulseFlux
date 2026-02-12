# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows semantic-style release intent.

## [Unreleased]

### Added

- Comprehensive documentation baseline under `/docs`.
- Product Requirements Document (PRD).
- Software Requirements Specification (SRS).
- UX Specification.
- Architecture Overview and initial ADR.
- Security & Privacy Specification.
- Contributing guide and code style guide.
- Testing strategy and release roadmap.
- Task tracker for transparent delivery planning.
- Next.js + TypeScript playable MVP scaffold with swap-any-two board gameplay.
- API endpoint for puzzle generation with language and board-size options.
- Local leaderboard persistence in browser storage.
- Initial automated tests for core game logic.
- GitHub Actions CI workflow for lint/test/build.
- Root README with setup and quality-check instructions.
- Dependency-light repository test runner (`tests/run_tests.py`) to allow local test execution even when npm registry install is blocked.
- Gameplay settings now include fail-at-zero and continue-at-zero options with persisted local preferences.
- API and puzzle model now support content profiles (`standard`, `family`, `kid`) to prepare dataset separation.
