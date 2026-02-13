"""Epic G Phase 1 auto-QA checks v1."""

from __future__ import annotations

import re
from difflib import SequenceMatcher
from typing import Dict, List


BANNED_TERMS = {
    "en": {"hate", "kill", "sex"},
    "de": {"hass", "töte", "sex"},
    "fr": {"haine", "tuer", "sexe"},
    "es": {"odio", "matar", "sexo"},
}


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def policy_check(clue_text: str, language: str) -> List[str]:
    terms = BANNED_TERMS.get(language, set())
    normalized = normalize(clue_text)
    return ["policy_unsafe"] if any(term in normalized for term in terms) else []


def leak_check(word: str, clue_text: str) -> List[str]:
    w = normalize(word)
    c = normalize(clue_text)
    if w in c:
        return ["word_leak"]
    if len(w) >= 5 and w[:4] in c:
        return ["stem_leak"]
    return []


def readability_check(clue_text: str, difficulty: int) -> List[str]:
    max_len = {1: 55, 2: 65, 3: 75, 4: 85, 5: 90}[difficulty]
    return ["readability_flag"] if len(clue_text) > max_len else []


def ambiguity_check(clue_text: str) -> List[str]:
    generic_markers = ["etwas", "thing", "quelque", "algo"]
    normalized = normalize(clue_text)
    return ["ambiguity_flag"] if any(m in normalized for m in generic_markers) else []


def similarity_check(clue_text: str, existing_clues: List[str]) -> List[str]:
    candidate = normalize(clue_text)
    for existing in existing_clues:
        if SequenceMatcher(None, candidate, normalize(existing)).ratio() > 0.88:
            return ["similarity_flag"]
    return []


def run_auto_qa(
    word: str,
    clue_text: str,
    language: str,
    difficulty: int,
    existing_clues: List[str],
) -> Dict[str, List[str]]:
    return {
        "policy": policy_check(clue_text, language),
        "leak": leak_check(word, clue_text),
        "readability": readability_check(clue_text, difficulty),
        "ambiguity": ambiguity_check(clue_text),
        "similarity": similarity_check(clue_text, existing_clues),
    }
