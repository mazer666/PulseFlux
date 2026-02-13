import unittest

from tools.content_pipeline.auto_qa import run_auto_qa
from tools.content_pipeline.phase1_model import (
    ContentEntry,
    SourceTrace,
    Status,
    can_transition,
    validate_entry,
)
from tools.content_pipeline.reviewer_queue import QueueItem, ReviewDecision, apply_decision


class Phase1PipelineTests(unittest.TestCase):
    def test_content_entry_validation_passes(self):
        entry = ContentEntry(
            entry_id="de-haus-001",
            language="de",
            word="Haus",
            lemma="Haus",
            pos="noun",
            difficulty=2,
            difficulty_confidence=0.91,
            clue_text="Ort, in dem eine Familie wohnen kann",
            clue_style="neutral",
            safety_flags=[],
            quality_scores={
                "ambiguity": 0.1,
                "readability": 0.9,
                "similarity": 0.05,
                "predicted_solve_rate": 0.82,
            },
            source_trace=SourceTrace(
                source_name="Wiktionary",
                source_url="https://dumps.wikimedia.org/",
                license_id="CC-BY-SA-3.0",
                imported_at="2026-02-01T12:00:00Z",
                reviewer="content-team",
            ),
            status=Status.DRAFT,
            version=1,
        )

        self.assertEqual(validate_entry(entry), [])

    def test_status_transitions(self):
        self.assertTrue(can_transition(Status.DRAFT, Status.REVIEWED))
        self.assertTrue(can_transition(Status.REVIEWED, Status.APPROVED))
        self.assertFalse(can_transition(Status.APPROVED, Status.DRAFT))

    def test_auto_qa_flags(self):
        result = run_auto_qa(
            word="Haus",
            clue_text="Dieses Haus ist ein Ort zum Wohnen",
            language="de",
            difficulty=1,
            existing_clues=["Ort zum Wohnen"],
        )

        self.assertIn("word_leak", result["leak"])

    def test_reviewer_queue_decision(self):
        item = QueueItem(
            entry_id="en-tree-001",
            language="en",
            word="tree",
            clue_text="Tall plant with a trunk",
            auto_flags=[],
            score_summary={"readability": 0.8},
            source_trace={"source": "sample"},
        )

        decided = apply_decision(item, ReviewDecision(action="approve"))
        self.assertEqual(decided.status, "approved")


if __name__ == "__main__":
    unittest.main()
