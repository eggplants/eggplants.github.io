---
name: update-projects
description: Sync the Projects section (the PROJECTS and ARCHIVED lists in docs/js/index.js) with eggplants' GitHub repos. Use when asked to update or refresh the project list, to add a missing project, or to reflect newly archived repos.
---

# Update the project lists

The Projects section of egpl.dev is rendered from two hand-maintained arrays in
`docs/js/index.js`. `scripts/update.py` does **not** touch them.

- `PROJECTS`: public, non-fork, non-archived `eggplants/*` repos pushed within a
  year, plus co-maintained external repos (those carry a 6th element, the
  `owner/repo`; leave them alone unless the user says otherwise)
- `ARCHIVED`: every public, non-fork, archived `eggplants/*` repo

## Steps

1. Run the checker. It needs an authenticated `gh` and edits nothing:

   ```sh
   python3 .claude/skills/update-projects/check.py
   ```

   It prints what to add to `PROJECTS`, what to drop from it, what to add to
   `ARCHIVED` (with where to insert it), what to remove from `ARCHIVED`,
   ordering problems, and wrong years.

2. For each repo to add, read enough to describe it: `gh repo view
   eggplants/<name>`, its README (`gh api repos/eggplants/<name>/readme --jq
   .content | base64 -d`), and the file list or main script when the README
   says little. Never invent a description from the name alone.

3. Ask the user (AskUserQuestion, multiSelect) before:
   - adding a repo that may not be meant as a project: no description,
     practice or config repos, test repos
   - dropping a `PROJECTS` entry that fell out of the one-year window
   - removing an `ARCHIVED` entry

   When the user says a repo should never be listed, add it to `IGNORE` in
   `check.py` so it is not proposed again.

4. Edit `docs/js/index.js`, one entry per line, in the existing format:

   ```js
   // PROJECTS: [name, language, tags, [ja, en], created year, repo?]
   ["yamartx", "Go", ["cli"], ["Yamaha RTX ルータの設定を TOML で宣言的に管理する CLI", "Declaratively manages Yamaha RTX router configs with a TOML file"], 2026],
   // ARCHIVED: [name, language, tags, [ja, en], created year, archived year]
   ["getpiccoma", "Python", ["cli", "scraping"], ["ピッコマから画像を保存", "Saves images from Piccoma"], 2026, 2026],
   ```

   - **language**: GitHub's primary language, overridden when it misleads
     (e.g. `Markdown` for an awesome list, `YAML` for compose files). It must
     be a key of `LANG_COLORS`; if it is not, add it with its
     [linguist](https://github.com/github-linguist/linguist/blob/main/lib/linguist/languages.yml) color.
   - **tags**: 1–3 keys of `TAGS` (`cli`, `lib`, `scraping`, `app`, `server`,
     `dev`, `data`, `list`, `fun`, `study`, `maint`). Do not add new tags
     without asking.
   - **description**: one short phrase per language, no trailing period.
     Japanese puts half-width spaces between Japanese and Latin text
     (`API キーなしで DeepL 翻訳を使える CLI`); English starts with a verb or
     a noun phrase (`Saves images from …`, `CLI and library for …`).
   - **years**: created year from `createdAt`; archived year from `archivedAt`.
   - **placement**: `PROJECTS` is curated, not sorted; put a new entry next to
     ones with the same language or purpose. `ARCHIVED` is sorted by archived
     year desc, then created year desc, then name case-insensitively; use the
     position `check.py` prints.
   - A `PROJECTS` repo that got archived moves to `ARCHIVED` (append the
     archived year); remove its `PROJECTS` line.

5. Set the `(as of YYYY-MM-DD)` dates in the comments above both arrays to
   today.

6. Verify:
   - `node --check docs/js/index.js`
   - `check.py` again: every section should be `(0)`, except entries the user
     chose to keep
   - Optionally look at the page: `python3 -m http.server -d docs` and open the
     Projects section; the status chip counts should match the list lengths.

7. Report what was added, moved and removed, with the tags and descriptions you
   chose so the user can correct them. Commit only when asked (`chore: update
   projects`).
