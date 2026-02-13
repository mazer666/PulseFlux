import json
import tempfile
import unittest
from pathlib import Path

from tools.content_pipeline.pilot_generation import write_pilot_dataset
from tools.content_pipeline.review_sample import build_review_sample, write_review_exports


class ReviewSampleTests(unittest.TestCase):
    def test_build_review_sample_returns_requested_size_when_available(self):
        with tempfile.TemporaryDirectory() as tmp:
            write_pilot_dataset(tmp, per_language=80, chunk_size=20)
            sample = build_review_sample(tmp, sample_size=120, seed=7)
            self.assertEqual(len(sample), 120)
            self.assertTrue(all(item["language"] in {"de", "en", "fr", "es"} for item in sample))

    def test_write_review_exports_creates_json_and_csv(self):
        with tempfile.TemporaryDirectory() as tmp:
            write_pilot_dataset(tmp, per_language=30, chunk_size=10)
            sample = build_review_sample(tmp, sample_size=40)
            out_dir = Path(tmp) / "exports"
            paths = write_review_exports(sample, str(out_dir))

            self.assertTrue(Path(paths["json"]).exists())
            self.assertTrue(Path(paths["csv"]).exists())

            data = json.loads(Path(paths["json"]).read_text(encoding="utf-8"))
            self.assertEqual(len(data), 40)
            self.assertIn("entry_id", data[0])


if __name__ == "__main__":
    unittest.main()
