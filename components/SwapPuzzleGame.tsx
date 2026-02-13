'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState, type TouchEventHandler } from 'react';
import {
  buildPuzzle,
  createImageToken,
  swapTiles,
  type ContentProfile,
  type GamePuzzle,
  type Language,
  type Tile,
  type TileMode
} from '@/lib/game';

type Difficulty = 'relaxed' | 'balanced' | 'challenge';
type ClueOrientation = 'across' | 'down';

type Dictionary = Record<Language, Record<string, string>>;

type Settings = {
  language: Language;
  size: 5 | 7 | 9;
  tileMode: TileMode;
  difficulty: Difficulty;
  profile: ContentProfile;
  failAtZero: boolean;
  continueAtZero: boolean;
  useBlockedCells: boolean;
};

const SETTINGS_KEY = 'swappuzzle-settings-v1';

const defaultSettings: Settings = {
  language: 'en',
  size: 5,
  tileMode: 'letters',
  difficulty: 'balanced',
  profile: 'family',
  failAtZero: true,
  continueAtZero: false,
  useBlockedCells: true
};

const copy: Dictionary = {
  en: {
    title: 'SwapPuzzle MVP',
    language: 'Language',
    board: 'Board Size',
    mode: 'Tile Mode',
    difficulty: 'Difficulty',
    start: 'Start Puzzle',
    swapsLeft: 'Swaps left',
    solved: 'Solved! 🎉',
    gameOver: 'No swaps left. Puzzle failed.',
    hint: 'Hint',
    nextClue: 'Next clue',
    leaderboard: 'Local best score',
    profile: 'Profile',
    failAtZero: 'Lose when swaps reach zero',
    continueAtZero: 'Allow continue after zero swaps',
    settings: 'Settings',
    blocked: 'Use blocked cells (some board fields disabled)',
    openSettings: 'Open settings',
    clue: 'Clue',
    overlayTitle: 'Game Setup'
  },
  de: {
    title: 'SwapPuzzle MVP',
    language: 'Sprache',
    board: 'Rastergröße',
    mode: 'Kacheltyp',
    difficulty: 'Schwierigkeit',
    start: 'Rätsel starten',
    swapsLeft: 'Verbleibende Züge',
    solved: 'Gelöst! 🎉',
    gameOver: 'Keine Züge mehr. Runde verloren.',
    hint: 'Tipp',
    nextClue: 'Nächster Hinweis',
    leaderboard: 'Lokale Bestpunktzahl',
    profile: 'Profil',
    failAtZero: 'Bei 0 Zügen verlieren',
    continueAtZero: 'Nach 0 Zügen weiterspielen',
    settings: 'Einstellungen',
    blocked: 'Gesperrte Felder verwenden',
    openSettings: 'Einstellungen öffnen',
    clue: 'Hinweis',
    overlayTitle: 'Spiel-Setup'
  },
  fr: {
    title: 'SwapPuzzle MVP',
    language: 'Langue',
    board: 'Taille de grille',
    mode: 'Type de tuile',
    difficulty: 'Difficulté',
    start: 'Démarrer le puzzle',
    swapsLeft: 'Échanges restants',
    solved: 'Résolu ! 🎉',
    gameOver: 'Plus d’échanges. Partie perdue.',
    hint: 'Indice',
    nextClue: 'Indice suivant',
    leaderboard: 'Meilleur score local',
    profile: 'Profil',
    failAtZero: 'Perdre à zéro échange',
    continueAtZero: 'Continuer après zéro échange',
    settings: 'Paramètres',
    blocked: 'Utiliser des cases bloquées',
    openSettings: 'Ouvrir les paramètres',
    clue: 'Indice',
    overlayTitle: 'Configuration'
  },
  es: {
    title: 'SwapPuzzle MVP',
    language: 'Idioma',
    board: 'Tamaño del tablero',
    mode: 'Tipo de ficha',
    difficulty: 'Dificultad',
    start: 'Iniciar puzzle',
    swapsLeft: 'Intercambios restantes',
    solved: '¡Resuelto! 🎉',
    gameOver: 'Sin intercambios. Partida perdida.',
    hint: 'Pista',
    nextClue: 'Siguiente pista',
    leaderboard: 'Mejor puntuación local',
    profile: 'Perfil',
    failAtZero: 'Perder con cero intercambios',
    continueAtZero: 'Continuar después de cero',
    settings: 'Opciones',
    blocked: 'Usar celdas bloqueadas',
    openSettings: 'Abrir opciones',
    clue: 'Pista',
    overlayTitle: 'Configuración'
  }
};

const tileModeOptions: TileMode[] = ['letters', 'images'];
const boardSizes: Array<5 | 7 | 9> = [5, 7, 9];
const BLOCKED_5X5_CELLS = [0, 4, 20] as const; // top-left, top-right, bottom-left

