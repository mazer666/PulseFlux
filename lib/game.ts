export type Language = 'en' | 'de' | 'fr' | 'es';
export type TileMode = 'letters' | 'images';
export type ContentProfile = 'standard' | 'family' | 'kid';

export type PuzzleSeed = {
  language: Language;
  size: 5 | 7 | 9;
  across: string[];
  acrossClues: string[];
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
      across: ['BLADE', 'LOGAN', 'AGENT', 'DANCE', 'ENTER'],
      acrossClues: [
        'Sharp cutting part of a knife.',
        'Utah city near the mountains.',
        'Person acting on behalf of someone.',
        'Move to music.',
        'Go inside.'
      ]
    },
    7: {
      language: 'en',
      size: 7,
      across: ['GESSNER', 'ENYEAMA', 'SYMPTOM', 'SEPTATE', 'NATALIS', 'EMOTIVE', 'RAMESES'],
      acrossClues: [
        'Conrad ___, Swiss naturalist.',
        'Vincent ___, former goalkeeper.',
        'A sign of a condition.',
        'Divided by partitions.',
        'Related to birth (Latin-root adjective).',
        'Expressive and full of feeling.',
        'Pluralized form of Ramses.'
      ]
    },
    9: {
      language: 'en',
      size: 9,
      across: ['NOTEBOOKS', 'CHOCOLATE', 'PINEAPPLE', 'BUTTERFLY', 'WATERFALL', 'KEYBOARDS', 'MOONLIGHT', 'RAINDROPS', 'STARLIGHT'],
      acrossClues: [
        'Plural paper companions for ideas.',
        'Sweet treat that melts if warm.',
        'Tropical fruit with a spiky crown.',
        'Winged garden dancer.',
        'Nature’s rushing curtain of water.',
        'Plural tools for typing.',
        'Silver glow of the night.',
        'Small drops from rainy skies.',
        'Sky sparkle in the dark.'
      ]
    }
  },
  de: {
    5: { language: 'de', size: 5, across: ['BLADE', 'LOGAN', 'AGENT', 'DANCE', 'ENTER'], acrossClues: ['Scharfe Klinge eines Messers.', 'Stadt in Utah.', 'Handelnde Person im Auftrag.', 'Bewegung zur Musik.', 'Hineingehen.'] },
    7: { language: 'de', size: 7, across: ['GESSNER', 'ENYEAMA', 'SYMPTOM', 'SEPTATE', 'NATALIS', 'EMOTIVE', 'RAMESES'], acrossClues: ['Conrad ___, Naturforscher.', 'Vincent ___, Ex-Torwart.', 'Anzeichen eines Zustands.', 'Durch Trennwände geteilt.', 'Mit Geburt zusammenhängend.', 'Ausdrucksstark.', 'Pluralisierte Form von Ramses.'] },
    9: { language: 'de', size: 9, across: ['NOTEBOOKS', 'CHOCOLATE', 'PINEAPPLE', 'BUTTERFLY', 'WATERFALL', 'KEYBOARDS', 'MOONLIGHT', 'RAINDROPS', 'STARLIGHT'], acrossClues: ['Notizhefte im Plural.', 'Süße Schokolade.', 'Tropenfrucht mit Krone.', 'Bunter Flattergast.', 'Rauschender Wasserfall.', 'Tastaturen im Plural.', 'Nachtlicht vom Mond.', 'Regentropfen im Plural.', 'Sternenlicht.'] }
  },
  fr: {
    5: { language: 'fr', size: 5, across: ['BLADE', 'LOGAN', 'AGENT', 'DANCE', 'ENTER'], acrossClues: ['Partie tranchante d’un couteau.', 'Ville de l’Utah.', 'Personne qui agit pour un autre.', 'Bouger en rythme.', 'Entrer.'] },
    7: { language: 'fr', size: 7, across: ['GESSNER', 'ENYEAMA', 'SYMPTOM', 'SEPTATE', 'NATALIS', 'EMOTIVE', 'RAMESES'], acrossClues: ['Conrad ___, naturaliste suisse.', 'Vincent ___, ancien gardien.', 'Signe d’une condition.', 'Divisé par des cloisons.', 'Relatif à la naissance.', 'Plein d’émotion.', 'Forme plurielle de Ramses.'] },
    9: { language: 'fr', size: 9, across: ['NOTEBOOKS', 'CHOCOLATE', 'PINEAPPLE', 'BUTTERFLY', 'WATERFALL', 'KEYBOARDS', 'MOONLIGHT', 'RAINDROPS', 'STARLIGHT'], acrossClues: ['Cahiers au pluriel.', 'Douceur au cacao.', 'Fruit tropical à couronne.', 'Danseur ailé du jardin.', 'Chute d’eau naturelle.', 'Claviers au pluriel.', 'Lueur de la lune.', 'Gouttes de pluie.', 'Lumière des étoiles.'] }
  },
  es: {
    5: { language: 'es', size: 5, across: ['BLADE', 'LOGAN', 'AGENT', 'DANCE', 'ENTER'], acrossClues: ['Parte cortante de un cuchillo.', 'Ciudad de Utah.', 'Persona que actúa por otra.', 'Moverse con música.', 'Entrar.'] },
    7: { language: 'es', size: 7, across: ['GESSNER', 'ENYEAMA', 'SYMPTOM', 'SEPTATE', 'NATALIS', 'EMOTIVE', 'RAMESES'], acrossClues: ['Conrad ___, naturalista suizo.', 'Vincent ___, ex portero.', 'Señal de una condición.', 'Dividido por tabiques.', 'Relacionado con el nacimiento.', 'Lleno de emoción.', 'Forma plural de Ramses.'] },
    9: { language: 'es', size: 9, across: ['NOTEBOOKS', 'CHOCOLATE', 'PINEAPPLE', 'BUTTERFLY', 'WATERFALL', 'KEYBOARDS', 'MOONLIGHT', 'RAINDROPS', 'STARLIGHT'], acrossClues: ['Cuadernos en plural.', 'Dulce de cacao.', 'Fruta tropical con corona.', 'Bailarín alado del jardín.', 'Cascada natural.', 'Teclados en plural.', 'Brillo de la luna.', 'Gotas de lluvia.', 'Luz de estrellas.'] }
  }
};

