'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState, type TouchEventHandler } from 'react';
import {
  buildPuzzle,
  createImageToken,
  swapTiles,
  isSolved,
  type ContentProfile,
  type GamePuzzle,
  type Language,
  type Tile
} from '@/lib/game';

type Difficulty = 'relaxed' | 'balanced' | 'challenge';
type ClueOrientation = 'across' | 'down';

type Dictionary = Record<Language, Record<string, string>>;

type Settings = {
  language: Language;
  size: 5 | 7 | 9;
  difficulty: Difficulty;
  profile: ContentProfile;
  failAtZero: boolean;
  continueAtZero: boolean;
  useBlockedCells: boolean;
};

const SETTINGS_KEY = 'swappuzzle-settings-v1';
const boardSizes: Array<5 | 7 | 9> = [5, 7, 9];
const BLOCKED_5X5_CELLS = [0, 4, 20] as const; // top-left, top-right, bottom-left

const defaultSettings: Settings = {
  language: 'en',
  size: 5,
  difficulty: 'balanced',
  profile: 'family',
  failAtZero: true,
  continueAtZero: false,
  useBlockedCells: false
};

const copy: Dictionary = {
  en: {
    title: 'SwapPuzzle',
    language: 'Language',
    board: 'Board Size',
    difficulty: 'Difficulty',
    start: 'Start Puzzle',
    swapsLeft: 'Swaps left',
    solved: 'Solved! 🎉',
    gameOver: 'No swaps left. Puzzle failed.',
    nextClue: 'Next clue',
    prevClue: 'Previous clue',
    leaderboard: 'Local best score',
    profile: 'Profile',
    failAtZero: 'Lose at zero swaps',
    continueAtZero: 'Allow continue at zero',
    settings: 'Settings',
    blocked: 'Use blocked cells',
    openSettings: 'Open settings',
    clue: 'Clue',
    overlayTitle: 'Game Setup',
    close: 'Close',
    standard: 'Standard',
    family: 'Family',
    kid: 'Kid',
    on: 'ON',
    off: 'OFF',
    across: 'Across',
    down: 'Down'
  },
  de: {
    title: 'SwapPuzzle',
    language: 'Sprache',
    board: 'Rastergröße',
    difficulty: 'Schwierigkeit',
    start: 'Rätsel starten',
    swapsLeft: 'Verbleibende Züge',
    solved: 'Gelöst! 🎉',
    gameOver: 'Keine Züge mehr. Runde verloren.',
    nextClue: 'Nächster Hinweis',
    prevClue: 'Voriger Hinweis',
    leaderboard: 'Lokale Bestpunktzahl',
    profile: 'Profil',
    failAtZero: 'Bei 0 Zügen verlieren',
    continueAtZero: 'Bei 0 Zügen fortsetzen',
    settings: 'Einstellungen',
    blocked: 'Gesperrte Felder nutzen',
    openSettings: 'Einstellungen öffnen',
    clue: 'Hinweis',
    overlayTitle: 'Spiel-Setup',
    close: 'Schließen',
    standard: 'Standard',
    family: 'Familie',
    kid: 'Kids',
    on: 'AN',
    off: 'AUS',
    across: 'Waagrecht',
    down: 'Senkrecht'
  },
  fr: {
    title: 'SwapPuzzle',
    language: 'Langue',
    board: 'Taille de grille',
    difficulty: 'Difficulté',
    start: 'Démarrer',
    swapsLeft: 'Échanges restants',
    solved: 'Résolu ! 🎉',
    gameOver: 'Plus d’échanges. Partie perdue.',
    nextClue: 'Indice suivant',
    prevClue: 'Indice précédent',
    leaderboard: 'Meilleur score local',
    profile: 'Profil',
    failAtZero: 'Perdre à zéro',
    continueAtZero: 'Continuer à zéro',
    settings: 'Paramètres',
    blocked: 'Utiliser des cases bloquées',
    openSettings: 'Ouvrir les paramètres',
    clue: 'Indice',
    overlayTitle: 'Configuration',
    close: 'Fermer',
    standard: 'Standard',
    family: 'Famille',
    kid: 'Enfant',
    on: 'ON',
    off: 'OFF',
    across: 'Horizontal',
    down: 'Vertical'
  },
  es: {
    title: 'SwapPuzzle',
    language: 'Idioma',
    board: 'Tamaño',
    difficulty: 'Dificultad',
    start: 'Empezar',
    swapsLeft: 'Intercambios',
    solved: '¡Resuelto! 🎉',
    gameOver: 'Sin intercambios. Perdiste.',
    nextClue: 'Siguiente pista',
    prevClue: 'Pista anterior',
    leaderboard: 'Mejor puntuación',
    profile: 'Perfil',
    failAtZero: 'Perder en cero',
    continueAtZero: 'Continuar en cero',
    settings: 'Opciones',
    blocked: 'Usar celdas bloqueadas',
    openSettings: 'Abrir opciones',
    clue: 'Pista',
    overlayTitle: 'Configuración',
    close: 'Cerrar',
    standard: 'Estándar',
    family: 'Familia',
    kid: 'Niños',
    on: 'ON',
    off: 'OFF',
    across: 'Horizontal',
    down: 'Vertical'
  }
};

