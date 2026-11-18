#!/usr/bin/env python3
"""Refresh the generated parts of docs/: the GitHub Pages list in index.html
and the activity bars (YEARS / BARS) in js/index.js.

Needs a GitHub token in GITHUB_TOKEN or GH_TOKEN (falls back to `gh auth token`).
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
import xmlrpc.client
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path

USER = "eggplants"
FIRST_YEAR = 2018
DOCS = Path(__file__).resolve().parent.parent / "docs"
JST = timezone(timedelta(hours=9))

# repos whose Pages have no index.html are listed by file path; [] hides the repo
PAGES_PATHS = {
    "eggplants.github.io": [],
    "fushin": ["fushin/fushin.html"],
    "mb": ["mb/autoinstall.yaml", "mb/bootstrap.ps1", "mb/bootstrap.sh"],
    "setup-ubuntu.sh": ["setup-ubuntu.sh/autoinstall.yaml"],
}
# PyPI projects I co-maintain but did not create
PYPI_EXCLUDE = {"openapi-generator-cli"}


def token() -> str:
    t = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if t:
        return t
    return subprocess.run(["gh", "auth", "token"], capture_output=True, text=True, check=True).stdout.strip()


TOKEN = token()


def request(url: str, data: dict | None = None, auth: bool = True) -> tuple[object, dict]:
    headers = {"Accept": "application/vnd.github+json", "User-Agent": f"{USER}.github.io updater"}
    if auth and url.startswith("https://api.github.com/"):
        headers["Authorization"] = f"Bearer {TOKEN}"
    body = json.dumps(data).encode() if data is not None else None
    with urllib.request.urlopen(urllib.request.Request(url, body, headers), timeout=60) as res:
        return json.load(res), dict(res.headers)


def rest(path: str, auth: bool = True) -> list[dict]:
    """GET a paginated list endpoint."""
    url: str | None = f"https://api.github.com{path}"
    items: list[dict] = []
    while url:
        page, headers = request(url, auth=auth)
        items += page  # type: ignore[arg-type]
        m = re.search(r'<([^>]+)>; rel="next"', headers.get("Link", ""))
        url = m and m.group(1)
    return items


def graphql(query: str) -> dict:
    res, _ = request("https://api.github.com/graphql", {"query": query})
    if res.get("errors"):  # type: ignore[union-attr]
        sys.exit(f"GraphQL error: {res['errors']}")  # type: ignore[index]
    return res["data"]  # type: ignore[index]


def per_year(dates: list[str], years: list[int]) -> list[int]:
    c = Counter(d[:4] for d in dates)
    return [c[str(y)] for y in years]


def search_and_commits(years: list[int]) -> tuple[list[int], list[int], list[int]]:
    prs, issues, commits = [], [], []
    # one query per year: batching every year into one query times out (502/504)
    for y in years:
        q = f"author:{USER} -user:{USER} is:public created:{y}"
        d = graphql(
            f'{{ pr: search(query: "is:pr {q}", type: ISSUE, first: 0) {{ issueCount }}\n'
            f'issue: search(query: "is:issue {q}", type: ISSUE, first: 0) {{ issueCount }}\n'
            f'commit: user(login: "{USER}") {{ contributionsCollection(from: "{y}-01-01T00:00:00Z", '
            f'to: "{y}-12-31T23:59:59Z") {{ totalCommitContributions }} }} }}'
        )
        prs.append(d["pr"]["issueCount"])
        issues.append(d["issue"]["issueCount"])
        commits.append(d["commit"]["contributionsCollection"]["totalCommitContributions"])
    return prs, issues, commits


def pypi_first_uploads() -> list[str]:
    # pypi.org/user/<name>/ sits behind a JS challenge, so use the XML-RPC API
    names = [p for _, p in xmlrpc.client.ServerProxy("https://pypi.org/pypi").user_packages(USER)]
    firsts = []
    for name in sorted(set(names) - PYPI_EXCLUDE):
        try:
            d, _ = request(f"https://pypi.org/pypi/{name}/json")
        except urllib.error.HTTPError as e:
            if e.code == 404:  # registered but nothing uploaded
                continue
            raise
        uploads = [f["upload_time"] for files in d["releases"].values() for f in files]  # type: ignore[index]
        if uploads:
            firsts.append(min(uploads))
    return firsts


def sub1(pattern: str, repl, s: str) -> str:
    out, n = re.subn(pattern, repl, s, count=1, flags=re.S)
    if n != 1:
        sys.exit(f"pattern not found: {pattern}")
    return out


def update_pages(repos: list[dict]) -> None:
    active, archived = [], []
    for r in sorted((r for r in repos if r["has_pages"]), key=lambda r: r["name"]):
        (archived if r["archived"] else active).extend(PAGES_PATHS.get(r["name"], [r["name"]]))
    if not active:
        sys.exit("no GitHub Pages found")

    def ul(paths: list[str], indent: str) -> str:
        lis = "".join(f'\n{indent}  <li><a href="https://egpl.dev/{p}">{p}</a></li>' for p in paths)
        return f'{indent}<ul class="pages">{lis}\n{indent}</ul>'

    path = DOCS / "index.html"
    html = path.read_text()
    html = sub1(r'( *)<ul class="pages">.*?</ul>(?=\s*<details)', lambda m: ul(active, m.group(1)), html)
    html = sub1(r'(?<=<summary>Archived Repo pages</summary>\n)( *)<ul class="pages">.*?</ul>', lambda m: ul(archived, m.group(1)), html)
    path.write_text(html)


def update_activity(repos: list[dict], today: str) -> None:
    years = list(range(FIRST_YEAR, int(today[:4]) + 1))
    # the gists API rejects the Actions GITHUB_TOKEN (an installation token) with 403
    gists = rest(f"/users/{USER}/gists?per_page=100", auth=False)
    prs, issues, commits = search_and_commits(years)
    bars = {
        "New repos": per_year([r["created_at"] for r in repos if not r["fork"]], years),
        "PRs to other repos": prs,
        "Issues to other repos": issues,
        "New PyPI packages": per_year(pypi_first_uploads(), years),
        "Public gists": per_year([g["created_at"] for g in gists if g["public"]], years),
        "Public commits": commits,
    }

    path = DOCS / "js" / "index.js"
    js = path.read_text()
    js = sub1(r"const YEARS = \[.*?\];", lambda _: "const YEARS = " + json.dumps([str(y) for y in years]) + ";", js)
    for label, values in bars.items():
        print(f"{label}: {values}")
        js = sub1(
            rf'(\[\["[^"]*", "{re.escape(label)}"\], [^\n]*?, )\[[\d, ]*\]',
            lambda m: m.group(1) + json.dumps(values),
            js,
        )
    js = sub1(r'(d\.title = "– )\d{4}-\d{2}-\d{2}', lambda m: m.group(1) + today, js)
    path.write_text(js)


def main() -> None:
    today = datetime.now(JST).date().isoformat()
    repos = rest(f"/users/{USER}/repos?type=owner&per_page=100")
    update_pages(repos)
    update_activity(repos, today)


if __name__ == "__main__":
    main()
