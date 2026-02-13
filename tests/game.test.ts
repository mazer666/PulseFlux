import { describe, expect, it } from 'vitest';
import { buildPuzzle, getDatasetStats, isSolved, swapTiles } from '@/lib/game';

describe('game logic', () => {
  it('builds a puzzle with expected tile count for each board size', () => {
    expect(buildPuzzle('en', 5).shuffledTiles).toHaveLength(25);
    expect(buildPuzzle('en', 7).shuffledTiles).toHaveLength(49);
    expect(buildPuzzle('en', 9).shuffledTiles).toHaveLength(81);
  });

  it('swaps two tile positions', () => {
    const puzzle = buildPuzzle('en', 5);
    const original = puzzle.solutionTiles;
    const swapped = swapTiles(original, 0, 1);
    expect(swapped[0].value).toBe(original[1].value);
    expect(swapped[1].value).toBe(original[0].value);
  });

  it('detects solved puzzle', () => {
    const puzzle = buildPuzzle('en', 5);
    const unsolved = swapTiles(puzzle.solutionTiles, 0, 1);

    expect(isSolved(puzzle.solutionTiles, puzzle.solutionTiles)).toBe(true);
    expect(isSolved(unsolved, puzzle.solutionTiles)).toBe(false);
  });


  it('provides at least 5000 generated dataset entries per language and board size', () => {
    const stats = getDatasetStats();
    for (const lang of ['en', 'de', 'fr', 'es'] as const) {
      expect(stats[lang][5]).toBeGreaterThanOrEqual(5000);
      expect(stats[lang][7]).toBeGreaterThanOrEqual(5000);
      expect(stats[lang][9]).toBeGreaterThanOrEqual(5000);
    }
  });

});
