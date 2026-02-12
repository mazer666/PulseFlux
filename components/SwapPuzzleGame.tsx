'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  buildPuzzle,
  createImageToken,
  isSolved,
  swapTiles,
  type GamePuzzle,
  type Language,
  type Tile,
  type TileMode
} from '@/lib/game';

type Difficulty = 'relaxed' | 'balanced' | 'challenge';

type Dictionary = Record<Language, Record<string, string>>;

const copy: Dictionary = {
  en: {
    title: 'SwapPuzzle MVP',
    language: 'Language',
    board: 'Board Size',
    mode: 'Tile Mode',
    difficulty: 'Difficulty',
    start: 'New Puzzle',
    swapsLeft: 'Swaps left',
    solved: 'Solved! 🎉',
    cluesAcross: 'Across clues',
    cluesDown: 'Down clues',
    hint: 'Hint',
    leaderboard: 'Local best score',
    profile: 'Profile',
    family: 'Family-safe mode'
  },
  de: {
    title: 'SwapPuzzle MVP',
    language: 'Sprache',
    board: 'Rastergröße',
    mode: 'Kacheltyp',
    difficulty: 'Schwierigkeit',
    start: 'Neues Rätsel',
    swapsLeft: 'Verbleibende Züge',
    solved: 'Gelöst! 🎉',
    cluesAcross: 'Hinweise waagrecht',
    cluesDown: 'Hinweise senkrecht',
    hint: 'Tipp',
    leaderboard: 'Lokale Bestpunktzahl',
    profile: 'Profil',
    family: 'Familienmodus'
  },
  fr: {
    title: 'SwapPuzzle MVP',
    language: 'Langue',
    board: 'Taille de grille',
    mode: 'Type de tuile',
    difficulty: 'Difficulté',
    start: 'Nouveau puzzle',
    swapsLeft: 'Échanges restants',
    solved: 'Résolu ! 🎉',
    cluesAcross: 'Indices horizontaux',
    cluesDown: 'Indices verticaux',
    hint: 'Indice',
    leaderboard: 'Meilleur score local',
    profile: 'Profil',
    family: 'Mode famille'
  },
  es: {
    title: 'SwapPuzzle MVP',
    language: 'Idioma',
    board: 'Tamaño del tablero',
    mode: 'Tipo de ficha',
    difficulty: 'Dificultad',
    start: 'Nuevo puzzle',
    swapsLeft: 'Intercambios restantes',
    solved: '¡Resuelto! 🎉',
    cluesAcross: 'Pistas horizontales',
    cluesDown: 'Pistas verticales',
    hint: 'Pista',
    leaderboard: 'Mejor puntuación local',
    profile: 'Perfil',
    family: 'Modo familiar'
  }
};

const tileModeOptions: TileMode[] = ['letters', 'images'];
const boardSizes: Array<5 | 7 | 9> = [5, 7, 9];

function swapsForDifficulty(difficulty: Difficulty, size: number): number {
  if (difficulty === 'relaxed') return 999;
  if (difficulty === 'balanced') return size * size * 2;
  return size * size;
}

function saveBestScore(language: Language, score: number) {
  const key = `swappuzzle-best-${language}`;
  const existing = Number(localStorage.getItem(key) ?? 0);
  if (score > existing) {
    localStorage.setItem(key, String(score));
  }
}

function readBestScore(language: Language): number {
  return Number(localStorage.getItem(`swappuzzle-best-${language}`) ?? 0);
}

