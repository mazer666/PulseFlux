# SwapPuzzle

SwapPuzzle is a multilingual web puzzle game prototype where players solve a board by swapping any two tiles.

## Current MVP Implementation

- Next.js + TypeScript frontend.
- API route for puzzle generation (`/api/puzzle`).
- Multiple board sizes: 5x5, 7x7, 9x9.
- Tile modes: letters and image tiles.
- Across/down clue panels with rotating hints.
- Local best-score storage.
- Language options: EN/DE/FR/ES.
- CI workflow (lint, test, build).

## Local Development

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## Quality Checks

```bash
npm run lint
npm run test
npm run build
```
