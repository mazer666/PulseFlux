"""Build stratified review samples from chunked pilot datasets."""

from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path
from random import Random
from typing import Dict, Iterable, List, Tuple

LANGUAGES = ("de", "en", "fr", "es")
DIFFICULTIES = (1, 2, 3, 4, 5)


def _read_manifest(dataset_root: Path) -> Dict:
    manifest_path = dataset_root / "manifest.json"
    if not manifest_path.exists():
        raise FileNotFoundError("manifest_not_found")
    return json.loads(manifest_path.read_text(encoding="utf-8"))


def _iter_entries(dataset_root: Path, manifest: Dict) -> Iterable[Dict]:
    for language, info in manifest.get("languages", {}).items():
        for rel_file in info.get("files", []):
            path = dataset_root / rel_file
            if not path.exists():
                continue
            entries = json.loads(path.read_text(encoding="utf-8"))
            for entry in entries:
                if entry.get("language") == language:
                    yield entry


def build_review_sample(dataset_dir: str, sample_size: int = 500, seed: int = 42) -> List[Dict]:
    dataset_root = Path(dataset_dir)
    manifest = _read_manifest(dataset_root)

    buckets: Dict[Tuple[str, int], List[Dict]] = defaultdict(list)
    for entry in _iter_entries(dataset_root, manifest):
        language = entry.get("language")
        difficulty = int(entry.get("difficulty", 0))
        if language in LANGUAGES and difficulty in DIFFICULTIES:
            buckets[(language, difficulty)].append(entry)

    rng = Random(seed)
    for items in buckets.values():
        rng.shuffle(items)

    # proportional-ish baseline: one from each available bucket, then round-robin fill
    sample: List[Dict] = []
    bucket_keys = sorted(buckets.keys())

    for key in bucket_keys:
        if buckets[key] and len(sample) < sample_size:
            sample.append(buckets[key].pop())

    while len(sample) < sample_size:
        progressed = False
        for key in bucket_keys:
            if buckets[key] and len(sample) < sample_size:
                sample.append(buckets[key].pop())
                progressed = True
        if not progressed:
            break

    return sample


def write_review_exports(sample: List[Dict], output_dir: str) -> Dict[str, str]:
    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)

    json_path = out / "review_sample.json"
    csv_path = out / "review_sample.csv"

    json_path.write_text(json.dumps(sample, ensure_ascii=False, indent=2), encoding="utf-8")

    with csv_path.open("w", encoding="utf-8", newline="") as fp:
        writer = csv.DictWriter(
            fp,
            fieldnames=[
                "entry_id",
                "language",
                "word",
                "difficulty",
                "clue_text",
                "clue_style",
                "status",
            ],
        )
        writer.writeheader()
        for row in sample:
            writer.writerow(
                {
                    "entry_id": row.get("entry_id", ""),
                    "language": row.get("language", ""),
                    "word": row.get("word", ""),
                    "difficulty": row.get("difficulty", ""),
                    "clue_text": row.get("clue_text", ""),
                    "clue_style": row.get("clue_style", ""),
                    "status": row.get("status", ""),
                }
            )

    return {"json": str(json_path), "csv": str(csv_path)}
