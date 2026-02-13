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
      across: ['SMILE', 'HONEY', 'APPLE', 'TRAIN', 'BEACH'],
      acrossClues: [
        'What your face does when the puzzle finally clicks.',
        'Sweet golden spread made by busy bees.',
        'Classic fruit; keeps doctors on their toes.',
        'Long vehicle that runs on rails.',
        'Sunny coast where waves meet sand.'
      ],
      downClues: ['Column 1 mirrors row 1.', 'Column 2 mirrors row 2.', 'Column 3 mirrors row 3.', 'Column 4 mirrors row 4.', 'Column 5 mirrors row 5.']
    },
    7: {
      language: 'en',
      size: 7,
      across: ['ALGEBRA', 'LANTERN', 'GARDENS', 'SUNRISE', 'HARMONY', 'POPCORN', 'ANSWERS'],
      acrossClues: [
        'Math branch with symbols and equations.',
        'Portable source of light.',
        'Plural spaces for flowers and plants.',
        'Morning show starring the sun.',
        'When notes play nicely together.',
        'Movie snack that can\'t stay quiet.',
        'What players are trying to find.'
      ],
      downClues: ['Column clue 1.', 'Column clue 2.', 'Column clue 3.', 'Column clue 4.', 'Column clue 5.', 'Column clue 6.', 'Column clue 7.']
    },
    9: {
      language: 'en',
      size: 9,
      across: ['NOTEBOOKS', 'CHOCOLATE', 'PINEAPPLE', 'BUTTERFLY', 'WATERFALL', 'KEYBOARDS', 'MOONLIGHT', 'RAINDROPS', 'STARLIGHT'],
      acrossClues: [
        'Plural paper companions for ideas.',
        'Sweet treat that melts if you wait too long.',
        'Tropical fruit with a spiky crown.',
        'Winged garden dancer with dramatic colors.',
        'Nature\'s stairway made of rushing water.',
        'Plural tools for typing and gaming quests.',
        'Night glow that makes everything cinematic.',
        'Tiny water beats in a rainy drumline.',
        'Sky sparkle that deserves a slow clap.'
      ],
      downClues: ['Column clue 1.', 'Column clue 2.', 'Column clue 3.', 'Column clue 4.', 'Column clue 5.', 'Column clue 6.', 'Column clue 7.', 'Column clue 8.', 'Column clue 9.']
    }
  },
  de: {
    5: {
      language: 'de',
      size: 5,
      across: ['SMILE', 'HONEY', 'APPLE', 'TRAIN', 'BEACH'],
      acrossClues: ['Wenn ein Rätsel plötzlich Sinn ergibt: dein Gesicht macht das.', 'Süßer goldener Brotaufstrich von fleißigen Bienen.', 'Klassischer Obst-Star; angeblich gut gegen Arztbesuche.', 'Langes Fahrzeug auf Schienen.', 'Sonnige Küste mit Sand und Wellen.'],
      downClues: ['Spalte 1.', 'Spalte 2.', 'Spalte 3.', 'Spalte 4.', 'Spalte 5.']
    },
    7: {
      language: 'de',
      size: 7,
      across: ['ALGEBRA', 'LANTERN', 'GARDENS', 'SUNRISE', 'HARMONY', 'POPCORN', 'ANSWERS'],
      acrossClues: ['Mathebereich mit Symbolen und Gleichungen.', 'Tragbare Lichtquelle für dunkle Wege.', 'Mehrzahl von Garten.', 'Tagesbeginn, wenn die Sonne auftritt.', 'Wenn Töne gut zusammenklingen.', 'Kino-Snack, der laut knistert.', 'Das, wonach Spielende suchen.'],
      downClues: ['Spalte 1.', 'Spalte 2.', 'Spalte 3.', 'Spalte 4.', 'Spalte 5.', 'Spalte 6.', 'Spalte 7.']
    },
    9: {
      language: 'de',
      size: 9,
      across: ['NOTEBOOKS', 'CHOCOLATE', 'PINEAPPLE', 'BUTTERFLY', 'WATERFALL', 'KEYBOARDS', 'MOONLIGHT', 'RAINDROPS', 'STARLIGHT'],
      acrossClues: ['Notizhefte im Plural.', 'Süße Tafel, die in der Sonne schmilzt.', 'Tropenfrucht mit stacheliger Krone.', 'Bunter Flattergast im Garten.', 'Wasser stürzt stufenweise in die Tiefe.', 'Tipptools im Plural fürs Schreiben und Spielen.', 'Silbernes Nachtlicht über der Stadt.', 'Kleine Regentropfen im Beat des Wetters.', 'Leuchten am Himmel, das Wünsche startet.'],
      downClues: ['Spalte 1.', 'Spalte 2.', 'Spalte 3.', 'Spalte 4.', 'Spalte 5.', 'Spalte 6.', 'Spalte 7.', 'Spalte 8.', 'Spalte 9.']
    }
  },
  fr: {
    5: {
      language: 'fr',
      size: 5,
      across: ['SMILE', 'HONEY', 'APPLE', 'TRAIN', 'BEACH'],
      acrossClues: ['Ce que fait ton visage quand la solution arrive enfin.', 'Douceur dorée faite par les abeilles.', 'Fruit classique qui croque sous la dent.', 'Long véhicule qui roule sur des rails.', 'Côte ensoleillée entre sable et vagues.'],
      downClues: ['Colonne 1.', 'Colonne 2.', 'Colonne 3.', 'Colonne 4.', 'Colonne 5.']
    },
    7: {
      language: 'fr',
      size: 7,
      across: ['ALGEBRA', 'LANTERN', 'GARDENS', 'SUNRISE', 'HARMONY', 'POPCORN', 'ANSWERS'],
      acrossClues: ['Branche des maths avec symboles et équations.', 'Source de lumière portable.', 'Espaces avec fleurs et plantes.', 'Début du jour quand le soleil se lève.', 'Quand des notes sonnent bien ensemble.', 'Snack de cinéma qui fait du bruit.', 'Ce que les joueurs veulent trouver.'],
      downClues: ['Colonne 1.', 'Colonne 2.', 'Colonne 3.', 'Colonne 4.', 'Colonne 5.', 'Colonne 6.', 'Colonne 7.']
    },
    9: {
      language: 'fr',
      size: 9,
      across: ['NOTEBOOKS', 'CHOCOLATE', 'PINEAPPLE', 'BUTTERFLY', 'WATERFALL', 'KEYBOARDS', 'MOONLIGHT', 'RAINDROPS', 'STARLIGHT'],
      acrossClues: ['Cahiers au pluriel pour idées et esquisses.', 'Douceur qui fond vite quand il fait chaud.', 'Fruit tropical à couronne piquante.', 'Danseuse ailée des jardins.', 'Eau qui tombe en marches naturelles.', 'Outils de frappe au pluriel.', 'Lueur de la nuit qui rend tout cinématographique.', 'Petits battements d’eau les jours de pluie.', 'Éclat du ciel qui inspire les vœux.'],
      downClues: ['Colonne 1.', 'Colonne 2.', 'Colonne 3.', 'Colonne 4.', 'Colonne 5.', 'Colonne 6.', 'Colonne 7.', 'Colonne 8.', 'Colonne 9.']
    }
  },
  es: {
    5: {
      language: 'es',
      size: 5,
      across: ['SMILE', 'HONEY', 'APPLE', 'TRAIN', 'BEACH'],
      acrossClues: ['Lo que hace tu cara cuando por fin encaja el puzzle.', 'Dulce dorado hecho por abejas trabajadoras.', 'Fruta clásica con crujido famoso.', 'Vehículo largo que va por rieles.', 'Costa soleada con arena y olas.'],
      downClues: ['Columna 1.', 'Columna 2.', 'Columna 3.', 'Columna 4.', 'Columna 5.']
    },
    7: {
      language: 'es',
      size: 7,
      across: ['ALGEBRA', 'LANTERN', 'GARDENS', 'SUNRISE', 'HARMONY', 'POPCORN', 'ANSWERS'],
      acrossClues: ['Rama matemática con símbolos y ecuaciones.', 'Fuente de luz portátil.', 'Espacios con flores y plantas.', 'Inicio del día cuando sale el sol.', 'Cuando las notas suenan en armonía.', 'Snack de cine que suena al morder.', 'Lo que el jugador quiere encontrar.'],
      downClues: ['Columna 1.', 'Columna 2.', 'Columna 3.', 'Columna 4.', 'Columna 5.', 'Columna 6.', 'Columna 7.']
    },
    9: {
      language: 'es',
      size: 9,
      across: ['NOTEBOOKS', 'CHOCOLATE', 'PINEAPPLE', 'BUTTERFLY', 'WATERFALL', 'KEYBOARDS', 'MOONLIGHT', 'RAINDROPS', 'STARLIGHT'],
      acrossClues: ['Cuadernos en plural para ideas y bocetos.', 'Dulce que se derrite si esperas demasiado.', 'Fruta tropical con corona de pinchos.', 'Bailarina alada del jardín.', 'Agua que cae en escalones naturales.', 'Herramientas para escribir y jugar, en plural.', 'Brillo nocturno que vuelve todo cinematográfico.', 'Pequeños golpes de agua en la lluvia.', 'Destello del cielo que invita a pedir deseos.'],
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

export function isSolved(current: Tile[], solution: Tile[], blocked: Set<number> = new Set()): boolean {
  if (current.length !== solution.length) return false;
  return current.every((tile, index) => {
    if (blocked.has(index)) return true;
    return tile.value === solution[index].value;
  });
}

export function createImageToken(letter: string): string {
  const safeLetter = letter.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' rx='12' fill='#38bdf8'/><text x='32' y='42' text-anchor='middle' font-size='30' font-family='Arial' fill='white'>${safeLetter}</text></svg>`
  )}`;
}
