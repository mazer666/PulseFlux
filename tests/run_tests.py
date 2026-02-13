#!/usr/bin/env python3
"""
Lightweight repository tests that can run without installing npm dependencies.
These tests validate critical implementation guarantees requested by the project.
"""

from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def test_api_route_exists() -> None:
    text = read("app/api/puzzle/route.ts")
    assert_true("export async function GET" in text, "API GET route missing")
    assert_true("allowedLanguages" in text, "Language validation missing")
    assert_true("allowedSizes" in text, "Board size validation missing")
    assert_true("allowedProfiles" in text, "Profile validation missing")


def test_flaky_shuffle_guard_present() -> None:
    text = read("lib/game.ts")
    assert_true(
        "while (isSolved(shuffledTiles, solutionTiles) && attempts < 5)" in text,
        "Anti-flaky shuffle guard missing",
    )


def test_next_image_used_for_tile_mode() -> None:
    text = read("components/SwapPuzzleGame.tsx")
    assert_true("import Image from 'next/image';" in text, "next/image import missing")
    assert_true("<Image" in text and "unoptimized" in text, "Image tile rendering not using next/image")


def test_board_size_options_present() -> None:
    text = read("components/SwapPuzzleGame.tsx")
    assert_true("const boardSizes: Array<5 | 7 | 9> = [5, 7, 9];" in text, "Board sizes 5/7/9 missing")


def test_language_support_present() -> None:
    text = read("lib/game.ts")
    for lang in ["en", "de", "fr", "es"]:
        assert_true(re.search(rf"\n\s*{lang}:\s*{{", text) is not None, f"Language seed '{lang}' missing")


def test_profile_and_zero_swap_options_present() -> None:
    text = read("components/SwapPuzzleGame.tsx")
    assert_true("failAtZero" in text and "continueAtZero" in text, "Zero-swap option controls missing")
    assert_true("type ContentProfile" in read("lib/game.ts"), "Content profile type missing")



def test_massive_dataset_floor_present() -> None:
    text = read("lib/game.ts")
    assert_true("const MIN_DATASET_PER_LANGUAGE_AND_SIZE = 5000;" in text, "5000 dataset floor missing")
    assert_true("buildSizeDataset('en', 5)" in text, "Generated EN datasets missing")

def run() -> int:
    tests = [
        test_api_route_exists,
        test_flaky_shuffle_guard_present,
        test_next_image_used_for_tile_mode,
        test_board_size_options_present,
        test_language_support_present,
        test_profile_and_zero_swap_options_present,
        test_massive_dataset_floor_present,
    ]

    failures = 0
    for test in tests:
        try:
            test()
            print(f"PASS {test.__name__}")
        except Exception as exc:  # noqa: BLE001 - explicit test runner behavior
            failures += 1
            print(f"FAIL {test.__name__}: {exc}")

    if failures:
        print(f"\n{failures} test(s) failed")
        return 1

    print(f"\nAll {len(tests)} tests passed")
    return 0


if __name__ == "__main__":
    sys.exit(run())
