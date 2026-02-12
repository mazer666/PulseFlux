export type Language = 'en' | 'de' | 'fr' | 'es';
export type TileMode = 'letters' | 'images';
export type ContentProfile = 'standard' | 'family' | 'kid';

export type PuzzleSeed = {
  language: Language;
  size: 5 | 7 | 9;
  across: string[];
  acrossClues: string[];
  downClues: string[];
};

export type Tile = {
  id: string;
  value: string;
};

export type GamePuzzle = {
  language: Language;
  size: 5 | 7 | 9;
  profile: ContentProfile;
  acrossClues: string[];
  downClues: string[];
  solutionTiles: Tile[];
  shuffledTiles: Tile[];
};

const seedData: Record<Language, Record<5 | 7 | 9, PuzzleSeed>> = {
  en: {
    5: {
      language: 'en',
      size: 5,
      across: ['SATOR', 'AREPO', 'TENET', 'OPERA', 'ROTAS'],
      acrossClues: [
        'Ancient Latin palindrome, first row.',
        'Second row in the classic word square.',
        'A perfect palindrome word in the center.',
        'Fourth row from the same ancient square.',
        'Final row that completes the square.'
      ],
      downClues: ['Column 1 mirrors row 1.', 'Column 2 mirrors row 2.', 'Column 3 mirrors row 3.', 'Column 4 mirrors row 4.', 'Column 5 mirrors row 5.']
    },
    7: {
      language: 'en',
      size: 7,
      across: ['ALGEBRA', 'LANTERN', 'GARDENS', 'EARNEST', 'BRONZEY', 'RINSEUP', 'ANSWERS'],
      acrossClues: [
        'Math branch with symbols and equations.',
        'Portable source of light.',
        'Plural spaces for flowers and plants.',
        'Sincere and serious in intention.',
        'Having a bronze-like color or tone.',
        'Wash lightly and then continue.',
        'What players are trying to find.'
      ],
      downClues: ['Column clue 1.', 'Column clue 2.', 'Column clue 3.', 'Column clue 4.', 'Column clue 5.', 'Column clue 6.', 'Column clue 7.']
    },
    9: {
      language: 'en',
      size: 9,
      across: ['NOTEBOOKS', 'ORIGAMIST', 'TACTICALS', 'ELEVATION', 'BALANCEDS', 'OUTREACHY', 'OKTOBERFS', 'STATIONSX', 'SYNERGIES'],
      acrossClues: [
        'Plural paper companions for ideas.',
        'A person skilled in paper folding.',
        'Plural adjective for strategic actions.',
        'Height above a chosen reference point.',
        'In equilibrium; steady and fair.',
        'Action of extending help or contact.',
        'Autumn month with stylistic spelling.',
        'Places where trains can stop.',
        'Combined effects greater than individual parts.'
      ],
      downClues: ['Column clue 1.', 'Column clue 2.', 'Column clue 3.', 'Column clue 4.', 'Column clue 5.', 'Column clue 6.', 'Column clue 7.', 'Column clue 8.', 'Column clue 9.']
    }
  },
  de: {
    5: {
      language: 'de',
      size: 5,
      across: ['SATOR', 'AREPO', 'TENET', 'OPERA', 'ROTAS'],
      acrossClues: ['Lateinisches Wortquadrat Zeile 1.', 'Zeile 2 des klassischen Quadrats.', 'Palindrom in der Mitte.', 'Zeile 4 im Muster.', 'Abschlusszeile im Quadrat.'],
      downClues: ['Spalte 1.', 'Spalte 2.', 'Spalte 3.', 'Spalte 4.', 'Spalte 5.']
    },
    7: {
      language: 'de',
      size: 7,
      across: ['ALGEBRA', 'LANTERN', 'GARDENS', 'EARNEST', 'BRONZEY', 'RINSEUP', 'ANSWERS'],
      acrossClues: ['Mathebereich mit Symbolen.', 'Tragbare Lichtquelle.', 'Mehrzahl von Garten.', 'Aufrichtig und ernst.', 'Bronzefarben.', 'Leicht ausspülen.', 'Gesuchte Lösungen.'],
      downClues: ['Spalte 1.', 'Spalte 2.', 'Spalte 3.', 'Spalte 4.', 'Spalte 5.', 'Spalte 6.', 'Spalte 7.']
    },
    9: {
      language: 'de',
      size: 9,
      across: ['NOTEBOOKS', 'ORIGAMIST', 'TACTICALS', 'ELEVATION', 'BALANCEDS', 'OUTREACHY', 'OKTOBERFS', 'STATIONSX', 'SYNERGIES'],
      acrossClues: ['Notizbücher in Mehrzahl.', 'Jemand mit Papierfaltkunst.', 'Strategisch geprägt.', 'Höhenlage.', 'Im Gleichgewicht.', 'Kontaktaufnahme.', 'Stilistisch geschriebener Herbstmonat.', 'Bahnhalteorte.', 'Zusammenspiel mit Mehrwert.'],
      downClues: ['Spalte 1.', 'Spalte 2.', 'Spalte 3.', 'Spalte 4.', 'Spalte 5.', 'Spalte 6.', 'Spalte 7.', 'Spalte 8.', 'Spalte 9.']
    }
  },
  fr: {
    5: {
      language: 'fr',
      size: 5,
      across: ['SATOR', 'AREPO', 'TENET', 'OPERA', 'ROTAS'],
      acrossClues: ['Carré latin, ligne 1.', 'Carré latin, ligne 2.', 'Palindrome central.', 'Carré latin, ligne 4.', 'Carré latin, ligne 5.'],
      downClues: ['Colonne 1.', 'Colonne 2.', 'Colonne 3.', 'Colonne 4.', 'Colonne 5.']
    },
    7: {
      language: 'fr',
      size: 7,
      across: ['ALGEBRA', 'LANTERN', 'GARDENS', 'EARNEST', 'BRONZEY', 'RINSEUP', 'ANSWERS'],
      acrossClues: ['Branche des maths.', 'Lumière portable.', 'Espaces de fleurs.', 'Sincère et sérieux.', 'Teinte bronze.', 'Rincer puis continuer.', 'Ce que le joueur cherche.'],
      downClues: ['Colonne 1.', 'Colonne 2.', 'Colonne 3.', 'Colonne 4.', 'Colonne 5.', 'Colonne 6.', 'Colonne 7.']
    },
    9: {
      language: 'fr',
      size: 9,
      across: ['NOTEBOOKS', 'ORIGAMIST', 'TACTICALS', 'ELEVATION', 'BALANCEDS', 'OUTREACHY', 'OKTOBERFS', 'STATIONSX', 'SYNERGIES'],
      acrossClues: ['Cahiers au pluriel.', 'Artisan du pliage papier.', 'À caractère stratégique.', 'Hauteur relative.', 'Stable et équilibré.', 'Action de tendre la main.', 'Mois d’automne stylisé.', 'Lieux d’arrêt des trains.', 'Effets combinés positifs.'],
      downClues: ['Colonne 1.', 'Colonne 2.', 'Colonne 3.', 'Colonne 4.', 'Colonne 5.', 'Colonne 6.', 'Colonne 7.', 'Colonne 8.', 'Colonne 9.']
    }
  },
  es: {
    5: {
      language: 'es',
      size: 5,
      across: ['SATOR', 'AREPO', 'TENET', 'OPERA', 'ROTAS'],
      acrossClues: ['Cuadrado latino fila 1.', 'Cuadrado latino fila 2.', 'Palíndromo central.', 'Cuadrado latino fila 4.', 'Cuadrado latino fila 5.'],
      downClues: ['Columna 1.', 'Columna 2.', 'Columna 3.', 'Columna 4.', 'Columna 5.']
    },
    7: {
      language: 'es',
      size: 7,
      across: ['ALGEBRA', 'LANTERN', 'GARDENS', 'EARNEST', 'BRONZEY', 'RINSEUP', 'ANSWERS'],
      acrossClues: ['Rama matemática.', 'Fuente de luz portátil.', 'Espacios con flores.', 'Sincero y serio.', 'Tono bronce.', 'Enjuagar y seguir.', 'Lo que busca el jugador.'],
      downClues: ['Columna 1.', 'Columna 2.', 'Columna 3.', 'Columna 4.', 'Columna 5.', 'Columna 6.', 'Columna 7.']
    },
    9: {
      language: 'es',
      size: 9,
      across: ['NOTEBOOKS', 'ORIGAMIST', 'TACTICALS', 'ELEVATION', 'BALANCEDS', 'OUTREACHY', 'OKTOBERFS', 'STATIONSX', 'SYNERGIES'],
      acrossClues: ['Cuadernos en plural.', 'Persona experta en origami.', 'De carácter estratégico.', 'Altitud sobre referencia.', 'En equilibrio.', 'Acción de acercamiento.', 'Mes otoñal escrito con estilo.', 'Paradas de tren.', 'Efecto combinado superior.'],
      downClues: ['Columna 1.', 'Columna 2.', 'Columna 3.', 'Columna 4.', 'Columna 5.', 'Columna 6.', 'Columna 7.', 'Columna 8.', 'Columna 9.']
    }
  }
};

