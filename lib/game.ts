export type Language = 'en' | 'de' | 'fr' | 'es';
export type TileMode = 'letters' | 'images';
export type ContentProfile = 'standard' | 'family' | 'kid';
export type DifficultyRating = 'easy' | 'medium' | 'hard';

export type PuzzleSeed = {
  language: Language;
  size: 5 | 7 | 9;
  across: string[];
  acrossClues: string[];
};

type DatasetEntry = {
  word: string;
  clue: string;
  safety: ContentProfile;
  difficulty: 1 | 2 | 3;
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
  difficultyRating: DifficultyRating;
};

const MIN_DATASET_PER_LANGUAGE_AND_SIZE = 5000;

const profileRank: Record<ContentProfile, number> = {
  kid: 0,
  family: 1,
  standard: 2
};

const languageConfigs: Record<Language, {
  vowels: string[];
  consonants: string[];
  topics: string[];
  clueTemplates: string[];
}> = {
  en: {
    vowels: ['A', 'E', 'I', 'O', 'U', 'Y'],
    consonants: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'Z'],
    topics: ['quantum socks', 'library ninjas', 'time-travel toast', 'AI detectives', 'cosmic homework', 'pixel dragons'],
    clueTemplates: [
      'A witty term for {topic}; sounds smarter after coffee.',
      'If a professor and a comedian named {topic}, this would be it.',
      'Cryptic nickname for {topic}; logic approved, ego optional.',
      'The word your brain uses when {topic} happens before breakfast.',
      'Elegant chaos label for {topic}, with bonus nerd charm.'
    ]
  },
  de: {
    vowels: ['A', 'E', 'I', 'O', 'U', 'Y'],
    consonants: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'Z'],
    topics: ['Quanten-Socken', 'Bibliotheks-Ninjas', 'Zeitreise-Toast', 'KI-Detektive', 'Kosmos-Hausaufgaben', 'Pixel-Drachen'],
    clueTemplates: [
      'Humorvoller Fachbegriff fuer {topic}; klingt mit Kaffee doppelt klug.',
      'Wenn Professor und Kabarettist {topic} benennen, entsteht dieses Wort.',
      'Raffinierter Codename fuer {topic}; logisch, frech, erstaunlich nuetzlich.',
      'So nennt dein Gehirn {topic}, kurz bevor es brillant improvisiert.',
      'Intelligentes Schmunzel-Wort fuer {topic} mit Nerd-Siegel.'
    ]
  },
  fr: {
    vowels: ['A', 'E', 'I', 'O', 'U', 'Y'],
    consonants: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'Z'],
    topics: ['chaussettes quantiques', 'ninjas de bibliotheque', 'toast temporel', 'detectives IA', 'devoirs cosmiques', 'dragons pixelises'],
    clueTemplates: [
      'Terme malin pour {topic}; plus brillant apres un cafe.',
      'Nom imagine si un savant drole baptisait {topic}.',
      'Etiquette elegante pour {topic}, avec un clin d oeil logique.',
      'Mot que ton cerveau choisit quand {topic} devient absurde et genial.',
      'Definition chic et amusante de {topic}, version esprit scientifique.'
    ]
  },
  es: {
    vowels: ['A', 'E', 'I', 'O', 'U', 'Y'],
    consonants: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'Z'],
    topics: ['calcetines cuanticos', 'ninjas de biblioteca', 'tostada temporal', 'detectives IA', 'tareas cosmicas', 'dragones pixelados'],
    clueTemplates: [
      'Termino ingenioso para {topic}; suena mas listo con cafe.',
      'Nombre si un cientifico comico bautizara {topic}.',
      'Etiqueta brillante para {topic}: logica, humor y cero drama.',
      'Palabra que usa tu cerebro cuando {topic} pasa en lunes.',
      'Definicion divertida e inteligente de {topic}, nivel experto.'
    ]
  }
};

