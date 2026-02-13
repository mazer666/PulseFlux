"""Phase 2 pilot generation helpers with chunked output."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from random import Random
from typing import Dict, List

from tools.content_pipeline.auto_qa import run_auto_qa

LANGUAGES = ("de", "en", "fr", "es")

WORD_STEMS: Dict[str, List[str]] = {
    "de": ["haus", "baum", "wasser", "schule", "garten", "fenster", "straße", "blume"],
    "en": ["house", "tree", "water", "school", "garden", "window", "street", "flower"],
    "fr": ["maison", "arbre", "eau", "ecole", "jardin", "fenetre", "rue", "fleur"],
    "es": ["casa", "arbol", "agua", "escuela", "jardin", "ventana", "calle", "flor"],
}

CLUE_TEMPLATES: Dict[str, List[str]] = {
    "de": [
        "Alltagswort rund um {word}",
        "Begriff aus dem Alltag: {word}",
        "Ein bekanntes Thema in Richtung {word}",
    ],
    "en": [
        "Common daily-life term related to {word}",
        "Everyday concept connected to {word}",
        "A familiar topic around {word}",
    ],
    "fr": [
        "Terme courant lié à {word}",
        "Concept du quotidien autour de {word}",
        "Mot familier en lien avec {word}",
    ],
    "es": [
        "Término cotidiano relacionado con {word}",
        "Concepto diario en torno a {word}",
        "Idea común vinculada a {word}",
    ],
}


def _build_word(language: str, idx: int) -> str:
    stem = WORD_STEMS[language][idx % len(WORD_STEMS[language])]
    return f"{stem}{idx:04d}"


def _build_clue(language: str, word: str, idx: int) -> str:
    template = CLUE_TEMPLATES[language][idx % len(CLUE_TEMPLATES[language])]
    # avoid full leak by dropping suffix digits in clue
    word_hint = word[:-2]
    return template.format(word=word_hint)


def generate_language_entries(language: str, count: int, seed: int = 42) -> List[Dict]:
    rng = Random(seed)
    entries: List[Dict] = []

    for i in range(count):
        word = _build_word(language, i)
        clue = _build_clue(language, word, i)
        difficulty = 1 + (i % 5)

        qa = run_auto_qa(
            word=word,
            clue_text=clue,
            language=language,
            difficulty=difficulty,
            existing_clues=[e["clue_text"] for e in entries[-20:]],
        )

        entries.append(
            {
                "entry_id": f"{language}-{i:06d}",
                "language": language,
                "word": word,
                "difficulty": difficulty,
                "clue_text": clue,
                "clue_style": "neutral" if i % 3 else "funny",
                "status": "draft",
                "quality_scores": {
                    "ambiguity": round(rng.uniform(0.03, 0.35), 3),
                    "readability": round(rng.uniform(0.7, 0.97), 3),
                    "similarity": round(rng.uniform(0.02, 0.25), 3),
                    "predicted_solve_rate": round(rng.uniform(0.4, 0.9), 3),
                },
                "auto_qa": qa,
                "source_trace": {
                    "source_name": "phase2-pilot-generator",
                    "source_url": "internal://pilot_generation",
                    "license_id": "internal",
                    "imported_at": datetime.now(timezone.utc).isoformat(),
                    "reviewer": "pending",
                },
                "version": 1,
            }
        )

    return entries


def chunk_entries(entries: List[Dict], chunk_size: int) -> List[List[Dict]]:
    if chunk_size < 1:
        raise ValueError("chunk_size_must_be_positive")
    return [entries[i : i + chunk_size] for i in range(0, len(entries), chunk_size)]


def write_pilot_dataset(output_dir: str, per_language: int = 1200, chunk_size: int = 300) -> Dict:
    base = Path(output_dir)
    base.mkdir(parents=True, exist_ok=True)

    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "per_language": per_language,
        "chunk_size": chunk_size,
        "languages": {},
    }

    for language in LANGUAGES:
        entries = generate_language_entries(language=language, count=per_language)
        chunks = chunk_entries(entries, chunk_size=chunk_size)

        lang_dir = base / language
        lang_dir.mkdir(parents=True, exist_ok=True)

        chunk_files = []
        for idx, chunk in enumerate(chunks, start=1):
            p = lang_dir / f"batch_{idx:03d}.json"
            p.write_text(json.dumps(chunk, ensure_ascii=False, indent=2), encoding="utf-8")
            chunk_files.append(str(p.relative_to(base)))

        manifest["languages"][language] = {
            "entries": len(entries),
            "chunks": len(chunks),
            "files": chunk_files,
        }

    (base / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    return manifest
