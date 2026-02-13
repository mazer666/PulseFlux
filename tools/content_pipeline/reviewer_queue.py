"""Epic G Phase 1 reviewer queue MVP."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List


REASON_CODES = {
    "policy_risk",
    "ambiguity",
    "too_easy_or_too_hard",
    "poor_localization",
    "unfunny_or_low_quality",
    "duplicate",
}


@dataclass
class QueueItem:
    entry_id: str
    language: str
    word: str
    clue_text: str
    auto_flags: List[str]
    score_summary: Dict[str, float]
    source_trace: Dict[str, str]
    status: str = "reviewed"


@dataclass
class ReviewDecision:
    action: str
    reason_code: str | None = None
    note: str = ""


def apply_decision(item: QueueItem, decision: ReviewDecision) -> QueueItem:
    if decision.action == "approve":
        item.status = "approved"
        return item

    if decision.action in {"request_edit", "reject", "deprecate", "escalate"}:
        if decision.reason_code not in REASON_CODES:
            raise ValueError("invalid_reason_code")
        if decision.action == "request_edit":
            item.status = "draft"
        elif decision.action == "escalate":
            item.status = "reviewed"
        else:
            item.status = "deprecated"
        return item

    raise ValueError("invalid_action")