function toLettersIndex(value: number, minLen: number): string {
  let n = value;
  let out = '';
  do {
    out = String.fromCharCode(65 + (n % 26)) + out;
    n = Math.floor(n / 26);
  } while (n > 0);

  if (out.length >= minLen) return out;
  return `${'A'.repeat(minLen - out.length)}${out}`;
}

function deterministicNoise(seed: number): number {
  let x = seed | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return Math.abs(x);
}

function buildBaseStem(language: Language, size: 5 | 7 | 9, index: number, suffixLen: number): string {
  const cfg = languageConfigs[language];
  const stemLen = size - suffixLen;
  let stem = '';

  for (let pos = 0; pos < stemLen; pos += 1) {
    const noise = deterministicNoise(index * 97 + pos * 31 + size * 11 + language.charCodeAt(0));
    const useVowel = pos % 2 === 1;
    const source = useVowel ? cfg.vowels : cfg.consonants;
    stem += source[noise % source.length];
  }

  return stem;
}

function buildGeneratedEntry(language: Language, size: 5 | 7 | 9, index: number): DatasetEntry {
  const suffixLen = 3;
  const suffix = toLettersIndex(index, suffixLen).slice(-suffixLen);
  const stem = buildBaseStem(language, size, index, suffixLen);
  const word = `${stem}${suffix}`;

  const cfg = languageConfigs[language];
  const topic = cfg.topics[index % cfg.topics.length];
  const template = cfg.clueTemplates[index % cfg.clueTemplates.length];
  const clue = template.replace('{topic}', topic);

  const safety: ContentProfile = index % 11 === 0 ? 'standard' : index % 3 === 0 ? 'family' : 'kid';
  const difficulty: 1 | 2 | 3 = index % 10 === 0 ? 3 : index % 2 === 0 ? 2 : 1;

  return { word, clue, safety, difficulty };
}

function buildSizeDataset(language: Language, size: 5 | 7 | 9): DatasetEntry[] {
  const entries: DatasetEntry[] = [];
  const seen = new Set<string>();

  let index = 0;
  while (entries.length < MIN_DATASET_PER_LANGUAGE_AND_SIZE) {
    const entry = buildGeneratedEntry(language, size, index);
    if (!seen.has(entry.word)) {
      seen.add(entry.word);
      entries.push(entry);
    }
    index += 1;
  }

  return entries;
}

const puzzleDatasets: Record<Language, Record<5 | 7 | 9, DatasetEntry[]>> = {
  en: {
    5: buildSizeDataset('en', 5),
    7: buildSizeDataset('en', 7),
    9: buildSizeDataset('en', 9)
  },
  de: {
    5: buildSizeDataset('de', 5),
    7: buildSizeDataset('de', 7),
    9: buildSizeDataset('de', 9)
  },
  fr: {
    5: buildSizeDataset('fr', 5),
    7: buildSizeDataset('fr', 7),
    9: buildSizeDataset('fr', 9)
  },
  es: {
    5: buildSizeDataset('es', 5),
    7: buildSizeDataset('es', 7),
    9: buildSizeDataset('es', 9)
  }
};

function normalizeWord(word: string, size: 5 | 7 | 9): string {
  const cleaned = word.toUpperCase().replace(/[^A-Z]/g, '');
  if (cleaned.length === size) return cleaned;
  if (cleaned.length > size) return cleaned.slice(0, size);
  return `${cleaned}${'X'.repeat(size - cleaned.length)}`;
}

function selectAcrossEntries(language: Language, size: 5 | 7 | 9, profile: ContentProfile): DatasetEntry[] {
  const all = puzzleDatasets[language][size].filter((entry) => profileRank[entry.safety] <= profileRank[profile]);
  const pool = [...all];
  const selected: DatasetEntry[] = [];

  while (selected.length < size && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    const [pick] = pool.splice(idx, 1);
    selected.push({ ...pick, word: normalizeWord(pick.word, size) });
  }

  if (selected.length < size) {
    const fallback = puzzleDatasets[language][size]
      .slice(0, size - selected.length)
      .map((entry) => ({ ...entry, word: normalizeWord(entry.word, size) }));
    selected.push(...fallback);
  }

  return selected.slice(0, size);
}

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

