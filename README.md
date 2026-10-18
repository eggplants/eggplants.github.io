# [`@eggplants`](https://github.com/eggplants)' GitHub Pages

- <https://egpl.dev/afxdl>
- <https://egpl.dev/anal>
- <https://egpl.dev/cfts-solver>
- <https://egpl.dev/cookiecutter-python>
- <https://egpl.dev/deepl-cli>
- <https://egpl.dev/dojinvoice_db>
- <https://egpl.dev/edcb-bridge>
- <https://egpl.dev/eggplants.github.io>
- <https://egpl.dev/eijiro-to-sqlite>
- <https://egpl.dev/gemini>
- <https://egpl.dev/get-pixivpy-token>
- <https://egpl.dev/getjmanga>
- <https://egpl.dev/ghcr-badge>
- <https://egpl.dev/ghitter>
- <https://egpl.dev/godlo>
- <https://egpl.dev/gw2aws>
- <https://egpl.dev/install-playwright-python>
- <https://egpl.dev/jason-json>
- <https://egpl.dev/kdg-list>
- <https://egpl.dev/locloc>
- <https://egpl.dev/mb/autoinstall.yaml>
- <https://egpl.dev/mb/bootstrap.ps1>
- <https://egpl.dev/mb/bootstrap.sh>
- <https://egpl.dev/michikusa-works-checker>
- <https://egpl.dev/michixa>
- <https://egpl.dev/otpa>
- <https://egpl.dev/pixiv-bulk-downloader>
- <https://egpl.dev/pyjlyric>
- <https://egpl.dev/pyproject-fmt-py>
- <https://egpl.dev/rqw>
- <https://egpl.dev/saizeriya>
- <https://egpl.dev/sb2n>
- <https://egpl.dev/scrapbox-client>
- <https://egpl.dev/shindan-cli>
- <https://egpl.dev/subt>
- <https://egpl.dev/textpad>
- <https://egpl.dev/unicode-map>
- <https://egpl.dev/wafsolver>
- <https://egpl.dev/zutool>

<details><summary>Archived Repo pages</summary>

- <https://egpl.dev/ads>
- <https://egpl.dev/aegi>
- <https://egpl.dev/chobit-endless>
- <https://egpl.dev/contributter-ranking-bot>
- <https://egpl.dev/eng_vocab>
- <https://egpl.dev/fushin/fushin.html>
- <https://egpl.dev/fushin_dialogue>
- <https://egpl.dev/getcomici>
- <https://egpl.dev/getjump>
- <https://egpl.dev/getpiccoma>
- <https://egpl.dev/gettake>
- <https://egpl.dev/infosearch>
- <https://egpl.dev/jma-api-doc>
- <https://egpl.dev/kdb-tabulator>
- <https://egpl.dev/leap-day-correct-anchored>
- <https://egpl.dev/ls-dlp>
- <https://egpl.dev/my-best-python-project>
- <https://egpl.dev/nowlibcraw>
- <https://egpl.dev/pimg>
- <https://egpl.dev/practice_webpage>
- <https://egpl.dev/py3-gnupg>
- <https://egpl.dev/receipts>
- <https://egpl.dev/scheme-mirror>
- <https://egpl.dev/setup-ubuntu.sh/autoinstall.yaml>
- <https://egpl.dev/wiredify>
- <https://egpl.dev/xyz2png>
- <https://egpl.dev/y2m>
- <https://egpl.dev/zengaku_mypage>

</details>

<!--
  gh api --paginate "/users/eggplants/repos?per_page=100" \
    --jq '.[] | select(.has_pages) | [.name, .archived] | @tsv' |
    LC_ALL=C sort | awk -F'\t' '{print $2 == "true" ? "archived" : "active", "- <https://egpl.dev/" $1 ">"}'
  # NOTE: repos without docs/index.html (fushin, mb, setup-ubuntu.sh) are listed by file path
-->
