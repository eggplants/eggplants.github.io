(function () {
  "use strict";

  // rotate the emoji title
  let t = document.title.split(/(?<=)/u);
  const rotate = (a, n) => a.slice(n % a.length).concat(a.slice(0, n % a.length));
  setInterval(() => {
    document.title = (t = rotate(t, 2)).join("");
  }, 500);

  const YEARS = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];
  const BARS = [
    [["新規の自作リポジトリ", "New repos"], ["fork を除く", "excluding forks"], [1, 15, 35, 66, 30, 14, 10, 5, 27]],
    [["外部への PR", "PRs to other repos"], null, [0, 12, 43, 148, 151, 39, 31, 107, 26]],
    [["外部への Issue", "Issues to other repos"], null, [0, 4, 86, 101, 126, 46, 54, 126, 73]],
    [["PyPI の新規パッケージ", "New PyPI packages"], null, [0, 0, 4, 12, 16, 7, 5, 1, 13]],
    [["公開 gist", "Public gists"], null, [0, 85, 93, 116, 33, 12, 38, 11, 21]],
    [["公開 commit", "Public commits"], null, [11, 317, 1023, 1960, 1635, 1260, 1316, 975, 1702]],
  ];

  // [name, language, tags, [ja, en], created year, repo (default: eggplants/<name>)]
  // non-archived eggplants repos pushed within a year (as of 2026-10-18), plus maintained external ones
  const PROJECTS = [
    ["deepl-cli", "Python", ["cli", "lib", "scraping"], ["API キーなしで DeepL 翻訳を使える CLI", "DeepL Translator CLI that works without an API key"], 2020],
    ["get-pixivpy-token", "Python", ["cli"], ["pixivpy 用のトークン取得を自動化", "Gets your pixiv token for pixivpy"], 2021],
    ["openapi-generator-cli", "Python", ["cli", "dev", "maint"], ["PyPI 版 OpenAPI Generator", "PyPI release of OpenAPI Generator"], 2019, "OpenAPITools/openapi-generator-pip"],
    ["install-playwright-python", "Python", ["lib", "dev"], ["Python から playwright install を実行する", "Runs playwright install from Python"], 2022],
    ["ghcr-badge", "Python", ["server", "dev"], ["ghcr.io のコンテナのバッジを生成する API", "Status badge API for ghcr.io containers"], 2022],
    ["getjmanga", "Python", ["cli", "scraping"], ["日本の Web コミック配信 130 以上のサイトから画像を保存", "Saves images from 130+ Japanese web comic sites"], 2026],
    ["pixiv-bulk-downloader", "Python", ["cli", "scraping"], ["pixiv の作品を一括ダウンロード", "Bulk downloader for pixiv"], 2020],
    ["mantela-editor", "TypeScript", ["app", "maint"], ["趣味の IP 電話網「東京広域電話網」の Mantela 編集 UI", "Mantela editor for tkytel, a hobbyist IP phone network in Tokyo"], 2025, "tkytel/mantela-editor"],
    ["awesome-japanese-censored-words", "Markdown", ["list", "data"], ["日本語の禁止語・自主規制語の情報源をまとめた Awesome リスト", "Awesome list of sources of Japanese censored words"], 2022],
    ["awesome-nano-syntax-highlighting", "Python", ["list", "dev"], ["GNU nano のシンタックスハイライト定義をまとめた Awesome リスト", "Curated GNU nano syntax highlighting files"], 2026],
    ["dojinvoice_db", "Python", ["cli", "data", "scraping"], ["DLsite の同人音声作品のデータベースを作る CLI", "CLI that builds a database of DLsite doujin voice works"], 2020],
    ["zutool", "Python", ["cli", "lib"], ["頭痛ーるの非公式 API ラッパー", "Unofficial API wrapper for zutool (頭痛ーる), a headache forecast service"], 2023],
    ["saizeriya", "Python", ["cli", "fun"], ["サイゼリヤのテーブル注文を CLI/TUI で", "Unofficial CLI/TUI client for Saizeriya's table ordering"], 2026],
    ["shindan-cli", "Python", ["cli", "lib", "fun"], ["診断メーカーの CLI とライブラリ", "CLI and library for ShindanMaker"], 2021],
    ["pyjlyric", "Python", ["lib", "scraping"], ["日本語の歌詞サイトから歌詞を集めるライブラリ", "Fetches lyrics from Japanese lyric sites"], 2023],
    ["wafsolver", "Python", ["lib", "scraping"], ["AWS WAF のチャレンジを解く", "Solves AWS WAF challenges"], 2026],
    ["cfts-solver", "Python", ["lib", "scraping"], ["Cloudflare Turnstile を解く", "Solves Cloudflare Turnstile"], 2026],
    ["sb2n", "Python", ["cli"], ["Cosense (Scrapbox) から Notion への移行ツール", "Migrates Cosense (Scrapbox) pages to Notion"], 2026],
    ["scrapbox-client", "Python", ["cli", "lib"], ["Cosense (Scrapbox) の API クライアントと CLI", "API client and CLI for Cosense (Scrapbox)"], 2025],
    ["michixa", "Svelte", ["app"], ["道草屋ばっくやーどの非公式漫画ビューア", "Unofficial manga viewer for Michikusaya Backyard"], 2026],
    ["michikusa-works-checker", "HTML", ["app"], ["道草屋の作品の買い忘れチェッカー", "Checks which Michikusaya works you haven't bought yet"], 2026],
    ["eijiro-to-sqlite", "Python", ["cli", "data"], ["英辞郎の辞書データを SQLite に変換", "Converts the Eijiro dictionary to SQLite"], 2022],
    ["rqw", "Python", ["lib", "data"], ["SPARQL エンドポイントの Python ラッパー", "SPARQL endpoint wrapper for Python"], 2026],
    ["dbpedia-japanese-mirror", "HTML", ["server", "data"], ["DBpedia Japanese の SPARQL エンドポイントをどこでも立てる", "Hosts a DBpedia Japanese SPARQL endpoint anywhere"], 2026],
    ["edcb-bridge", "Python", ["server"], ["KonomiTV から EPGStation / mirakc を使うための EDCB CtrlCmd 互換ブリッジ", "EDCB CtrlCmd-compatible bridge to EPGStation / mirakc for KonomiTV"], 2026],
    ["composefiles", "YAML", ["server"], ["自宅サーバ用の Docker Compose ファイル集", "My Docker Compose files"], 2021],
    ["locloc", "Python", ["app", "server", "dev"], ["オンラインの LOC カウンタとバッジ", "Online LOC counter and badge"], 2023],
    ["godlo", "Kotlin", ["app", "scraping"], ["yt-dlp / gallery-dl / getjmanga を使う Android 向けダウンローダ", "Android downloader using yt-dlp / gallery-dl / getjmanga"], 2026],
    ["afxdl", "Python", ["cli", "scraping"], ["aphextwin.warp.net から音源をダウンロード", "Downloads audio from aphextwin.warp.net"], 2024],
    ["jason-json", "Python", ["cli", "scraping", "fun"], ["ジェーソン (jason.co.jp) の店舗情報を JSON に", "Builds JSON from the store list of Jason, a discount supermarket"], 2022],
    ["tsumanne", "Ruby", ["lib"], ["tsumanne.net の API ラッパー", "API wrapper for tsumanne.net"], 2023],
    ["subt", "Python", ["cli"], ["字幕ファイルを翻訳する", "Translates subtitle files"], 2024],
    ["otpa", "Python", ["cli", "lib"], ["otpauth:// と otpauth-migration:// のリンクを相互変換", "Converts between otpauth:// and otpauth-migration:// links"], 2026],
    ["gw2aws", "Python", ["cli", "dev"], ["Google Workspace 経由の AWS への SAML ログインを Playwright で", "SAML login to AWS via Google Workspace using Playwright"], 2026],
    ["pyproject-fmt-py", "Python", ["cli", "lib", "dev"], ["pyproject-fmt を純 Python で再実装した pyproject.toml フォーマッタ", "pyproject.toml formatter in pure Python, a reimplementation of pyproject-fmt"], 2026],
    ["cookiecutter-python", "Python", ["dev"], ["自作 Python プロジェクト用の Cookiecutter テンプレート", "Cookiecutter template for my Python projects"], 2026],
    ["gh-starlist", "Go", ["cli", "dev"], ["GitHub の Star リストを扱う gh 拡張", "GitHub CLI extension for GitHub Star Lists"], 2026],
    ["slgo", "Go", ["cli", "fun"], ["sl / sl-h コマンドの Go 移植", "Go port of the sl / sl-h commands"], 2026],
    ["contributter.sh", "Shell", ["cli", "fun"], ["Contributter をターミナルで", "Contributter on the terminal"], 2021],
    ["mb", "Shell", ["dev"], ["macOS・Termux・Ubuntu・Windows・NanoPi R6S で共通の mise 設定", "My global mise config for macOS, Termux, Ubuntu, Windows and NanoPi R6S"], 2026],
    ["homebrew-tap", "Ruby", ["dev"], ["自作ツールの Homebrew tap", "Homebrew tap for my tools"], 2023],
    ["validate-ubuntu-autoinstall-docker", "Dockerfile", ["dev"], ["Ubuntu Server の autoinstall 設定を Docker 上で検証", "Validates Ubuntu Server autoinstall configs on Docker"], 2026],
  ];
  // [name, language, tags, [ja, en], created year, archived year]
  // public non-fork archived eggplants repos (as of 2026-11-19), most recently archived first
  const ARCHIVED = [
    ["getcomici", "Python", ["cli", "scraping"], ["コミチ+ 系の漫画配信サイトから画像を保存", "Saves images from manga sites built on Comici+"], 2026, 2026],
    ["getpiccoma", "Python", ["cli", "scraping"], ["ピッコマから画像を保存", "Saves images from Piccoma"], 2026, 2026],
    ["setup-nanopi", "Shell", ["dev"], ["NanoPi の環境構築（mise-bootstrap に移行）", "NanoPi setup (moved to mise-bootstrap)"], 2026, 2026],
    ["aws-localstack-devcontainer", "Shell", ["dev"], ["Terraform AWS Provider を LocalStack で試す devcontainer", "Devcontainer sandbox for the Terraform AWS Provider on LocalStack"], 2025, 2026],
    ["netatmo-gas", "TypeScript", ["server"], ["Netatmo のデータを GAS で Slack に通知", "Posts Netatmo station data to Slack with GAS"], 2025, 2026],
    ["devcontainer-lefthook-asdf-bug-test", "Dockerfile", ["dev"], ["devcontainer で lefthook と asdf を使ったときの不具合の再現", "Bug repro for lefthook + asdf in a devcontainer"], 2024, 2026],
    ["gettake", "Python", ["cli", "scraping"], ["Web コミックガンマから画像を保存", "Saves images from Web Comic Gamma"], 2024, 2026],
    ["SetupWindows.ps1", "PowerShell", ["dev"], ["Windows の環境構築", "My Windows desktop setup"], 2024, 2026],
    ["zelda-shrine-list", "Jupyter Notebook", ["data"], ["ゼルダの伝説 ティアーズ オブ ザ キングダムの祠一覧を作る", "Builds a list of shrines in Zelda: Tears of the Kingdom"], 2023, 2026],
    ["berkeleydb-stubs", "Python", ["dev"], ["Berkeley DB の Python バインディングの型スタブ", "Typing stubs for the Python bindings of Berkeley DB"], 2022, 2026],
    ["harusa-posgresql-docker-test", "YAML", ["study"], ["Hasura + PostgreSQL を Docker Compose で試す", "Trying Hasura + PostgreSQL with Docker Compose"], 2022, 2026],
    ["my-best-python-project", "Python", ["dev"], ["バッジ・CLI・Docker・CI/CD・型ヒントなどを揃えた Python プロジェクトの見本", "Sample Python project with badges, CLI, Docker, CI/CD, type hints and more"], 2022, 2026],
    ["setup-os.sh", "Shell", ["dev"], ["OS の環境構築スクリプト", "OS setup script"], 2022, 2026],
    [".emacs.d", "Emacs Lisp", ["dev"], ["Emacs の設定", "My Emacs config"], 2021, 2026],
    ["get-twitter-shortened-url", "Python", ["cli", "lib"], ["URL を t.co で短縮したリンクを得る", "Gets t.co shortened links for URLs"], 2021, 2026],
    ["getjump", "Python", ["cli", "scraping"], ["GigaViewer 系の漫画配信サイトから画像を保存", "Saves images from manga sites built on GigaViewer"], 2021, 2026],
    ["setup-macos.sh", "Shell", ["dev"], ["macOS の環境構築（mise-bootstrap に移行）", "macOS setup (moved to mise-bootstrap)"], 2021, 2026],
    ["setup-termux.sh", "Shell", ["dev"], ["Termux の環境構築（mise-bootstrap に移行）", "Termux setup (moved to mise-bootstrap)"], 2021, 2026],
    ["setup-ubuntu.sh", "Shell", ["dev"], ["Ubuntu の環境構築（mise-bootstrap に移行）", "Ubuntu setup (moved to mise-bootstrap)"], 2021, 2026],
    ["sh-xmas", "Shell", ["cli", "fun"], ["ターミナルにクリスマスツリーを植える", "Plants Christmas trees on your terminal"], 2021, 2026],
    ["sl-h_binary", "Roff", ["fun"], ["sl にパッチを当てた sl-h のバイナリ", "Binaries of sl-h, a patched sl"], 2021, 2026],
    ["xeyes-docker", "Dockerfile", ["fun"], ["xeyes を Docker で", "xeyes on Docker"], 2021, 2026],
    ["esp32", "C++", ["study"], ["MicroPython と Arduino IDE で ESP32 を触る", "Playing with ESP32 via MicroPython and the Arduino IDE"], 2020, 2026],
    ["maskat", "JavaScript", ["data"], ["マスカットフレームワーク 2.3.0 のソースのアーカイブ", "Archive of the Maskat Framework 2.3.0 source"], 2025, 2025],
    ["uv-dynamic-versioning-fallback-test", "Python", ["dev"], ["uv-dynamic-versioning の fallback の検証", "Test for uv-dynamic-versioning's fallback"], 2025, 2025],
    ["dlsite-recommendation-llm", "Python", ["data"], ["LLM で DLsite の音声作品をおすすめする", "Recommends DLsite voice works with an LLM"], 2024, 2025],
    ["shikanoko", "Rust", ["cli", "fun"], ["「しか」「のこ」「こし」「たん」をランダムに出し、しかのこのこのここしたんたんが n 回揃うまで続ける", "Prints しか / のこ / こし / たん at random until しかのこのこのここしたんたん comes up n times"], 2024, 2025],
    ["xyz2png", "Python", ["cli"], [".xyz ファイルを .png に変換", "Converts .xyz files to .png"], 2024, 2025],
    ["cooklang-recipes", "Shell", ["data"], ["Cooklang で書いたレシピ集", "My recipes written in Cooklang"], 2023, 2025],
    ["gemmi-stubs", "Python", ["dev"], ["gemmi の型スタブ", "Typing stubs for gemmi"], 2023, 2025],
    ["heartbeat-status", "Python", ["server"], ["Fitbit の心拍の状態をオンラインで確認", "Checks Fitbit heartbeat status online"], 2023, 2025],
    ["pakuri_ch", "JavaScript", ["app", "fun"], ["ぱくりチャンネル（作りかけ）", "Pakuri Channel (WIP)"], 2023, 2025],
    ["wiredify", "Python", ["cli", "lib", "fun"], ["バビブベボをヴァヴィヴヴェヴォに変換", "Converts ba-bi-bu-be-bo into va-vi-vu-ve-vo in Japanese kana"], 2023, 2025],
    ["dlMEGA", "Shell", ["cli", "scraping"], ["mega.nz のファイルダウンローダ", "File downloader for mega.nz"], 2022, 2025],
    ["mkbook", "Python", ["cli"], ["画像のディレクトリを PDF の本にする", "Turns a directory of images into a PDF book"], 2022, 2025],
    ["netatmo", "Python", ["cli"], ["Netatmo のステーションのデータを取得（作りかけ）", "Fetches Netatmo station data (WIP)"], 2022, 2025],
    ["wordle-dic", "Shell", ["data"], ["Wordle で使える単語の辞書（毎日自動更新）", "Dictionary of valid Wordle words, updated daily"], 2022, 2025],
    ["pimg", "Python", ["cli", "lib"], ["クリップボードの画像の保存と、画像のクリップボードへのコピー", "Saves clipboard images and copies images to the clipboard"], 2021, 2025],
    ["popcat", "TypeScript", ["server", "fun"], ["curl で Pop Cat", "Pop Cat from curl"], 2021, 2025],
    ["laughing-broccoli", "YAML", ["dev"], ["GitHub Actions の実験場", "My GitHub Actions sandbox"], 2020, 2025],
    ["susurutvmap-geojson", "jq", ["data"], ["SUSURU TV. のマップを GeoJSON に", "SUSURU TV. map as GeoJSON"], 2024, 2024],
    ["twvideo-dl", "Python", ["cli", "scraping"], ["X (Twitter) の動画をダウンロードする CLI", "CLI for downloading videos from X (Twitter)"], 2023, 2024],
    ["niji-100k", "Jupyter Notebook", ["data"], ["にじさんじのライバーを登録者 10 万人の達成順に並べたリスト", "Nijisanji livers in the order they reached 100k subscribers"], 2021, 2024],
    ["dotfiles", "Shell", ["dev"], ["設定ファイル集", "My dotfiles"], 2020, 2024],
    ["nijisanji-v23d-status", "Shell", ["data"], ["にじさんじの 2.0 / 3.0 / 3D の実装状況と登録者数の表を作る", "Table of Nijisanji livers' 2.0 / 3.0 / 3D models and subscriber counts"], 2020, 2024],
    ["progression-flash-archive", "ActionScript", ["data"], ["Flash 向けフレームワーク Progression の SVN アーカイブ", "SVN archive of Progression, a framework for Adobe Flash"], 2023, 2023],
    ["apollo-client-sample", "TypeScript", ["study"], ["Apollo Client の練習で作ったクエリフォーム", "Query form made to learn Apollo Client"], 2022, 2023],
    ["asciiquarium-docker", "Dockerfile", ["fun"], ["asciiquarium を Docker で", "asciiquarium on Docker"], 2022, 2023],
    ["calil-openapi", "YAML", ["data", "dev"], ["カーリル図書館 API の非公式 OpenAPI 定義", "Unofficial OpenAPI definition of the Calil library API"], 2022, 2023],
    ["fushin", "Nim", ["cli", "scraping"], ["日本不審者情報センターの不審者セリフ集をダウンロード", "Downloads the suspicious-person quotes from fushinsha-joho.co.jp"], 2022, 2023],
    ["klis-sotsuron-template", "TeX", ["dev"], ["筑波大学 知識情報・図書館学類の卒論執筆環境", "Thesis writing setup for KLIS, University of Tsukuba"], 2022, 2023],
    ["networkx-stubs", "Python", ["dev"], ["NetworkX の型スタブ", "Typing stubs for NetworkX"], 2022, 2023],
    ["ocaml-lecture", "OCaml", ["study"], ["授業「プログラム言語論 I」の課題", "Coursework for Programming Languages I"], 2022, 2023],
    ["oxford-dic.sh", "Shell", ["cli"], ["Oxford Dictionaries API を Bash で", "Oxford Dictionaries API in Bash"], 2022, 2023],
    ["rendakun.py", "Python", ["cli", "fun"], ["連打くんの Python 版", "Rendakun in Python"], 2022, 2023],
    ["reportlab-stubs", "Python", ["dev"], ["ReportLab の型スタブ", "Typing stubs for ReportLab"], 2022, 2023],
    ["sparql50", "Shell", ["study", "data"], ["「SPARQL 50 本ノック」の自分の解答", "My answers to the SPARQL 50 exercises"], 2022, 2023],
    ["tic-tac-toe", "TypeScript", ["study"], ["React チュートリアルの三目並べを TypeScript で", "The React tutorial's tic-tac-toe in TypeScript"], 2022, 2023],
    ["action-dispatch-test", "YAML", ["dev"], ["GitHub Actions から別の Action を呼び出し、終了を待って結果を受け取る", "Calls another GitHub Action from an Action, waits for it and gets the result"], 2021, 2023],
    ["ads", "HTML", ["app", "fun"], ["広告を延々と流し続けるページ", "Endless ad distributor"], 2021, 2023],
    ["aegi", "JavaScript", ["app", "fun"], ["FoxTail さんの「喋らせている最中にちょっかいを出すやつ」を改変", "A remake of FoxTail's talk-interrupting toy"], 2021, 2023],
    ["aovec", "Python", ["cli", "data"], ["青空文庫の全書籍から Word2Vec モデルを作る（構築済みモデルつき）", "Builds a Word2Vec model from all Aozora Bunko books, prebuilt model included"], 2021, 2023],
    ["atcoder-docker", "Dockerfile", ["dev"], ["AtCoder の全言語の処理系入り Docker イメージ", "Docker image with every AtCoder language toolchain"], 2021, 2023],
    ["ayashii-sed", "Shell", ["cli", "fun"], ["怪しい日本語に変換する cjp.js の sed 実装", "cjp.js, a weird-Japanese converter, in sed"], 2021, 2023],
    ["chmd", "Ruby", ["cli", "dev"], ["GitHub リポジトリ向けの CHANGELOG.md 生成", "CHANGELOG.md generator for GitHub repos"], 2021, 2023],
    ["cl-crd", "Common Lisp", ["lib"], ["レファレンス協同データベースの Common Lisp クライアント", "Collaborative Reference Database client for Common Lisp"], 2021, 2023],
    ["colorImgScale", "Python", ["data"], ["色彩イメージスケールと Word2Vec の実験", "Experiments on color image scales with Word2Vec"], 2021, 2023],
    ["de-no", "TypeScript", ["app", "fun"], ["で〜の.deno.dev", "で〜の.deno.dev"], 2021, 2023],
    ["deeplabcut-trainer", "Jupyter Notebook", ["data"], ["DeepLabCut の学習用ノートブック", "Notebook for training DeepLabCut models"], 2021, 2023],
    ["face-symmetrizer", "Jupyter Notebook", ["lib", "fun"], ["画像に写った顔を左右対称にする", "Makes the faces in an image symmetric"], 2021, 2023],
    ["i2aa-jave", "Shell", ["cli", "fun"], ["JavE で画像を AA に変換", "Converts images to ASCII art with JavE"], 2021, 2023],
    ["infosci2021", "Java", ["study"], ["授業「情報科学 I」での Java の練習", "Java practice for the Information Science I class"], 2021, 2023],
    ["infosearch", "Python", ["study"], ["授業「情報検索システム」のノート", "Notes for the Information Retrieval Systems class"], 2021, 2023],
    ["jsmr", "Shell", ["scraping", "data"], ["DLsite の音声作品を違法アップロードするサイト Japanese ASMR の分析", "Analysis of Japanese ASMR, a site illegally uploading DLsite voice works"], 2021, 2023],
    ["kdb-tabulator", "HTML", ["app"], ["筑波大学のシラバス KdB の閲覧ページ", "Browser for KdB, the University of Tsukuba e-syllabus"], 2021, 2023],
    ["kenall-city-extract", "TeX", ["study"], ["授業「テキスト処理」の課題: KEN_ALL.CSV から市を抽出して LaTeX でレポート", "Text processing coursework: extracting cities from KEN_ALL.CSV, reported in LaTeX"], 2021, 2023],
    ["makescript", "Makefile", ["fun"], ["Makefile でシェルスクリプトを書く", "Writing shell scripts as Makefiles"], 2021, 2023],
    ["mice-behavior-tracking", "Jupyter Notebook", ["data"], ["マウスの動きをリアルタイムで追跡", "Real-time tracking of mouse movements"], 2021, 2023],
    ["mice-cable-remover", "Jupyter Notebook", ["data"], ["マウスの動画から緑のケーブルを除去するフィルタを作る", "Builds a filter that removes the green cable from mouse videos"], 2021, 2023],
    ["mice-freeze-detection", "Python", ["data"], ["マウスのすくみ行動の検出（作りかけ）", "Freezing behavior detection for mice (WIP)"], 2021, 2023],
    ["nlp100-Docker", "Dockerfile", ["dev"], ["言語処理 100 本ノック用の Docker イメージ", "Docker image for the NLP 100 exercises"], 2021, 2023],
    ["nowlibcraw", "Python", ["cli", "scraping"], ["図書館システムから新着資料の情報を集める", "Collects new arrivals from a library system"], 2021, 2023],
    ["parser", "Ruby", ["study"], ["Ruby でのパーサ実験", "Parser experiments in Ruby"], 2021, 2023],
    ["pyside-test", "Python", ["study"], ["PySide の使い方とビルドの練習", "Practice using and building PySide"], 2021, 2023],
    ["pytesst", "Shell", ["cli"], ["pytesseract を試す", "Trying pytesseract"], 2021, 2023],
    ["random-nipple-player", "Python", ["app", "fun"], ["音声作品 RJ323807 用のランダムプレイヤー", "Random player for the voice work RJ323807"], 2021, 2023],
    ["raspico", "Python", ["study"], ["Raspberry Pi Pico を触る", "Playing with Raspberry Pi Pico"], 2021, 2023],
    ["satoshi", "Python", ["fun"], ["ツイートからマルコフ連鎖で文を作る bot", "Bot that generates text from tweets with Markov chains"], 2021, 2023],
    ["shtris-docker", "Dockerfile", ["fun"], ["shtris を Docker で", "shtris on Docker"], 2021, 2023],
    ["simpleverse", "Python", ["lib"], ["versatileapi の Python ラッパー", "Python wrapper for versatileapi"], 2021, 2023],
    ["soft-engineering", "C", ["study"], ["授業「ソフトウェア工学」の課題", "Coursework for Software Engineering"], 2021, 2023],
    ["sres", "Shell", ["cli"], ["Sublist3r でサブドメインを列挙してレスポンスを確認", "Enumerates subdomains with Sublist3r and checks their responses"], 2021, 2023],
    ["susuru", "Shell", ["cli", "fun"], ["ずるずる", "Zuru zuru (slurp)"], 2021, 2023],
    ["twlist2list", "Shell", ["cli"], ["Twitter のリストのユーザを自分のリストに移す", "Moves users on a Twitter list to your own list"], 2021, 2023],
    ["unko.lisp", "Common Lisp", ["study", "fun"], ["Common Lisp パッケージの見本", "Sample Common Lisp package"], 2021, 2023],
    ["voicevox_docker", "Dockerfile", ["server"], ["VOICEVOX を Docker で", "VOICEVOX on Docker"], 2021, 2023],
    ["websh.sh", "Shell", ["cli", "fun"], ["websh を Bash から", "websh from Bash"], 2021, 2023],
    ["clisp-practice", "Common Lisp", ["study"], ["Common Lisp 入門の練習", "Learning Common Lisp"], 2020, 2023],
    ["data_exp", "HTML", ["study"], ["授業「データ表現と処理」の課題", "Coursework for Data Representation and Processing"], 2020, 2023],
    ["deepl-select-jump", "JavaScript", ["app"], ["選択テキストを右クリックで DeepL 翻訳に送る Chrome 拡張", "Chrome extension that sends selected text to DeepL from the context menu"], 2020, 2023],
    ["dojinvoice-api", "Python", ["server", "data"], ["dojinvoice_db を使う Flask + SQLAlchemy の API", "Flask + SQLAlchemy API on top of dojinvoice_db"], 2020, 2023],
    ["doonroom_db", "Python", ["cli", "data", "scraping"], ["ブログ「同人音声の部屋」の非公式データベース", "Unofficial database of the blog Doujin Onsei no Heya"], 2020, 2023],
    ["hyricsdic", "Text", ["data"], ["Hyrics の単語の意味一覧を機械的に抽出", "Word meanings extracted from Hyrics"], 2020, 2023],
    ["kusogayoh", "Shell", ["data", "fun"], ["「クソが代」のツイート 8116 件の診断結果アーカイブ", "Archive of 8,116 tweeted results of Kusogayo"], 2020, 2023],
    ["latex-docs", "TeX", ["dev"], ["LaTeX の CI のテスト", "LaTeX CI test"], 2020, 2023],
    ["learning_xml", "HTML", ["study"], ["授業「マークアップ言語」の課題", "Coursework for the Markup Languages class"], 2020, 2023],
    ["microbit", "Python", ["study"], ["MicroPython で micro:bit を触る", "Playing with micro:bit in MicroPython"], 2020, 2023],
    ["nla", "Markdown", ["study"], ["授業「自然言語解析基礎」のメモ", "Notes for the Natural Language Analysis class"], 2020, 2023],
    ["practice_webpage", "HTML", ["study"], ["Web ページ作りの練習", "Web page practice"], 2020, 2023],
    ["proglang", "C", ["study"], ["授業「プログラム言語論」のノート", "Notes for the Programming Languages class"], 2020, 2023],
    ["prolog-practice", "Prolog", ["study"], ["Prolog の手習い", "Learning Prolog"], 2020, 2023],
    ["receipts", "Ragel", ["fun"], ["ReceiptLine の作例", "ReceiptLine examples"], 2020, 2023],
    ["scheme-mirror", "HTML", ["data"], ["Scheme 入門ページのミラー", "Mirror of a Scheme tutorial"], 2020, 2023],
    ["studentCrawl", "Ruby", ["scraping"], ["筑波大生の公開ホームページをクロール", "Crawls the public home pages of University of Tsukuba students"], 2020, 2023],
    ["twitter-weathername-action", "Python", ["fun"], ["GitHub Actions で Twitter の名前を今日の天気予報にする", "Updates your Twitter name to today's forecast with GitHub Actions"], 2020, 2023],
    ["unko_mark", "Ruby", ["app", "study"], ["Ruby CGI + XSLT の書籍検索エンジン", "Book search engine with Ruby CGI + XSLT"], 2020, 2023],
    ["wbsv-cli", "Python", ["cli", "scraping"], ["ページとそのリンク先をまとめて Wayback Machine に保存する CLI", "CLI that archives a page and all its links to the Wayback Machine"], 2020, 2023],
    ["yomiage-openjt", "Shell", ["fun"], ["Open JTalk に台本を読み上げさせる", "Makes Open JTalk read scripts aloud"], 2020, 2023],
    ["eng_vocab", "HTML", ["app", "study"], ["英単語の学習ページ", "English vocabulary study page"], 2019, 2023],
    ["etoyear", "Shell", ["cli", "fun"], ["干支と西暦の対応表を出すコマンド", "Prints a list of Chinese zodiac years"], 2019, 2023],
    ["gpa", "Shell", ["cli"], ["筑波大学の GPA を計算するコマンド", "GPA calculator for the University of Tsukuba"], 2019, 2023],
    ["markdowns", "HTML", ["study"], ["雑多な Markdown 置き場", "Miscellaneous Markdown notes"], 2019, 2023],
    ["PdfSyllabusParse", "Ruby", ["data"], ["筑波大学のシラバス PDF を JSON / CSV / TSV にパース", "Parses the University of Tsukuba syllabus PDF into JSON / CSV / TSV"], 2019, 2023],
    ["pixiv-tag-analyzer", "Python", ["data", "scraping"], ["pixiv ユーザのタグから性癖を暴く", "Reveals a pixiv user's peculiar tastes from their tags"], 2019, 2023],
    ["shellscraping", "Shell", ["scraping"], ["Bash でのスクレイピング集", "Scraping in Bash"], 2019, 2023],
    ["twitter_app", "Python", ["fun"], ["Twitter と LINE の bot のおもちゃ", "Toy Twitter and LINE bots"], 2019, 2023],
    ["weblio_scrape", "Ruby", ["scraping"], ["Weblio 英和辞典をスクレイピング", "Scrapes the Weblio English-Japanese dictionary"], 2019, 2023],
    ["pybsddb-mirror", "Python", ["data"], ["pybsddb の非公式 Git ミラー", "Unofficial Git mirror of pybsddb"], 2022, 2022],
    ["reportlab-mirror", "Python", ["data"], ["ReportLab の Git ミラー（Mercurial から変換）", "Git mirror of ReportLab, converted from Mercurial"], 2022, 2022],
    ["kdbjs", "JavaScript", ["cli", "scraping"], ["筑波大学のシラバスを twinte-parser で CLI からダウンロード", "Downloads the University of Tsukuba syllabus from the CLI with twinte-parser"], 2021, 2022],
    ["self-intro", "Markdown", ["fun"], ["自己紹介スライド", "Self-introduction slides"], 2021, 2022],
    ["tulips_opac_new", "HTML", ["scraping", "data"], ["筑波大学附属図書館の新着資料 bot", "New arrivals bot for the University of Tsukuba Library"], 2021, 2022],
    ["zengaku_mypage", "CSS", ["study"], ["学生時代の個人ホームページ", "My old university home page"], 2020, 2022],
    ["gh-matome", "Shell", ["cli"], ["指定したユーザのリポジトリ一覧を作る", "Lists the repos owned by a given user"], 2021, 2021],
    ["jma-api-doc", "Markdown", ["data", "dev"], ["気象庁サイトの予報 API のメモ", "Notes on the forecast API behind jma.go.jp"], 2021, 2021],
    ["chobit-endless", "Vue", ["app", "study"], ["Nuxt で作りかけた chobit 用プレイヤー", "Unfinished Nuxt player for chobit"], 2020, 2021],
    ["fushin_dialogue", "HTML", ["app", "fun"], ["日本不審者情報センターの不審者セリフ集を読むページ", "Page for reading the suspicious-person quotes from fushinsha-joho.co.jp"], 2020, 2021],
    ["nuxt_tutor", "JavaScript", ["study"], ["Nuxt の練習", "Learning Nuxt"], 2020, 2021],
    ["opac", "CSS", ["study"], ["授業「知識情報演習」の OPAC 作成", "Building an OPAC for the Knowledge and Information Practice class"], 2019, 2021],
    ["shellgeibot-tweet-archive", "Jupyter Notebook", ["data"], ["シェル芸 bot のツイートのアーカイブ", "Archive of tweets by the shellgei bot"], 2019, 2021],
    ["18_prog2", "Ruby", ["study"], ["授業「計算機プログラミング演習 II」の解答", "My answers for the Computer Programming Lab II class"], 2019, 2020],
    ["genkaio", "Ruby", ["cli", "fun"], ["限界しりとりでズルをするための補助 CLI", "Helper CLI for cheating at genkai shiritori"], 2019, 2020],
    ["sudoku", "Python", ["cli", "fun"], ["数独ソルバ", "Sudoku solver"], 2019, 2020],
    ["f_down", "Ruby", ["cli", "scraping"], ["ふたば☆ちゃんねるのスレッドを tsumanne 経由で保存", "Futaba Channel thread downloader via tsumanne"], 2018, 2020],
  ];
  const TAGS = {
    cli: ["CLI", "CLI"],
    lib: ["ライブラリ", "Library"],
    scraping: ["スクレイピング", "Scraping"],
    app: ["アプリ", "App"],
    server: ["サーバ", "Server"],
    dev: ["開発ツール", "Dev tools"],
    data: ["データ", "Data"],
    list: ["リスト", "List"],
    fun: ["ネタ", "Just for fun"],
    study: ["授業・練習", "Coursework & practice"],
    maint: ["共同メンテ", "Co-maintained"],
  };
  const STATUSES = {
    active: ["アクティブ", "Active"],
    archived: ["アーカイブ", "Archived"],
    all: ["すべて", "All"],
  };
  const LANG_COLORS = {
    Python: "#3572a5", TypeScript: "#3178c6", Go: "#00add8", Shell: "#89e051", Ruby: "#cc342d", Kotlin: "#a97bff",
    Svelte: "#ff3e00", HTML: "#e34c26", Dockerfile: "#384d54", Markdown: "#083fa1", YAML: "#cb171e",
    JavaScript: "#f1e05a", "Jupyter Notebook": "#da5b0b", TeX: "#3d6117", "Common Lisp": "#3fb68b", CSS: "#563d7c",
    C: "#555555", "C++": "#f34b7d", Java: "#b07219", PHP: "#4f5d95", Rust: "#dea584", Vue: "#41b883",
    OCaml: "#ef7a08", Nim: "#ffc200", Prolog: "#74283c", "Emacs Lisp": "#c065db", PowerShell: "#012456",
    ActionScript: "#882b0f", Makefile: "#427819", Ragel: "#9d5200", Roff: "#ecdebe", jq: "#c7254e",
  };

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  // append <span data-lang="ja">…</span><span data-lang="en">…</span>
  const i18n = (parent, [ja, en]) => {
    const a = el("span", null, ja);
    a.dataset.lang = "ja";
    const b = el("span", null, en);
    b.dataset.lang = "en";
    parent.append(a, b);
    return parent;
  };
  const yearHeader = (grid) => {
    grid.appendChild(el("div", "spacer"));
    const h = el("div", "ycols");
    YEARS.forEach((y, i) => {
      const partial = i === YEARS.length - 1;
      const d = el("div", "yhead" + (partial ? " partial" : ""), "’" + y.slice(2));
      if (partial) d.title = "– 2026-11-19";
      h.appendChild(d);
    });
    grid.appendChild(h);
  };
  // endless footer river: repeat the image set until half the track covers the
  // viewport, so translateX(-50%) loops seamlessly at any width
  const RIVER_SPEED = 25; // px/s
  const river = (r) => {
    const track = r.querySelector(".river-track");
    const unit = [...track.children];
    let copies = 0;
    const fill = () => {
      const w = unit.reduce((s, img) => s + img.getBoundingClientRect().width, 0);
      if (!w) return;
      const n = Math.max(1, Math.ceil(r.clientWidth / w));
      if (n === copies) return;
      copies = n;
      const imgs = [];
      for (let i = 0; i < n * 2; i++) unit.forEach((img) => imgs.push(i ? img.cloneNode() : img));
      track.replaceChildren(...imgs);
      r.style.setProperty("--river-duration", (n * w) / RIVER_SPEED + "s");
      r.classList.add("on");
    };
    new ResizeObserver(fill).observe(r);
  };
  // project cards with single-select status / language / tag filters (AND between them);
  // the language / tag chips only offer values found under the current status
  const projects = () => {
    const list = document.getElementById("projects-list");
    const count = document.getElementById("projects-count");
    const filter = { status: "active", lang: null, tag: null };
    const card = ({ name, lang, tags, desc, repo, since, until }) => {
      const li = el("li", until ? "archived" : null);
      const top = el("div", "ptop");
      const a = el("a", null, name);
      a.href = "https://github.com/" + (repo || "eggplants/" + name);
      const pl = el("span", "plang", lang);
      if (LANG_COLORS[lang]) pl.style.setProperty("--dot", LANG_COLORS[lang]);
      top.append(a, pl);
      const d = el("p");
      d.append(i18n(el("span"), desc));
      const tg = el("div", "ptags");
      tags.forEach((k) => tg.appendChild(i18n(el("span"), TAGS[k].map((x) => "#" + x))));
      // created year – archived year; open-ended while active
      const span = (sep) => (until === since ? String(since) : since + sep + (until || ""));
      const foot = el("div", "pfoot");
      foot.append(tg, i18n(el("span", "pyears"), [span("〜"), span("–")]));
      li.append(top, d, foot);
      list.appendChild(li);
      return li;
    };
    const items = [
      ...PROJECTS.map(([name, lang, tags, desc, since, repo]) => ({ name, lang, tags, desc, since, repo })),
      ...ARCHIVED.map(([name, lang, tags, desc, since, until]) => ({ name, lang, tags, desc, since, until })),
    ];
    items.forEach((it) => (it.li = card(it)));
    const inStatus = (it, s) => s === "all" || (s === "archived") === !!it.until;
    const has = { status: inStatus, lang: (it, v) => it.lang === v, tag: (it, v) => it.tags.includes(v) };
    const update = () => {
      const scope = items.filter((it) => inStatus(it, filter.status));
      let n = 0;
      items.forEach((it) => {
        it.li.hidden = !Object.keys(filter).every((k) => !filter[k] || has[k](it, filter[k]));
        if (!it.li.hidden) n++;
      });
      count.replaceChildren();
      i18n(count, n === scope.length ? [`全 ${n} 件`, `${n} projects`] : [`${scope.length} 件中 ${n} 件`, `${n} of ${scope.length}`]);
    };
    // values: [value, [ja, en]]; null = "All"
    const chips = (row, key, values, pool) => {
      row.querySelectorAll(".chip").forEach((c) => c.remove());
      const btns = values.map(([v, label]) => {
        const b = i18n(el("button", "chip"), label);
        b.type = "button";
        if (v !== null) b.appendChild(el("small", null, String(pool.filter((it) => has[key](it, v)).length)));
        b.setAttribute("aria-pressed", String(v === filter[key]));
        b.addEventListener("click", () => {
          filter[key] = v;
          btns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          if (key === "status") subChips();
          update();
        });
        row.appendChild(b);
        return b;
      });
    };
    const byCount = (f) => (a, b) => f(b) - f(a) || a.localeCompare(b);
    const ALL = [null, ["すべて", "All"]];
    const subChips = () => {
      const scope = items.filter((it) => inStatus(it, filter.status));
      const langs = [...new Set(scope.map((it) => it.lang))];
      langs.sort(byCount((l) => scope.filter((it) => it.lang === l).length));
      const tags = Object.keys(TAGS).filter((k) => scope.some((it) => it.tags.includes(k)));
      if (!langs.includes(filter.lang)) filter.lang = null;
      if (!tags.includes(filter.tag)) filter.tag = null;
      chips(document.getElementById("filter-lang"), "lang", [ALL, ...langs.map((l) => [l, [l, l]])], scope);
      chips(document.getElementById("filter-tag"), "tag", [ALL, ...tags.map((k) => [k, TAGS[k]])], scope);
    };
    chips(document.getElementById("filter-status"), "status", Object.entries(STATUSES), items);
    subChips();
    update();
  };
  const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n));

  // the initial language is set by the inline script in <head>
  const setLang = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.setLang === lang));
    });
    document.querySelectorAll("[data-aria-" + lang + "]").forEach((e) => {
      e.setAttribute("aria-label", e.getAttribute("data-aria-" + lang));
      if (e.tagName === "BUTTON") e.title = e.getAttribute("data-aria-" + lang);
    });
  };

  // rainbow: turn --hue once per HUE_PERIOD while the rainbow theme is on
  const HUE_PERIOD = 1500; // ms
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let hueFrame = 0;
  const spinHue = (now) => {
    document.documentElement.style.setProperty("--hue", ((now / HUE_PERIOD) * 360) % 360 + "deg");
    hueFrame = requestAnimationFrame(spinHue);
  };
  const syncHue = () => {
    cancelAnimationFrame(hueFrame);
    document.documentElement.style.removeProperty("--hue");
    hueFrame = document.documentElement.dataset.theme === "rainbow" && !reduceMotion.matches ? requestAnimationFrame(spinHue) : 0;
  };
  reduceMotion.addEventListener("change", syncHue);

  // the initial theme is set by the inline script in <head>; "system" = no data-theme
  const setTheme = (theme) => {
    if (theme === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
    // keep the meta in step with data-theme; rainbow follows the system scheme
    document.querySelector('meta[name="color-scheme"]').content = theme === "light" || theme === "dark" ? theme : "light dark";
    document.querySelectorAll("[data-set-theme]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.setTheme === theme));
    });
    syncHue();
  };

  document.addEventListener("DOMContentLoaded", () => {
    const prefs = document.querySelector(".prefs");
    prefs.addEventListener("click", (ev) => {
      const btn = ev.target.closest("[data-set-lang], [data-set-theme]");
      if (!btn) return;
      const { setLang: lang, setTheme: theme } = btn.dataset;
      if (lang) setLang(lang);
      else setTheme(theme);
      try {
        if (lang) localStorage.setItem("lang", lang);
        else if (theme === "system") localStorage.removeItem("theme");
        else localStorage.setItem("theme", theme);
      } catch (e) {}
    });
    setLang(document.documentElement.lang === "en" ? "en" : "ja");
    const topbar = document.querySelector(".topbar");
    new IntersectionObserver(([e]) => topbar.classList.toggle("at-top", e.isIntersecting), {
      rootMargin: `-${topbar.offsetHeight}px 0px 0px 0px`,
    }).observe(document.querySelector(".aa-fig .aa"));
    topbar.querySelector(".home").addEventListener("click", (ev) => {
      ev.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    });
    setTheme(document.documentElement.dataset.theme || "system");
    // keep other open tabs in sync
    window.addEventListener("storage", (ev) => {
      if (ev.key === "lang" && (ev.newValue === "ja" || ev.newValue === "en")) setLang(ev.newValue);
      else if (ev.key === "theme" || ev.key === null) setTheme(["light", "dark", "rainbow"].includes(ev.newValue) ? ev.newValue : "system");
    });

    document.querySelectorAll(".river").forEach(river);
    // per-card hue offset in the rainbow theme
    document.querySelectorAll(".links li").forEach((li, i) => li.style.setProperty("--i", i));
    projects();

    const b = document.getElementById("bars-grid");
    yearHeader(b);
    BARS.forEach(([name, sub, values], row) => {
      const lab = i18n(el("div", "label"), name);
      lab.style.setProperty("--i", row); // per-row hue offset in the rainbow theme
      if (sub) lab.appendChild(i18n(el("small"), sub));
      b.appendChild(lab);
      const cols = el("div", "ycols");
      const max = Math.max(...values);
      values.forEach((v, i) => {
        const cell = el("div", "bcell");
        cell.style.setProperty("--i", i); // per-year hue offset in the rainbow theme
        cell.title = YEARS[i] + ": " + v.toLocaleString("en-US");
        cell.appendChild(el("span", "v", fmt(v)));
        const bar = el("span", "b");
        bar.style.height = (max ? Math.max(1, Math.round((v / max) * 60)) : 1) + "px";
        cell.appendChild(bar);
        cols.appendChild(cell);
      });
      b.appendChild(cols);
    });
  });
})();