function swapsForDifficulty(difficulty: Difficulty, size: number): number {
  if (difficulty === 'relaxed') return 999;
  if (difficulty === 'balanced') return size * size * 2;
  return size * size;
}

function blockedIndexes(size: number, enabled: boolean): Set<number> {
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

function pickImageCells(total: number, blocked: Set<number>): Set<number> {
  const valid = Array.from({ length: total }, (_, idx) => idx).filter((idx) => !blocked.has(idx));
  const needed = Math.max(1, Math.floor(valid.length * 0.18));
  const chosen = new Set<number>();

  while (chosen.size < needed && chosen.size < valid.length) {
    const next = valid[Math.floor(Math.random() * valid.length)];
    chosen.add(next);
  }

  return chosen;
}

type StartInfo = {
  number: number;
  acrossIndex: number | null;
  downIndex: number | null;
};

function buildStartMap(size: number, blocked: Set<number>): Map<number, StartInfo> {
  const map = new Map<number, StartInfo>();
  let clueNo = 1;
  let acrossIdx = 0;
  let downIdx = 0;

  for (let idx = 0; idx < size * size; idx += 1) {
    if (blocked.has(idx)) continue;
    const row = Math.floor(idx / size);
    const col = idx % size;
    const isAcrossStart = col === 0 || blocked.has(idx - 1);
    const isDownStart = row === 0 || blocked.has(idx - size);

    const acrossLength = isAcrossStart
      ? (() => {
          let len = 0;
          for (let c = col; c < size && !blocked.has(row * size + c); c += 1) len += 1;
          return len;
        })()
      : 0;
    const downLength = isDownStart
      ? (() => {
          let len = 0;
          for (let r = row; r < size && !blocked.has(r * size + col); r += 1) len += 1;
          return len;
        })()
      : 0;

    const includeAcross = isAcrossStart && acrossLength > 1;
    const includeDown = isDownStart && downLength > 1;
    if (!includeAcross && !includeDown) continue;

    map.set(idx, {
      number: clueNo,
      acrossIndex: includeAcross ? acrossIdx : null,
      downIndex: includeDown ? downIdx : null
    });

    clueNo += 1;
    if (includeAcross) acrossIdx += 1;
    if (includeDown) downIdx += 1;
  }

  return map;
}

function stripProfilePrefix(clue: string): string {
  return clue.replace(/^\[[^\]]+\]\s*/u, "");
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
  const [imageCells, setImageCells] = useState<Set<number>>(new Set([0]));
  const [dragPreferred, setDragPreferred] = useState(false);

  const t = copy[settings.language];
  const blocked = useMemo(() => blockedIndexes(settings.size, settings.useBlockedCells), [settings.size, settings.useBlockedCells]);
  const startMap = useMemo(() => buildStartMap(settings.size, blocked), [settings.size, blocked]);

  const solved = useMemo(() => isSolved(tiles, puzzle.solutionTiles, blocked), [blocked, puzzle.solutionTiles, tiles]);

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
    if (!showSettings) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showSettings]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const update = () => setDragPreferred(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

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

  const resetBoardState = (nextTiles: Tile[]) => {
    setTiles(nextTiles);
    setSelectedTile(null);
    setDragTile(null);
    setSwapsLeft(swapsForDifficulty(settings.difficulty, settings.size));
    setActiveClueOrientation('across');
    setActiveClueIndex(0);
    setImageCells(pickImageCells(nextTiles.length, blocked));
  };

  const startNewPuzzle = async () => {
    setLoading(true);
    setGameOver(false);
    try {
      const response = await fetch(`/api/puzzle?lang=${settings.language}&size=${settings.size}&profile=${settings.profile}`);
      const next = (await response.json()) as GamePuzzle;
      setPuzzle(next);
      resetBoardState(next.shuffledTiles);
    } catch {
      const fallback = buildPuzzle(settings.language, settings.size, settings.profile);
      setPuzzle(fallback);
      resetBoardState(fallback.shuffledTiles);
    } finally {
      setLoading(false);
      setShowSettings(false);
    }
  };

  useEffect(() => {
    setImageCells(pickImageCells(tiles.length, blocked));
  }, [tiles.length, blocked]);

  const canPlay = !gameOver && !solved && (settings.difficulty === 'relaxed' || swapsLeft > 0 || settings.continueAtZero);

  const isLocked = (index: number): boolean => !blocked.has(index) && tiles[index]?.value === puzzle.solutionTiles[index]?.value;

  const executeSwap = (from: number, to: number) => {
    if (!canPlay || from === to) return;
    if (blocked.has(from) || blocked.has(to)) return;
    if (isLocked(from) || isLocked(to)) return;

    const nextTiles = swapTiles(tiles, from, to);
    setTiles(nextTiles);
    setSelectedTile(null);

    if (settings.difficulty !== 'relaxed') {
      setSwapsLeft((prev) => prev - 1);
    }
  };

  const setClueFromCell = (index: number) => {
    const startInfo = startMap.get(index);
    if (!startInfo) return;

    if (startInfo.acrossIndex !== null && startInfo.downIndex !== null) {
      if (activeClueIndex === startInfo.acrossIndex && activeClueOrientation === 'across') {
        setActiveClueOrientation('down');
        setActiveClueIndex(startInfo.downIndex);
      } else {
        setActiveClueOrientation('across');
        setActiveClueIndex(startInfo.acrossIndex);
      }
      return;
    }

    if (startInfo.acrossIndex !== null) {
      setActiveClueOrientation('across');
      setActiveClueIndex(startInfo.acrossIndex);
      return;
    }

    if (startInfo.downIndex !== null) {
      setActiveClueOrientation('down');
      setActiveClueIndex(startInfo.downIndex);
    }
  };

  const onTileClick = (index: number) => {
    if (blocked.has(index)) return;

    setClueFromCell(index);

    if (!canPlay || isLocked(index) || dragPreferred) return;

    if (selectedTile === index) {
      setSelectedTile(null);
      return;
    }

    if (selectedTile === null) {
      setSelectedTile(index);
      return;
    }

    executeSwap(selectedTile, index);
  };

  const handleTouchStart = (index: number) => {
    if (!blocked.has(index) && !isLocked(index)) {
      setDragTile(index);
      return;
    }
    setDragTile(null);
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

  const clueList = useMemo(
    () => (activeClueOrientation === 'across' ? puzzle.acrossClues : puzzle.downClues),
    [activeClueOrientation, puzzle.acrossClues, puzzle.downClues]
  );
  const safeClueIndex = useMemo(
    () => (clueList.length > 0 ? Math.min(activeClueIndex, clueList.length - 1) : 0),
    [activeClueIndex, clueList]
  );

  const cycleClue = (direction: -1 | 1) => {
    if (clueList.length === 0) return;
    setActiveClueIndex((prev) => (prev + direction + clueList.length) % clueList.length);
  };

  const clueNumbers = useMemo(() => {
    const across: number[] = [];
    const down: number[] = [];

    for (const info of startMap.values()) {
      if (info.acrossIndex !== null) across[info.acrossIndex] = info.number;
      if (info.downIndex !== null) down[info.downIndex] = info.number;
    }

    return { across, down };
  }, [startMap]);

  const activeClueNumber =
    activeClueOrientation === 'across'
      ? clueNumbers.across[safeClueIndex] ?? safeClueIndex + 1
      : clueNumbers.down[safeClueIndex] ?? safeClueIndex + 1;

  const activeClueText = stripProfilePrefix(clueList[safeClueIndex] ?? '—');

  const selectPreviousClue = () => cycleClue(-1);
  const selectNextClue = () => cycleClue(1);

  return (
    <main>
      <header className="topbar hero">
        <h1>{t.title}</h1>
        <button type="button" className="gear" onClick={() => setShowSettings(true)} aria-label={t.openSettings}>
          <span className="gear-icon" aria-hidden="true">⚙️</span>
        </button>
      </header>

      {showSettings ? (
        <section className="overlay" role="dialog" aria-modal="true" aria-label={t.overlayTitle}>
          <article className="panel controls premium">
            <div className="overlay-head">
              <h2>{t.overlayTitle}</h2>
              <button type="button" className="close" onClick={() => setShowSettings(false)} aria-label={t.close}>
                ✕
              </button>
            </div>

            <div className="flag-group">
              <span>{t.language}</span>
              <div className="chip-row">
                <button type="button" className={`chip ${settings.language === 'en' ? 'active' : ''}`} onClick={() => setSettings((p) => ({ ...p, language: 'en' }))}>🇬🇧</button>
                <button type="button" className={`chip ${settings.language === 'de' ? 'active' : ''}`} onClick={() => setSettings((p) => ({ ...p, language: 'de' }))}>🇩🇪</button>
                <button type="button" className={`chip ${settings.language === 'fr' ? 'active' : ''}`} onClick={() => setSettings((p) => ({ ...p, language: 'fr' }))}>🇫🇷</button>
                <button type="button" className={`chip ${settings.language === 'es' ? 'active' : ''}`} onClick={() => setSettings((p) => ({ ...p, language: 'es' }))}>🇪🇸</button>
              </div>
            </div>

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

            <div className="flag-group">
              <span>{t.difficulty}</span>
              <div className="chip-row">
                {(['relaxed', 'balanced', 'challenge'] as const).map((d) => (
                  <button key={d} type="button" className={`chip text ${settings.difficulty === d ? 'active' : ''}`} onClick={() => setSettings((p) => ({ ...p, difficulty: d }))}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="profiles">
              <button type="button" className={`profile-card ${settings.profile === 'standard' ? 'active' : ''}`} onClick={() => setSettings((p) => ({ ...p, profile: 'standard' }))}>
                <span>🎯</span>
                <strong>{t.standard}</strong>
              </button>
              <button type="button" className={`profile-card ${settings.profile === 'family' ? 'active' : ''}`} onClick={() => setSettings((p) => ({ ...p, profile: 'family' }))}>
                <span>🧩</span>
                <strong>{t.family}</strong>
              </button>
              <button type="button" className={`profile-card ${settings.profile === 'kid' ? 'active' : ''}`} onClick={() => setSettings((p) => ({ ...p, profile: 'kid' }))}>
                <span>🧸</span>
                <strong>{t.kid}</strong>
              </button>
            </div>

            <div className="toggles">
              <div className="switch-row">
                <span>{t.failAtZero}</span>
                <button type="button" className={`switch ${settings.failAtZero ? 'on' : 'off'}`} onClick={() => setSettings((p) => ({ ...p, failAtZero: !p.failAtZero }))}>
                  <span className="switch-state">{settings.failAtZero ? t.on : t.off}</span>
                  <span className="switch-knob" aria-hidden="true" />
                </button>
              </div>
              <div className="switch-row">
                <span>{t.continueAtZero}</span>
                <button type="button" className={`switch ${settings.continueAtZero ? 'on' : 'off'}`} onClick={() => setSettings((p) => ({ ...p, continueAtZero: !p.continueAtZero }))}>
                  <span className="switch-state">{settings.continueAtZero ? t.on : t.off}</span>
                  <span className="switch-knob" aria-hidden="true" />
                </button>
              </div>
              <div className="switch-row">
                <span>{t.blocked}</span>
                <button type="button" className={`switch ${settings.useBlockedCells ? 'on' : 'off'}`} onClick={() => setSettings((p) => ({ ...p, useBlockedCells: !p.useBlockedCells }))}>
                  <span className="switch-state">{settings.useBlockedCells ? t.on : t.off}</span>
                  <span className="switch-knob" aria-hidden="true" />
                </button>
              </div>
            </div>

            <button type="button" className="start" onClick={startNewPuzzle}>
              {loading ? 'Loading...' : t.start}
            </button>
          </article>
        </section>
      ) : null}

      <section className="panel board-panel">
        <p className="status">
          {t.swapsLeft}: {settings.difficulty === 'relaxed' ? '∞' : swapsLeft}
        </p>
        {solved ? <p className="status success">{t.solved}</p> : null}
        {gameOver ? <p className="status danger">{t.gameOver}</p> : null}

        <div className="board" style={{ gridTemplateColumns: `repeat(${settings.size}, 56px)` }}>
          {tiles.map((tile, index) => {
            const startInfo = startMap.get(index);
            const isBlocked = blocked.has(index);
            const isCorrect = !isBlocked && tile.value === puzzle.solutionTiles[index]?.value;
            const showAsImage = !isBlocked && imageCells.has(index);

            return (
              <button
                type="button"
                data-tile-index={index}
                className={`tile ${!dragPreferred && selectedTile === index ? 'selected' : ''} ${isCorrect ? 'correct locked' : ''} ${isBlocked ? 'blocked' : ''}`}
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
                draggable={dragPreferred && !isBlocked && !isCorrect}
                key={`${tile.id}-${index}`}
                aria-label={`Tile ${index + 1}`}
                disabled={isBlocked}
              >
                {startInfo ? <span className="clue-badge">{startInfo.number}</span> : null}
                {isBlocked ? null : showAsImage ? (
                  <Image src={createImageToken(tile.value)} alt={`Token ${tile.value}`} width={56} height={56} unoptimized />
                ) : (
                  tile.value
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel clue-panel">
        <h2>
          {t.clue} {activeClueNumber} · {activeClueOrientation === 'across' ? t.across : t.down}
        </h2>
        <div className="clue-controls">
          <button className="secondary" type="button" onClick={selectPreviousClue}>
            {t.prevClue}
          </button>
          <p className="clue-text">{activeClueText}</p>
          <button className="secondary" type="button" onClick={selectNextClue}>
            {t.nextClue}
          </button>
        </div>
      </section>

      <section className="panel" style={{ marginTop: '1rem' }}>
        <strong>
          {t.leaderboard}: {bestScore}
        </strong>
        <p style={{ marginBottom: 0 }}>
          Mode: {settings.difficulty} · mixed-media
        </p>
      </section>
    </main>
  );
}
