#!/usr/bin/env python3
"""
Fail fast if newsroom operational code tries to use DTP production domains in a
here.now/custom-domain/DNS context.

Allowed:
- ordinary content references to the live site
- canonical URLs
- article links
- sitemap checks
- Netlify production verification

Blocked:
- here.now custom-domain usage for digitaltechnologypartner.ai or www.digitaltechnologypartner.ai
- production-domain mounting / pairing
- production DNS changing / repointing
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

PROTECTED_DOMAINS = (
    "digitaltechnologypartner.ai",
    "www.digitaltechnologypartner.ai",
)

BLOCKING_TOKENS = (
    "here.now",
    "fallback.here.now",
    "herenow",
    "custom-domain",
    "custom domain",
    "mount",
    "mounted",
    "pair",
    "paired",
    "pairing",
    "dns",
    "nameserver",
    "zone",
    "cname",
    "a record",
    "repoint",
    "reroute",
)

DEFAULT_SCAN_PATHS = (
    Path("scripts"),
    Path("package.json"),
    Path("windsurf_deployment.yaml"),
)

SKIP_DIR_NAMES = {
    "node_modules",
    ".git",
    "dist",
    ".astro",
    "coverage",
    "tmp",
    "temp",
    "__pycache__",
}

MAX_FILE_BYTES = 200_000


def normalize(text: str) -> str:
    return " ".join(text.lower().split())


def contains_violation(text: str) -> tuple[bool, str | None, str | None]:
    normalized = normalize(text)
    domain = next((item for item in PROTECTED_DOMAINS if item in normalized), None)
    if not domain:
        return False, None, None

    token = next((item for item in BLOCKING_TOKENS if item in normalized), None)
    if not token:
        return False, None, None

    return True, domain, token


def iter_scan_files(root: Path) -> list[Path]:
    files: list[Path] = []
    self_path = Path(__file__).resolve()
    for relative in DEFAULT_SCAN_PATHS:
        path = root / relative
        if not path.exists():
            continue
        if path.is_file():
            if path.resolve() != self_path:
                files.append(path)
            continue
        for candidate in path.rglob("*"):
            if any(part in SKIP_DIR_NAMES for part in candidate.parts):
                continue
            if candidate.is_file() and candidate.resolve() != self_path:
                files.append(candidate)
    return sorted(set(files))


def scan_file(path: Path) -> list[str]:
    if path.stat().st_size > MAX_FILE_BYTES:
        return []
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return []

    problems: list[str] = []
    for line_number, line in enumerate(text.splitlines(), start=1):
        violated, domain, token = contains_violation(line)
        if not violated:
            continue
        problems.append(
            f"{path}:{line_number}: blocked production-domain operation "
            f"({domain} + {token}) -> {line.strip()}"
        )
    return problems


def scan_text_fragments(fragments: list[str]) -> list[str]:
    problems: list[str] = []
    for index, fragment in enumerate(fragments, start=1):
        violated, domain, token = contains_violation(fragment)
        if not violated:
            continue
        problems.append(
            f"text[{index}]: blocked production-domain operation "
            f"({domain} + {token}) -> {fragment.strip()}"
        )
    return problems


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Guard DTP production domains from here.now/custom-domain/DNS operations"
    )
    parser.add_argument(
        "--root",
        default=Path(__file__).resolve().parents[2],
        type=Path,
        help="Repo root to scan. Defaults to the company-website repo root.",
    )
    parser.add_argument(
        "--check-text",
        action="append",
        default=[],
        help="Additional command or operation text fragments to check explicitly.",
    )
    args = parser.parse_args()

    root = args.root.resolve()
    problems: list[str] = []

    for path in iter_scan_files(root):
        problems.extend(scan_file(path))

    problems.extend(scan_text_fragments(args.check_text))

    if problems:
        print("Production domain guard FAILED:", file=sys.stderr)
        for problem in problems:
            print(f"- {problem}", file=sys.stderr)
        print(
            "Allowed: ordinary live-site references (canonical URLs, article links, sitemap checks, Netlify verification).",
            file=sys.stderr,
        )
        print(
            "Blocked: here.now custom-domain usage, mounting/pairing, or DNS-changing operations for digitaltechnologypartner.ai and www.digitaltechnologypartner.ai.",
            file=sys.stderr,
        )
        return 1

    print("Production domain guard PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
