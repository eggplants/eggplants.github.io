#!/usr/bin/env python3
"""Diff the PROJECTS / ARCHIVED lists in docs/js/index.js against GitHub.

Prints what to add, move, drop and fix; edits nothing. Needs an authenticated `gh`.
Usage: python3 .claude/skills/update-projects/check.py [--days 365]
"""

from __future__ import annotations

import argparse
import itertools
import json
import re
import subprocess
import sys
from datetime import UTC, datetime, timedelta
from pathlib import Path

USER = "eggplants"
INDEX_JS = Path(__file__).resolve().parents[3] / "docs" / "js" / "index.js"
# repos that are never listed as projects
IGNORE = {"eggplants", "eggplants.github.io"}
# index of the optional owner/repo field of a PROJECTS entry, set for co-maintained external repos
REPO_FIELD = 5

QUERY = """
query($login: String!, $endCursor: String) {
  user(login: $login) {
    repositories(first: 100, after: $endCursor, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false) {
      nodes { name isArchived archivedAt pushedAt createdAt description primaryLanguage { name } }
      pageInfo { hasNextPage endCursor }
    }
  }
}
"""


def fetch_repos() -> dict[str, dict]:
    out = subprocess.run(
        [
            "gh",
            "api",
            "graphql",
            "--paginate",
            "-f",
            f"query={QUERY}",
            "-f",
            f"login={USER}",
            "--jq",
            ".data.user.repositories.nodes[]",
        ],
        check=True,
        capture_output=True,
        text=True,
    ).stdout
    return {r["name"]: r for r in map(json.loads, out.splitlines())}


def parse_list(js: str, const: str) -> list[list]:
    """Each entry of the JS array is a JSON array on its own line."""
    m = re.search(rf"const {const} = \[\n(.*?)\n  \];", js, re.DOTALL)
    if not m:
        sys.exit(f"const {const} not found in {INDEX_JS}")
    return [json.loads(line.strip().rstrip(",")) for line in m.group(1).splitlines() if line.strip().startswith("[")]


def show(title: str, rows: list[str]) -> None:
    print(f"== {title} ({len(rows)})")
    for r in rows:
        print("  " + r)


def info(r: dict) -> str:
    lang = (r["primaryLanguage"] or {}).get("name", "-")
    return f"{r['name']}\t{lang}\tcreated {r['createdAt'][:10]}\tpushed {r['pushedAt'][:10]}\t{r['description'] or ''}"


def archived_key(name: str, created: int, until: int) -> tuple:
    """ARCHIVED is sorted by archived year desc, then created year desc, then name (case-insensitive)."""
    return (-until, -created, name.lower())


def report_projects(repos: dict[str, dict], own: dict[str, list], listed: set[str], cutoff: str) -> None:
    active = [r for r in repos.values() if not r["isArchived"] and r["name"] not in IGNORE]
    show(
        "ADD to PROJECTS: active, pushed within the window, not listed",
        [
            info(r)
            for r in sorted(active, key=lambda r: r["pushedAt"], reverse=True)
            if r["pushedAt"] >= cutoff and r["name"] not in listed
        ],
    )
    show(
        "DROP from PROJECTS: not pushed within the window (confirm with the user)",
        [info(repos[n]) for n in own if n in repos and not repos[n]["isArchived"] and repos[n]["pushedAt"] < cutoff],
    )
    show(
        "GONE from GitHub: listed in PROJECTS but not a public non-fork repo any more",
        [n for n in own if n not in repos],
    )


def report_archived(repos: dict[str, dict], own: dict[str, list], archived: list[list]) -> None:
    in_archived = {a[0]: a for a in archived}
    key = archived_key
    # say where each new entry goes
    keys = sorted(key(a[0], a[4], a[5]) for a in archived)
    moves = []
    for r in sorted(repos.values(), key=lambda r: r["archivedAt"] or "", reverse=True):
        if not r["isArchived"] or r["name"] in in_archived or r["name"] in IGNORE:
            continue
        k = key(r["name"], int(r["createdAt"][:4]), int((r["archivedAt"] or r["pushedAt"])[:4]))
        prev = [x for x in keys if x < k]
        where = f"after {prev[-1][2]}" if prev else "at the top"
        src = "MOVE from PROJECTS" if r["name"] in own else "new"
        moves.append(f"{info(r)}\tarchived {(r['archivedAt'] or '?')[:10]}\t[{src}; insert {where}]")
    show("ADD to ARCHIVED: archived on GitHub, missing from ARCHIVED", moves)
    show(
        "ARCHIVED out of order (archived year desc, created year desc, name)",
        [
            f"{x[0]} before {y[0]}"
            for x, y in itertools.pairwise(archived)
            if key(x[0], x[4], x[5]) > key(y[0], y[4], y[5])
        ],
    )
    show(
        "REMOVE from ARCHIVED: unarchived, renamed, deleted or made private",
        [
            n + ("\t(now active)" if n in repos else "\t(not found)")
            for n in in_archived
            if n not in repos or not repos[n]["isArchived"]
        ],
    )


def report_years(repos: dict[str, dict], own: dict[str, list], archived: list[list]) -> None:
    fixes = []
    for n, p in own.items():
        if n in repos and p[4] != int(repos[n]["createdAt"][:4]):
            fixes.append(f"PROJECTS {n}: created year {p[4]} -> {repos[n]['createdAt'][:4]}")
    for a in archived:
        n = a[0]
        r = repos.get(n)
        if not r or not r["isArchived"]:
            continue
        if a[4] != int(r["createdAt"][:4]):
            fixes.append(f"ARCHIVED {n}: created year {a[4]} -> {r['createdAt'][:4]}")
        if r["archivedAt"] and a[5] != int(r["archivedAt"][:4]):
            fixes.append(f"ARCHIVED {n}: archived year {a[5]} -> {r['archivedAt'][:4]}")
    show("FIX years", fixes)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=365, help="an active repo counts if pushed within this many days")
    days = ap.parse_args().days

    js = INDEX_JS.read_text()
    projects = parse_list(js, "PROJECTS")
    archived = parse_list(js, "ARCHIVED")
    repos = fetch_repos()
    cutoff = (datetime.now(UTC) - timedelta(days=days)).isoformat()

    # co-maintained external repos (with an owner/repo field) are left alone
    own = {p[0]: p for p in projects if len(p) <= REPO_FIELD}
    listed = {p[0] for p in projects} | {a[0] for a in archived}

    report_projects(repos, own, listed, cutoff)
    report_archived(repos, own, archived)
    report_years(repos, own, archived)


if __name__ == "__main__":
    main()