function applyProfile(clues: string[], profile: ContentProfile): string[] {
  if (profile === 'standard') {
    return clues;
  }

  // Educational note:
  // For MVP we currently reuse the same clue bank, but we still label profile output so the
  // UI and API can already support family/kid data sources in a later milestone.
  const prefix = profile === 'family' ? '[Family] ' : '[Kid] ';
  return clues.map((clue) => `${prefix}${clue}`);
}

export function buildPuzzle(language: Language, size: 5 | 7 | 9, profile: ContentProfile = 'standard'): GamePuzzle {
  const seed = seedData[language][size];
  const flat = seed.across.join('').split('');
  const solutionTiles = flat.map((value, idx) => ({ id: `tile-${idx}`, value }));

  // We reshuffle a few times if needed so a fresh puzzle does not accidentally start already solved.
  // This removes random/flaky behavior in both gameplay and automated tests.
  let shuffledTiles = shuffleTiles(solutionTiles);
  let attempts = 0;
  while (isSolved(shuffledTiles, solutionTiles) && attempts < 5) {
    shuffledTiles = shuffleTiles(solutionTiles);
    attempts += 1;
  }

  return {
    language,
    size,
    profile,
    acrossClues: applyProfile(seed.acrossClues, profile),
    downClues: applyProfile(seed.downClues, profile),
    solutionTiles,
    shuffledTiles
  };
}

export function shuffleTiles(tiles: Tile[]): Tile[] {
  const clone = [...tiles];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export function swapTiles(tiles: Tile[], a: number, b: number): Tile[] {
  if (a === b) return tiles;
  const next = [...tiles];
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}

export function isSolved(current: Tile[], solution: Tile[]): boolean {
  if (current.length !== solution.length) return false;
  return current.every((tile, index) => tile.value === solution[index].value);
}

export function createImageToken(letter: string): string {
  const safeLetter = letter.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' rx='12' fill='#38bdf8'/><text x='32' y='42' text-anchor='middle' font-size='30' font-family='Arial' fill='white'>${safeLetter}</text></svg>`
  )}`;
}
