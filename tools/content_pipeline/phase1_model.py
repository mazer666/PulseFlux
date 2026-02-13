"""Epic G Phase 1 content model and lifecycle validation."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Dict, List


ALLOWED_LANGUAGES = {"de", "en", "fr", "es"}
ALLOWED_CLUE_STYLES = {"neutral", "funny", "trivia", "wordplay"}


class Status(str, Enum):
    DRAFT = "draft"
    REVIEWED = "reviewed"
    APPROVED = "approved"
    DEPRECATED = "deprecated"


@dataclass
class SourceTrace:
    source_name: str
    source_url: str
    license_id: str
    imported_at: str
    reviewer: str


@dataclass
class ContentEntry:
    entry_id: str
    language: str
    word: str
    lemma: str
    pos: str
    difficulty: int
    difficulty_confidence: float
    clue_text: str
    clue_style: str
    safety_flags: List[str]
    quality_scores: Dict[str, float]
    source_trace: SourceTrace
    status: Status
    version: int


def validate_entry(entry: ContentEntry) -> List[str]:
    issues: List[str] = []

    if entry.language not in ALLOWED_LANGUAGES:
        issues.append("language_not_supported")

    if not 1 <= entry.difficulty <= 5:
        issues.append("difficulty_out_of_range")

    if not 0.0 <= entry.difficulty_confidence <= 1.0:
        issues.append("difficulty_confidence_out_of_range")

    if entry.clue_style not in ALLOWED_CLUE_STYLES:
        issues.append("invalid_clue_style")

    for key in ["ambiguity", "readability", "similarity", "predicted_solve_rate"]:
        if key not in entry.quality_scores:
            issues.append(f"missing_quality_score:{key}")

    if entry.version < 1:
        issues.append("invalid_version")

    if not entry.entry_id.strip() or not entry.word.strip() or not entry.clue_text.strip():
        issues.append("required_field_missing")

    return issues


def can_transition(current: Status, new: Status) -> bool:
    allowed = {
        Status.DRAFT: {Status.REVIEWED, Status.DEPRECATED},
        Status.REVIEWED: {Status.APPROVED, Status.DRAFT, Status.DEPRECATED},
        Status.APPROVED: {Status.DEPRECATED},
        Status.DEPRECATED: set(),
    }
    return new in allowed[current]