function swapsForDifficulty(difficulty: Difficulty, size: number): number {
  if (difficulty === 'relaxed') return 999;
  if (difficulty === 'balanced') return size * size * 2;
  return size * size;
}

function blockedIndexes(size: number, enabled: boolean): Set<number> {
  // Blocked cells are currently only supported on 5x5 grids.
  if (!enabled || size !== 5) return new Set();
  return new Set(BLOCKED_5X5_CELLS);
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
  const [dragTile, setDragTile] = useState<number | null>(null);
  const [swapsLeft, setSwapsLeft] = useState(swapsForDifficulty(defaultSettings.difficulty, defaultSettings.size));
  const [bestScore, setBestScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [activeClueOrientation, setActiveClueOrientation] = useState<ClueOrientation>('across');
  const [activeClueIndex, setActiveClueIndex] = useState(0);

  const t = copy[settings.language];
  const blocked = useMemo(() => blockedIndexes(settings.size, settings.useBlockedCells), [settings.size, settings.useBlockedCells]);

  const solved = useMemo(
    () =>
      tiles.every((tile, index) => {
        if (blocked.has(index)) return true;
        return tile.value === puzzle.solutionTiles[index]?.value;
      }),
    [blocked, puzzle.solutionTiles, tiles]
  );

  useEffect(() => {
    const loaded = readSettings();
    setSettings(loaded);
    setBestScore(readBestScore(loaded.language));
    setSwapsLeft(swapsForDifficulty(loaded.difficulty, loaded.size));
    setShowSettings(true);
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
      const response = await fetch(`/api/puzzle?lang=${settings.language}&size=${settings.size}&profile=${settings.profile}`);
      const next = (await response.json()) as GamePuzzle;
      setPuzzle(next);
      setTiles(next.shuffledTiles);
    } catch {
      const fallback = buildPuzzle(settings.language, settings.size, settings.profile);
      setPuzzle(fallback);
      setTiles(fallback.shuffledTiles);
    } finally {
      setSelectedTile(null);
      setDragTile(null);
      setSwapsLeft(swapsForDifficulty(settings.difficulty, settings.size));
      setActiveClueOrientation('across');
      setActiveClueIndex(0);
      setLoading(false);
      setShowSettings(false);
    }
  };

  const canPlay = !gameOver && !solved && (settings.difficulty === 'relaxed' || swapsLeft > 0 || settings.continueAtZero);

  const executeSwap = (from: number, to: number) => {
    if (!canPlay) return;
    if (from === to) return;
    if (blocked.has(from) || blocked.has(to)) return;

    const nextTiles = swapTiles(tiles, from, to);
    setTiles(nextTiles);
    setSelectedTile(null);

    if (settings.difficulty !== 'relaxed') {
      setSwapsLeft((prev) => prev - 1);
    }
  };

  const onTileClick = (index: number) => {
    if (blocked.has(index)) return;

    const row = Math.floor(index / settings.size);
    const col = index % settings.size;
    const isStartAcross = col === 0;
    const isStartDown = row === 0;

    if (isStartAcross || isStartDown) {
      const hasBoth = isStartAcross && isStartDown;

      if (hasBoth && activeClueIndex === 0) {
        setActiveClueOrientation((prev) => (prev === 'across' ? 'down' : 'across'));
      } else if (isStartAcross) {
        setActiveClueOrientation('across');
        setActiveClueIndex(row);
      } else {
        setActiveClueOrientation('down');
        setActiveClueIndex(col);
      }
    }

    if (!canPlay) return;

    if (selectedTile === null) {
      setSelectedTile(index);
      return;
    }

    executeSwap(selectedTile, index);
  };

  const handleTouchStart = (index: number) => {
    if (!blocked.has(index)) {
      setDragTile(index);
    }
  };

  const handleTouchEnd: TouchEventHandler<HTMLButtonElement> = (event) => {
    if (dragTile === null) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const tileElement = target?.closest('[data-tile-index]') as HTMLElement | null;
    const to = Number(tileElement?.dataset.tileIndex);
    if (!Number.isNaN(to)) {
      executeSwap(dragTile, to);
    }
    setDragTile(null);
  };

  const clueList = activeClueOrientation === 'across' ? puzzle.acrossClues : puzzle.downClues;
  const safeClueIndex = Math.min(activeClueIndex, clueList.length - 1);

  const selectPreviousClue = () => {
    if (clueList.length === 0) return;
    setActiveClueIndex((prev) => (prev - 1 + clueList.length) % clueList.length);
  };

  const selectNextClue = () => {
    if (clueList.length === 0) return;
    setActiveClueIndex((prev) => (prev + 1) % clueList.length);
  };

  return (
    <main>
      <header className="topbar">
        <h1>{t.title}</h1>
        <button type="button" className="gear" onClick={() => setShowSettings(true)} aria-label={t.openSettings}>
          ⚙️
        </button>
      </header>

      {showSettings ? (
        <section className="overlay" role="dialog" aria-modal="true" aria-label={t.overlayTitle}>
          <article className="panel controls">
            <h2 style={{ margin: 0 }}>{t.overlayTitle}</h2>
            <label>
              {t.language}
              <select value={settings.language} onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value as Language }))}>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </label>

            <label>
              {t.board}
              <select value={settings.size} onChange={(e) => setSettings((prev) => ({ ...prev, size: Number(e.target.value) as 5 | 7 | 9 }))}>
                {boardSizes.map((boardSize) => (
                  <option key={boardSize} value={boardSize}>
                    {boardSize}x{boardSize}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t.mode}
              <select value={settings.tileMode} onChange={(e) => setSettings((prev) => ({ ...prev, tileMode: e.target.value as TileMode }))}>
                {tileModeOptions.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t.difficulty}
              <select value={settings.difficulty} onChange={(e) => setSettings((prev) => ({ ...prev, difficulty: e.target.value as Difficulty }))}>
                <option value="relaxed">Relaxed</option>
                <option value="balanced">Balanced</option>
                <option value="challenge">Challenge</option>
              </select>
            </label>

            <label>
              {t.profile}
              <select value={settings.profile} onChange={(e) => setSettings((prev) => ({ ...prev, profile: e.target.value as ContentProfile }))}>
                <option value="standard">standard</option>
                <option value="family">family</option>
                <option value="kid">kid</option>
              </select>
            </label>

            <label>
              {t.failAtZero}
              <select value={settings.failAtZero ? 'yes' : 'no'} onChange={(e) => setSettings((prev) => ({ ...prev, failAtZero: e.target.value === 'yes' }))}>
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

            <label>
              {t.blocked}
              <select
                value={settings.useBlockedCells ? 'yes' : 'no'}
                onChange={(e) => setSettings((prev) => ({ ...prev, useBlockedCells: e.target.value === 'yes' }))}
              >
                <option value="yes">yes</option>
                <option value="no">no</option>
              </select>
            </label>

            <button type="button" onClick={startNewPuzzle}>
              {loading ? 'Loading...' : t.start}
            </button>
          </article>
        </section>
      ) : null}

      <section className="panel">
        <p className="status">
          {t.swapsLeft}: {settings.difficulty === 'relaxed' ? '∞' : swapsLeft}
        </p>
        {solved ? <p className="status">{t.solved}</p> : null}
        {gameOver ? <p className="status">{t.gameOver}</p> : null}

        <div className="board" style={{ gridTemplateColumns: `repeat(${settings.size}, 48px)` }}>
          {tiles.map((tile, index) => {
            const row = Math.floor(index / settings.size);
            const col = index % settings.size;
            const isBlocked = blocked.has(index);
            const isCorrect = !isBlocked && tile.value === puzzle.solutionTiles[index]?.value;
            const clueNumber = row === 0 ? col + 1 : col === 0 ? row + 1 : null;

            return (
              <button
                type="button"
                data-tile-index={index}
                className={`tile ${selectedTile === index ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isBlocked ? 'blocked' : ''}`}
                onClick={() => onTileClick(index)}
                onDragStart={() => setDragTile(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragTile !== null) {
                    executeSwap(dragTile, index);
                    setDragTile(null);
                  }
                }}
                onTouchStart={() => handleTouchStart(index)}
                onTouchEnd={handleTouchEnd}
                draggable={!isBlocked}
                key={`${tile.id}-${index}`}
                aria-label={`Tile ${index + 1}`}
                disabled={isBlocked}
              >
                {clueNumber !== null ? <span className="clue-badge">{clueNumber}</span> : null}
                {isBlocked ? null : settings.tileMode === 'letters' ? (
                  tile.value
                ) : (
                  <Image src={createImageToken(tile.value)} alt={`Token ${tile.value}`} width={48} height={48} unoptimized />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel clue-panel">
        <h2>
          {t.clue} - {safeClueIndex + 1} {activeClueOrientation === 'across' ? 'Across' : 'Down'}
        </h2>
        <div className="clue-controls">
          <button className="secondary" type="button" onClick={selectPreviousClue}>
            ◀
          </button>
          <p>{clueList[safeClueIndex]}</p>
          <button className="secondary" type="button" onClick={selectNextClue}>
            ▶
          </button>
        </div>
        <button className="secondary" type="button" onClick={selectNextClue}>
          {t.nextClue}
        </button>
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