export function SwapPuzzleGame() {
  const [language, setLanguage] = useState<Language>('en');
  const [size, setSize] = useState<5 | 7 | 9>(5);
  const [tileMode, setTileMode] = useState<TileMode>('letters');
  const [difficulty, setDifficulty] = useState<Difficulty>('balanced');
  const [familyMode, setFamilyMode] = useState(true);
  const [puzzle, setPuzzle] = useState<GamePuzzle>(() => buildPuzzle('en', 5));
  const [tiles, setTiles] = useState<Tile[]>(puzzle.shuffledTiles);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [swapsLeft, setSwapsLeft] = useState(swapsForDifficulty('balanced', 5));
  const [acrossHintIndex, setAcrossHintIndex] = useState(0);
  const [downHintIndex, setDownHintIndex] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const t = copy[language];

  const solved = useMemo(() => isSolved(tiles, puzzle.solutionTiles), [tiles, puzzle.solutionTiles]);

  useEffect(() => {
    setBestScore(readBestScore(language));
  }, [language]);

  useEffect(() => {
    if (!solved) return;
    const score = Math.max(0, swapsLeft) + size * 50;
    saveBestScore(language, score);
    setBestScore(readBestScore(language));
  }, [solved, swapsLeft, size, language]);

  const startNewPuzzle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/puzzle?lang=${language}&size=${size}`);
      const next = (await response.json()) as GamePuzzle;
      setPuzzle(next);
      setTiles(next.shuffledTiles);
    } catch (_error) {
      // If API is unavailable, we gracefully fall back to local generation so the game remains playable.
      const fallback = buildPuzzle(language, size);
      setPuzzle(fallback);
      setTiles(fallback.shuffledTiles);
    } finally {
      setSelectedTile(null);
      setSwapsLeft(swapsForDifficulty(difficulty, size));
      setAcrossHintIndex(0);
      setDownHintIndex(0);
      setLoading(false);
    }
  };

  const onTileClick = (index: number) => {
    if (swapsLeft <= 0 || solved) return;
    if (selectedTile === null) {
      setSelectedTile(index);
      return;
    }
    const nextTiles = swapTiles(tiles, selectedTile, index);
    setTiles(nextTiles);
    setSelectedTile(null);
    setSwapsLeft((prev) => prev - 1);
  };

  return (
    <main>
      <h1>{t.title}</h1>
      <section className="panel controls">
        <label>
          {t.language}
          <select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </select>
        </label>

        <label>
          {t.board}
          <select value={size} onChange={(e) => setSize(Number(e.target.value) as 5 | 7 | 9)}>
            {boardSizes.map((boardSize) => (
              <option key={boardSize} value={boardSize}>
                {boardSize}x{boardSize}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t.mode}
          <select value={tileMode} onChange={(e) => setTileMode(e.target.value as TileMode)}>
            {tileModeOptions.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t.difficulty}
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
            <option value="relaxed">Relaxed</option>
            <option value="balanced">Balanced</option>
            <option value="challenge">Challenge</option>
          </select>
        </label>

        <label>
          {t.profile}
          <select value={familyMode ? 'family' : 'open'} onChange={(e) => setFamilyMode(e.target.value === 'family')}>
            <option value="family">{t.family}</option>
            <option value="open">Standard</option>
          </select>
        </label>

        <button type="button" onClick={startNewPuzzle}>
          {loading ? 'Loading...' : t.start}
        </button>
      </section>

      <section className="panel">
        <p className="status">{t.swapsLeft}: {difficulty === 'relaxed' ? '∞' : swapsLeft}</p>
        {solved ? <p className="status">{t.solved}</p> : null}
        {!solved && swapsLeft <= 0 && difficulty !== 'relaxed' ? <p className="status">No swaps left.</p> : null}

        <div className="board" style={{ gridTemplateColumns: `repeat(${size}, 48px)` }}>
          {tiles.map((tile, index) => (
            <button
              type="button"
              className={`tile ${selectedTile === index ? 'selected' : ''}`}
              onClick={() => onTileClick(index)}
              key={`${tile.id}-${index}`}
              aria-label={`Tile ${index + 1}`}
            >
              {tileMode === 'letters' ? (
                tile.value
              ) : (
                <Image
                  src={createImageToken(tile.value)}
                  alt={`Token ${tile.value}`}
                  width={48}
                  height={48}
                  unoptimized
                />
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="grid2">
        <article className="panel">
          <h2>{t.cluesAcross}</h2>
          <p>{puzzle.acrossClues[acrossHintIndex]}</p>
          <button className="secondary" type="button" onClick={() => setAcrossHintIndex((prev) => (prev + 1) % puzzle.acrossClues.length)}>
            {t.hint}
          </button>
        </article>

        <article className="panel">
          <h2>{t.cluesDown}</h2>
          <p>{puzzle.downClues[downHintIndex]}</p>
          <button className="secondary" type="button" onClick={() => setDownHintIndex((prev) => (prev + 1) % puzzle.downClues.length)}>
            {t.hint}
          </button>
        </article>
      </section>

      <section className="panel" style={{ marginTop: '1rem' }}>
        <strong>{t.leaderboard}: {bestScore}</strong>
        <p style={{ marginBottom: 0 }}>
          Mode: {difficulty} · {familyMode ? t.family : 'standard'}
        </p>
      </section>
    </main>
  );
}
