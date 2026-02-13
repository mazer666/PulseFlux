import json
import tempfile
import unittest
from pathlib import Path

from tools.content_pipeline.pilot_generation import chunk_entries, write_pilot_dataset


class PilotGenerationTests(unittest.TestCase):
    def test_chunk_entries_respects_chunk_size(self):
        entries = [{"id": i} for i in range(95)]
        chunks = chunk_entries(entries, chunk_size=20)
        self.assertEqual(len(chunks), 5)
        self.assertEqual(len(chunks[-1]), 15)

    def test_write_pilot_dataset_outputs_manifest_and_chunks(self):
        with tempfile.TemporaryDirectory() as tmp:
            manifest = write_pilot_dataset(tmp, per_language=40, chunk_size=15)
            manifest_path = Path(tmp) / "manifest.json"
            self.assertTrue(manifest_path.exists())

            on_disk = json.loads(manifest_path.read_text(encoding="utf-8"))
            self.assertEqual(on_disk["per_language"], 40)
            self.assertEqual(set(on_disk["languages"].keys()), {"de", "en", "fr", "es"})

            # 40 entries -> chunks of 15 => 3 files
            self.assertEqual(on_disk["languages"]["de"]["chunks"], 3)
            first_file = Path(tmp) / on_disk["languages"]["de"]["files"][0]
            self.assertTrue(first_file.exists())

            sample_chunk = json.loads(first_file.read_text(encoding="utf-8"))
            self.assertLessEqual(len(sample_chunk), 15)
            self.assertIn("auto_qa", sample_chunk[0])

            # return value and file should be aligned
            self.assertEqual(manifest["per_language"], on_disk["per_language"])


if __name__ == "__main__":
    unittest.main()
