# Architecture Overview

## 1. MVP Technical Stack (Selected)

- **Frontend:** Next.js (App Router) + TypeScript.
- **Styling/UI:** Tailwind CSS + accessible component patterns.
- **State:** local component/store pattern for gameplay state.
- **Backend:** Cloudflare Functions for puzzle APIs.
- **Database:** Cloudflare D1 for puzzle metadata and future account-ready schema.
- **Deployment:** Cloudflare Pages (frontend) + Functions/D1 bindings.
- **CI/CD:** GitHub Actions for lint, tests, build, security scanning.

## 2. High-Level Components

1. **Web Client**
   - Renders board, options, clues, and result views.
   - Stores guest progress locally.
2. **Puzzle Service API**
   - Generates puzzle candidates.
   - Validates puzzle solvability and constraints.
3. **Content Layer**
   - Curated multilingual word/clue datasets.
   - Family-safe filtered subset.
4. **Persistence Layer**
   - D1 for puzzle catalog, metadata, and future migration path.

## 3. Data Domains

- `PuzzleTemplate`
- `PuzzleInstance`
- `Clue`
- `TileToken` (letter/image)
- `GameSessionLocal`
- `LocalLeaderboardEntry`
- `LanguagePack`
- `ContentSafetyProfile`

## 4. Security Controls (Architecture Level)

- API input schema validation.
- Server-side puzzle generation constraints.
- Basic endpoint rate limiting.
- Response hardening headers.
- Secret management via Cloudflare environment bindings.

## 5. Scalability Path

- Add account service and auth provider integration in Phase 2.
- Introduce global leaderboard services.
- Expand anti-cheat checks from rudimentary to behavior-based detection.

## 6. Delivery Architecture

- Feature branches + pull request checks.
- Protected main branch.
- Conventional release tagging.