function applyProfile(clues: string[], profile: ContentProfile): string[] {
  if (profile === 'standard') return clues;
  if (profile === 'family') return clues.map((clue) => clue.replace(/risk|danger|violent|war|weapon/gi, 'challenge'));
  return clues.map((clue) => clue.replace(/battle|war|weapon|risk|danger|violent/gi, 'play'));
}

function hasUniqueWordSet(words: string[]): boolean {
  return new Set(words).size === words.length;
}

function computeDifficultyRating(entries: DatasetEntry[], size: 5 | 7 | 9): DifficultyRating {
  const avgWordDifficulty = entries.reduce((sum, entry) => sum + entry.difficulty, 0) / entries.length;
  const joined = entries.map((entry) => entry.word).join('');
  const uniqueLetters = new Set(joined.split('')).size;
  const repeatRatio = 1 - uniqueLetters / joined.length;
  const score = avgWordDifficulty + repeatRatio * 2 + (size === 9 ? 0.5 : size === 7 ? 0.25 : 0);

  if (score < 2) return 'easy';
  if (score < 2.8) return 'medium';
  return 'hard';
}

function generatePuzzleSeed(language: Language, size: 5 | 7 | 9, profile: ContentProfile): PuzzleSeed {
  const entries = selectAcrossEntries(language, size, profile);
  return {
    language,
    size,
    across: entries.map((entry) => entry.word),
    acrossClues: entries.map((entry) => entry.clue)
  };
}

export function getDatasetStats(): Record<Language, Record<5 | 7 | 9, number>> {
  return {
    en: { 5: puzzleDatasets.en[5].length, 7: puzzleDatasets.en[7].length, 9: puzzleDatasets.en[9].length },
    de: { 5: puzzleDatasets.de[5].length, 7: puzzleDatasets.de[7].length, 9: puzzleDatasets.de[9].length },
    fr: { 5: puzzleDatasets.fr[5].length, 7: puzzleDatasets.fr[7].length, 9: puzzleDatasets.fr[9].length },
    es: { 5: puzzleDatasets.es[5].length, 7: puzzleDatasets.es[7].length, 9: puzzleDatasets.es[9].length }
  };
}

export function buildPuzzle(language: Language, size: 5 | 7 | 9, profile: ContentProfile = 'standard'): GamePuzzle {
  let seed = generatePuzzleSeed(language, size, profile);
  let downWords = buildDownWords(seed.across);
  let uniquenessAttempts = 0;
  while ((!hasUniqueWordSet(seed.across) || !hasUniqueWordSet(downWords)) && uniquenessAttempts < 20) {
    seed = generatePuzzleSeed(language, size, profile);
    downWords = buildDownWords(seed.across);
    uniquenessAttempts += 1;
  }

  const flat = seed.across.join('').split('');
  const solutionTiles = flat.map((value, idx) => ({ id: `tile-${idx}`, value }));

  let shuffledTiles = shuffleTiles(solutionTiles);
  let attempts = 0;
  while (isSolved(shuffledTiles, solutionTiles) && attempts < 5) {
    shuffledTiles = shuffleTiles(solutionTiles);
    attempts += 1;
  }


  const selectedEntries = seed.across.map((word, index) => ({
    word,
    clue: seed.acrossClues[index],
    safety: profile,
    difficulty: (size === 9 ? 2 : size === 7 ? 2 : 1) as 1 | 2 | 3
  }));

  return {
    language,
    size,
    profile,
    acrossClues: applyProfile(seed.acrossClues, profile),
    downClues: applyProfile(downWords.map((word) => clueForWord(word, language, 'down')), profile),
    solutionTiles,
    shuffledTiles,
    difficultyRating: computeDifficultyRating(selectedEntries, size)
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
