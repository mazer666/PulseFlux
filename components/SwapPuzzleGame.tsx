'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  buildPuzzle,
  createImageToken,
  isSolved,
  swapTiles,
  type ContentProfile,
  type GamePuzzle,
  type Language,
  type Tile,
  type TileMode
} from '@/lib/game';

type Difficulty = 'relaxed' | 'balanced' | 'challenge';

type Dictionary = Record<Language, Record<string, string>>;

type Settings = {
  language: Language;
  size: 5 | 7 | 9;
  tileMode: TileMode;
  difficulty: Difficulty;
  profile: ContentProfile;
  failAtZero: boolean;
  continueAtZero: boolean;
};

const SETTINGS_KEY = 'swappuzzle-settings-v1';

const defaultSettings: Settings = {
  language: 'en',
  size: 5,
  tileMode: 'letters',
  difficulty: 'balanced',
  profile: 'family',
  failAtZero: true,
  continueAtZero: false
};

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
    gameOver: 'No swaps left. Puzzle failed.',
    cluesAcross: 'Across clues',
    cluesDown: 'Down clues',
    hint: 'Hint',
    leaderboard: 'Local best score',
    profile: 'Profile',
    failAtZero: 'Lose when swaps reach zero',
    continueAtZero: 'Allow continue after zero swaps'
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
    gameOver: 'Keine Züge mehr. Runde verloren.',
    cluesAcross: 'Hinweise waagrecht',
    cluesDown: 'Hinweise senkrecht',
    hint: 'Tipp',
    leaderboard: 'Lokale Bestpunktzahl',
    profile: 'Profil',
    failAtZero: 'Bei 0 Zügen verlieren',
    continueAtZero: 'Nach 0 Zügen weiterspielen'
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
    gameOver: 'Plus d’échanges. Partie perdue.',
    cluesAcross: 'Indices horizontaux',
    cluesDown: 'Indices verticaux',
    hint: 'Indice',
    leaderboard: 'Meilleur score local',
    profile: 'Profil',
    failAtZero: 'Perdre à zéro échange',
    continueAtZero: 'Continuer après zéro échange'
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
    gameOver: 'Sin intercambios. Partida perdida.',
    cluesAcross: 'Pistas horizontales',
    cluesDown: 'Pistas verticales',
    hint: 'Pista',
    leaderboard: 'Mejor puntuación local',
    profile: 'Perfil',
    failAtZero: 'Perder con cero intercambios',
    continueAtZero: 'Continuar después de cero'
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

function readSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function SwapPuzzleGame() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [puzzle, setPuzzle] = useState<GamePuzzle>(() => buildPuzzle(defaultSettings.language, defaultSettings.size, defaultSettings.profile));
  const [tiles, setTiles] = useState<Tile[]>(puzzle.shuffledTiles);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [swapsLeft, setSwapsLeft] = useState(swapsForDifficulty(defaultSettings.difficulty, defaultSettings.size));
  const [acrossHintIndex, setAcrossHintIndex] = useState(0);
  const [downHintIndex, setDownHintIndex] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const t = copy[settings.language];
  const solved = useMemo(() => isSolved(tiles, puzzle.solutionTiles), [tiles, puzzle.solutionTiles]);

  useEffect(() => {
    const loaded = readSettings();
    setSettings(loaded);
    setBestScore(readBestScore(loaded.language));
    setSwapsLeft(swapsForDifficulty(loaded.difficulty, loaded.size));
  }, []);

  useEffect(() => {
    saveSettings(settings);
    setBestScore(readBestScore(settings.language));
  }, [settings]);

  useEffect(() => {
    if (!solved) return;
    const score = Math.max(0, swapsLeft) + settings.size * 50;
    saveBestScore(settings.language, score);
    setBestScore(readBestScore(settings.language));
  }, [solved, swapsLeft, settings.language, settings.size]);

  useEffect(() => {
    const shouldGameOver =
      !solved &&
      settings.difficulty !== 'relaxed' &&
      settings.failAtZero &&
      !settings.continueAtZero &&
      swapsLeft <= 0;
    setGameOver(shouldGameOver);
  }, [solved, settings.difficulty, settings.failAtZero, settings.continueAtZero, swapsLeft]);

  const startNewPuzzle = async () => {
    setLoading(true);
    setGameOver(false);
    try {
      const response = await fetch(
        `/api/puzzle?lang=${settings.language}&size=${settings.size}&profile=${settings.profile}`
      );
      const next = (await response.json()) as GamePuzzle;
      setPuzzle(next);
      setTiles(next.shuffledTiles);
    } catch {
      const fallback = buildPuzzle(settings.language, settings.size, settings.profile);
      setPuzzle(fallback);
      setTiles(fallback.shuffledTiles);
    } finally {
      setSelectedTile(null);
      setSwapsLeft(swapsForDifficulty(settings.difficulty, settings.size));
      setAcrossHintIndex(0);
      setDownHintIndex(0);
      setLoading(false);
    }
  };

  const onTileClick = (index: number) => {
    if (gameOver || solved) return;
    if (settings.difficulty !== 'relaxed' && swapsLeft <= 0 && !settings.continueAtZero) return;

    if (selectedTile === null) {
      setSelectedTile(index);
      return;
    }

    const nextTiles = swapTiles(tiles, selectedTile, index);
    setTiles(nextTiles);
    setSelectedTile(null);

    if (settings.difficulty !== 'relaxed') {
      setSwapsLeft((prev) => prev - 1);
    }
  };

  return (
    <main>
      <h1>{t.title}</h1>

      <section className="panel controls">
        <label>
          {t.language}
          <select
            value={settings.language}
            onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value as Language }))}
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </select>
        </label>

        <label>
          {t.board}
          <select
            value={settings.size}
            onChange={(e) => setSettings((prev) => ({ ...prev, size: Number(e.target.value) as 5 | 7 | 9 }))}
          >
            {boardSizes.map((boardSize) => (
              <option key={boardSize} value={boardSize}>
                {boardSize}x{boardSize}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t.mode}
          <select
            value={settings.tileMode}
            onChange={(e) => setSettings((prev) => ({ ...prev, tileMode: e.target.value as TileMode }))}
          >
            {tileModeOptions.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t.difficulty}
          <select
            value={settings.difficulty}
            onChange={(e) => setSettings((prev) => ({ ...prev, difficulty: e.target.value as Difficulty }))}
          >
            <option value="relaxed">Relaxed</option>
            <option value="balanced">Balanced</option>
            <option value="challenge">Challenge</option>
          </select>
        </label>

        <label>
          {t.profile}
          <select
            value={settings.profile}
            onChange={(e) => setSettings((prev) => ({ ...prev, profile: e.target.value as ContentProfile }))}
          >
            <option value="standard">standard</option>
            <option value="family">family</option>
            <option value="kid">kid</option>
          </select>
        </label>

        <label>
          {t.failAtZero}
          <select
            value={settings.failAtZero ? 'yes' : 'no'}
            onChange={(e) => setSettings((prev) => ({ ...prev, failAtZero: e.target.value === 'yes' }))}
          >
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </label>

        <label>
          {t.continueAtZero}
          <select
            value={settings.continueAtZero ? 'yes' : 'no'}
            onChange={(e) => setSettings((prev) => ({ ...prev, continueAtZero: e.target.value === 'yes' }))}
          >
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </label>

        <button type="button" onClick={startNewPuzzle}>
          {loading ? 'Loading...' : t.start}
        </button>
      </section>

      <section className="panel">
        <p className="status">
          {t.swapsLeft}: {settings.difficulty === 'relaxed' ? '∞' : swapsLeft}
        </p>
        {solved ? <p className="status">{t.solved}</p> : null}
        {gameOver ? <p className="status">{t.gameOver}</p> : null}

        <div className="board" style={{ gridTemplateColumns: `repeat(${settings.size}, 48px)` }}>
          {tiles.map((tile, index) => (
            <button
              type="button"
              className={`tile ${selectedTile === index ? 'selected' : ''}`}
              onClick={() => onTileClick(index)}
              key={`${tile.id}-${index}`}
              aria-label={`Tile ${index + 1}`}
            >
              {settings.tileMode === 'letters' ? (
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
          <button
            className="secondary"
            type="button"
            onClick={() => setAcrossHintIndex((prev) => (prev + 1) % puzzle.acrossClues.length)}
          >
            {t.hint}
          </button>
        </article>

        <article className="panel">
          <h2>{t.cluesDown}</h2>
          <p>{puzzle.downClues[downHintIndex]}</p>
          <button
            className="secondary"
            type="button"
            onClick={() => setDownHintIndex((prev) => (prev + 1) % puzzle.downClues.length)}
          >
            {t.hint}
          </button>
        </article>
      </section>

      <section className="panel" style={{ marginTop: '1rem' }}>
        <strong>
          {t.leaderboard}: {bestScore}
        </strong>
        <p style={{ marginBottom: 0 }}>
          Mode: {settings.difficulty} · {settings.profile} · {settings.tileMode}
        </p>
      </section>
    </main>
  );
}
