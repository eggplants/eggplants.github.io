#!/usr/bin/env python3
"""Refresh the generated parts of the site: the GitHub Pages list in
docs/index.html, README.md and docs/sitemap.xml, and the activity bars
(YEARS / BARS) in docs/js/index.js.

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
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from http import HTTPStatus
from pathlib import Path
from typing import TYPE_CHECKING, Any, cast

if TYPE_CHECKING:
    from collections.abc import Callable

USER = "eggplants"
FIRST_YEAR = 2018
ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
SITE = "https://egpl.dev/"
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


def request(url: str, data: dict | None = None, *, auth: bool = True) -> tuple[Any, dict]:
    headers = {"Accept": "application/vnd.github+json", "User-Agent": f"{USER}.github.io updater"}
    if auth and url.startswith("https://api.github.com/"):
        headers["Authorization"] = f"Bearer {TOKEN}"
    body = json.dumps(data).encode() if data is not None else None
    with urllib.request.urlopen(urllib.request.Request(url, body, headers), timeout=60) as res:
        return json.load(res), dict(res.headers)


def rest(path: str, *, auth: bool = True) -> list[dict]:
    """GET a paginated list endpoint."""
    url: str | None = f"https://api.github.com{path}"
    items: list[dict] = []
    while url:
        page, headers = request(url, auth=auth)
        items += page
        m = re.search(r'<([^>]+)>; rel="next"', headers.get("Link", ""))
        url = m and m.group(1)
    return items


def graphql(query: str) -> dict:
    res, _ = request("https://api.github.com/graphql", {"query": query})
    if res.get("errors"):
        sys.exit(f"GraphQL error: {res['errors']}")
    return res["data"]


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
    roles = cast("list[list[str]]", xmlrpc.client.ServerProxy("https://pypi.org/pypi").user_packages(USER))
    names = [p for _, p in roles]
    firsts = []
    for name in sorted(set(names) - PYPI_EXCLUDE):
        try:
            d, _ = request(f"https://pypi.org/pypi/{name}/json")
        except urllib.error.HTTPError as e:
            if e.code == HTTPStatus.NOT_FOUND:  # registered but nothing uploaded
                continue
            raise
        uploads = [f["upload_time"] for files in d["releases"].values() for f in files]
        if uploads:
            firsts.append(min(uploads))
    return firsts


def sub1(pattern: str, repl: Callable[[re.Match[str]], str], s: str) -> str:
    out, n = re.subn(pattern, repl, s, count=1, flags=re.DOTALL)
    if n != 1:
        sys.exit(f"pattern not found: {pattern}")
    return out


def update_pages(repos: list[dict]) -> tuple[list[str], list[str]]:
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
    html = sub1(
        r'(?<=<summary>Archived Repo pages</summary>\n)( *)<ul class="pages">.*?</ul>',
        lambda m: ul(archived, m.group(1)),
        html,
    )
    path.write_text(html)
    return active, archived


def update_readme(active: list[str], archived: list[str]) -> None:
    def ul(paths: list[str]) -> str:
        return "".join(f"- <{SITE}{p}>\n" for p in paths)

    def badge(workflow: str) -> str:
        url = f"https://github.com/{USER}/{USER}.github.io/actions/workflows/{workflow}"
        return f"[![{workflow}]({url}/badge.svg)]({url})\n"

    (ROOT / "README.md").write_text(
        f"# [`@{USER}`](https://github.com/{USER})' GitHub Pages\n\n"
        f"{badge('ci.yml')}{badge('update.yml')}\n{ul(active)}\n"
        f"<details><summary>Archived Repo pages</summary>\n\n{ul(archived)}\n</details>\n\n"
        "<!-- generated by scripts/update.py -->\n"
    )


def last_modified(url: str) -> str | None:
    """Last-Modified of a page as JST ISO 8601; None if it is not served."""
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": f"{USER}.github.io updater"})
    try:
        with urllib.request.urlopen(req, timeout=60) as res:
            lm = res.headers.get("Last-Modified")
    except urllib.error.HTTPError as e:
        print(f"sitemap: skip {url} ({e.code})")
        return None
    return parsedate_to_datetime(lm).astimezone(JST).isoformat() if lm else ""


def update_sitemap(paths: list[str], today: str) -> None:
    # repos are served as directories; only HTML files are worth indexing among file paths
    urls = sorted(SITE + (p if "/" in p else p + "/") for p in paths if "/" not in p or p.endswith(".html"))
    with ThreadPoolExecutor(8) as ex:
        mods = list(ex.map(last_modified, urls))
    top = (
        f"  <url>\n    <loc>{SITE}</loc>\n    <priority>1.0</priority>\n    <lastmod>{today}T00:00:00+09:00</lastmod>\n"
    )
    entries = [top + "  </url>\n"]
    for url, mod in zip(urls, mods, strict=True):
        if mod is None:
            continue
        lastmod = f"    <lastmod>{mod}</lastmod>\n" if mod else ""
        entries.append(f"  <url>\n    <loc>{url}</loc>\n{lastmod}  </url>\n")
    (DOCS / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n' + "".join(entries) + "</urlset>\n"
    )


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
            lambda m, values=values: m.group(1) + json.dumps(values),
            js,
        )
    # the en dash matches the date suffix of the bar tooltips in index.js
    js = sub1(r'(d\.title = "– )\d{4}-\d{2}-\d{2}', lambda m: m.group(1) + today, js)  # noqa: RUF001
    path.write_text(js)


def main() -> None:
    today = datetime.now(JST).date().isoformat()
    repos = rest(f"/users/{USER}/repos?type=owner&per_page=100")
    active, archived = update_pages(repos)
    update_readme(active, archived)
    update_sitemap(active + archived, today)
    update_activity(repos, today)


if __name__ == "__main__":
    main()