function buildDownWords(across: string[]): string[] {
  const size = across.length;
  return Array.from({ length: size }, (_, col) => across.map((row) => row[col]).join(''));
}

function clueForWord(word: string, language: Language, orientation: 'across' | 'down'): string {
  const prefix = ({ en: 'Build the word', de: 'Bilde das Wort', fr: 'Compose le mot', es: 'Forma la palabra' } as const)[language];
  const dir = orientation === 'across'
    ? ({ en: 'Across', de: 'Waagrecht', fr: 'Horizontal', es: 'Horizontal' } as const)[language]
    : ({ en: 'Down', de: 'Senkrecht', fr: 'Vertical', es: 'Vertical' } as const)[language];
  return `${prefix} ${word} (${dir}).`;
}

function applyProfile(clues: string[], _profile: ContentProfile): string[] {
  return clues;
}

export function buildPuzzle(language: Language, size: 5 | 7 | 9, profile: ContentProfile = 'standard'): GamePuzzle {
  const seed = seedData[language][size];
  const flat = seed.across.join('').split('');
  const solutionTiles = flat.map((value, idx) => ({ id: `tile-${idx}`, value }));

  let shuffledTiles = shuffleTiles(solutionTiles);
  let attempts = 0;
  while (isSolved(shuffledTiles, solutionTiles) && attempts < 5) {
    shuffledTiles = shuffleTiles(solutionTiles);
    attempts += 1;
  }

  const downWords = buildDownWords(seed.across);

  return {
    language,
    size,
    profile,
    acrossClues: applyProfile(seed.acrossClues, profile),
    downClues: applyProfile(downWords.map((word) => clueForWord(word, language, 'down')), profile),
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
