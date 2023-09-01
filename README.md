# [`@eggplants`](https://github.com/eggplants)' GitHub Pages

- <https://egpl.dev/ads>
- <https://egpl.dev/aegi>
- <https://egpl.dev/anal>
- <https://egpl.dev/chobit-endless>
- <https://egpl.dev/contributter-ranking-bot>
- <https://egpl.dev/eggplants.github.io>
- <https://egpl.dev/eng_vocab>
- <https://egpl.dev/fushin>
- <https://egpl.dev/fushin_dialogue>
- <https://egpl.dev/gemini>
- <https://egpl.dev/ghitter>
- <https://egpl.dev/infosearch>
- <https://egpl.dev/jma-api-doc>
- <https://egpl.dev/kdb-tabulator>
- <https://egpl.dev/leap-day-correct-anchored>
- <https://egpl.dev/my-best-python-project>
- <https://egpl.dev/nowlibcraw>
- <https://egpl.dev/practice_webpage>
- <https://egpl.dev/receipts>
- <https://egpl.dev/scheme-mirror>
- <https://egpl.dev/sparqlwrapper>
- <https://egpl.dev/textpad>
- <https://egpl.dev/y2m>
- <https://egpl.dev/zengaku_mypage>

<!--
  : > _.json
  for i in {1..3}
  do
    gh api -H "Accept: application/vnd.github+json" \
           -H "X-GitHub-Api-Version: 2022-11-28" "/users/eggplants/repos?per_page=100&page=$i" |
           jq . >> _.json
  done
  sed -z 's/\]\.\[//g' _.json > _
  mv _ _.json
  jq '.[] | select(.has_pages) | .name' -r _.json | sed 's;^.*;- <https://egpl.dev/&>;'
-->
