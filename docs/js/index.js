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
    [["新規の自作リポジトリ", "New repos"], ["fork を除く", "excluding forks"], [1, 15, 35, 66, 31, 14, 10, 6, 23]],
    [["外部への PR", "PRs to other repos"], null, [0, 12, 43, 148, 151, 39, 31, 107, 24]],
    [["外部への Issue", "Issues to other repos"], null, [0, 4, 86, 101, 126, 46, 54, 126, 59]],
    [["PyPI の新規パッケージ", "New PyPI packages"], null, [0, 0, 4, 12, 16, 7, 5, 1, 13]],
    [["公開 gist", "Public gists"], null, [0, 85, 93, 116, 33, 12, 39, 11, 18]],
    [["公開 commit", "Public commits"], null, [11, 317, 1023, 1960, 1635, 1260, 1316, 982, 1404]],
  ];

  // [name, language, tags, [ja, en], repo (default: eggplants/<name>)]
  // non-archived eggplants repos pushed within a year (as of 2026-10-18), plus maintained external ones
  const PROJECTS = [
    ["deepl-cli", "Python", ["cli", "lib", "scraping"], ["API キーなしで DeepL 翻訳を使える CLI", "DeepL Translator CLI that works without an API key"]],
    ["get-pixivpy-token", "Python", ["cli"], ["pixivpy 用のトークン取得を自動化", "Gets your pixiv token for pixivpy"]],
    ["openapi-generator-cli", "Python", ["cli", "dev", "maint"], ["PyPI 版 OpenAPI Generator", "PyPI release of OpenAPI Generator"], "OpenAPITools/openapi-generator-pip"],
    ["install-playwright-python", "Python", ["lib", "dev"], ["Python から playwright install を実行する", "Runs playwright install from Python"]],
    ["ghcr-badge", "Python", ["server", "dev"], ["ghcr.io のコンテナのバッジを生成する API", "Status badge API for ghcr.io containers"]],
    ["getjmanga", "Python", ["cli", "scraping"], ["日本の Web コミック配信 130 以上のサイトから画像を保存", "Saves images from 130+ Japanese web comic sites"]],
    ["pixiv-bulk-downloader", "Python", ["cli", "scraping"], ["pixiv の作品を一括ダウンロード", "Bulk downloader for pixiv"]],
    ["mantela-editor", "TypeScript", ["app", "maint"], ["趣味の IP 電話網「東京広域電話網」の Mantela 編集 UI", "Mantela editor for tkytel, a hobbyist IP phone network in Tokyo"], "tkytel/mantela-editor"],
    ["awesome-japanese-censored-words", "Markdown", ["list", "data"], ["日本語の禁止語・自主規制語の情報源をまとめた Awesome リスト", "Awesome list of sources of Japanese censored words"]],
    ["awesome-nano-syntax-highlighting", "Python", ["list", "dev"], ["GNU nano のシンタックスハイライト定義をまとめた Awesome リスト", "Curated GNU nano syntax highlighting files"]],
    ["dojinvoice_db", "Python", ["cli", "data", "scraping"], ["DLsite の同人音声作品のデータベースを作る CLI", "CLI that builds a database of DLsite doujin voice works"]],
    ["zutool", "Python", ["cli", "lib"], ["頭痛ーるの非公式 API ラッパー", "Unofficial API wrapper for zutool (頭痛ーる), a headache forecast service"]],
    ["saizeriya", "Python", ["cli", "fun"], ["サイゼリヤのテーブル注文を CLI/TUI で", "Unofficial CLI/TUI client for Saizeriya's table ordering"]],
    ["shindan-cli", "Python", ["cli", "lib", "fun"], ["診断メーカーの CLI とライブラリ", "CLI and library for ShindanMaker"]],
    ["pyjlyric", "Python", ["lib", "scraping"], ["日本語の歌詞サイトから歌詞を集めるライブラリ", "Fetches lyrics from Japanese lyric sites"]],
    ["wafsolver", "Python", ["lib", "scraping"], ["AWS WAF のチャレンジを解く", "Solves AWS WAF challenges"]],
    ["cfts-solver", "Python", ["lib", "scraping"], ["Cloudflare Turnstile を解く", "Solves Cloudflare Turnstile"]],
    ["sb2n", "Python", ["cli"], ["Cosense (Scrapbox) から Notion への移行ツール", "Migrates Cosense (Scrapbox) pages to Notion"]],
    ["scrapbox-client", "Python", ["cli", "lib"], ["Cosense (Scrapbox) の API クライアントと CLI", "API client and CLI for Cosense (Scrapbox)"]],
    ["michixa", "Svelte", ["app"], ["道草屋ばっくやーどの非公式漫画ビューア", "Unofficial manga viewer for Michikusaya Backyard"]],
    ["michikusa-works-checker", "HTML", ["app"], ["道草屋の作品の買い忘れチェッカー", "Checks which Michikusaya works you haven't bought yet"]],
    ["eijiro-to-sqlite", "Python", ["cli", "data"], ["英辞郎の辞書データを SQLite に変換", "Converts the Eijiro dictionary to SQLite"]],
    ["rqw", "Python", ["lib", "data"], ["SPARQL エンドポイントの Python ラッパー", "SPARQL endpoint wrapper for Python"]],
    ["dbpedia-japanese-mirror", "HTML", ["server", "data"], ["DBpedia Japanese の SPARQL エンドポイントをどこでも立てる", "Hosts a DBpedia Japanese SPARQL endpoint anywhere"]],
    ["edcb-bridge", "Python", ["server"], ["KonomiTV から EPGStation / mirakc を使うための EDCB CtrlCmd 互換ブリッジ", "EDCB CtrlCmd-compatible bridge to EPGStation / mirakc for KonomiTV"]],
    ["composefiles", "YAML", ["server"], ["自宅サーバ用の Docker Compose ファイル集", "My Docker Compose files"]],
    ["locloc", "Python", ["app", "server", "dev"], ["オンラインの LOC カウンタとバッジ", "Online LOC counter and badge"]],
    ["godlo", "Kotlin", ["app", "scraping"], ["yt-dlp / gallery-dl / getjmanga を使う Android 向けダウンローダ", "Android downloader using yt-dlp / gallery-dl / getjmanga"]],
    ["afxdl", "Python", ["cli", "scraping"], ["aphextwin.warp.net から音源をダウンロード", "Downloads audio from aphextwin.warp.net"]],
    ["jason-json", "Python", ["cli", "scraping", "fun"], ["ジェーソン (jason.co.jp) の店舗情報を JSON に", "Builds JSON from the store list of Jason, a discount supermarket"]],
    ["tsumanne", "Ruby", ["lib"], ["tsumanne.net の API ラッパー", "API wrapper for tsumanne.net"]],
    ["subt", "Python", ["cli"], ["字幕ファイルを翻訳する", "Translates subtitle files"]],
    ["otpa", "Python", ["cli", "lib"], ["otpauth:// と otpauth-migration:// のリンクを相互変換", "Converts between otpauth:// and otpauth-migration:// links"]],
    ["gw2aws", "Python", ["cli", "dev"], ["Google Workspace 経由の AWS への SAML ログインを Playwright で", "SAML login to AWS via Google Workspace using Playwright"]],
    ["pyproject-fmt-py", "Python", ["cli", "lib", "dev"], ["pyproject-fmt を純 Python で再実装した pyproject.toml フォーマッタ", "pyproject.toml formatter in pure Python, a reimplementation of pyproject-fmt"]],
    ["cookiecutter-python", "Python", ["dev"], ["自作 Python プロジェクト用の Cookiecutter テンプレート", "Cookiecutter template for my Python projects"]],
    ["gh-starlist", "Go", ["cli", "dev"], ["GitHub の Star リストを扱う gh 拡張", "GitHub CLI extension for GitHub Star Lists"]],
    ["slgo", "Go", ["cli", "fun"], ["sl / sl-h コマンドの Go 移植", "Go port of the sl / sl-h commands"]],
    ["contributter.sh", "Shell", ["cli", "fun"], ["Contributter をターミナルで", "Contributter on the terminal"]],
    ["mb", "Shell", ["dev"], ["macOS・Termux・Ubuntu・Windows・NanoPi R6S で共通の mise 設定", "My global mise config for macOS, Termux, Ubuntu, Windows and NanoPi R6S"]],
    ["homebrew-tap", "Ruby", ["dev"], ["自作ツールの Homebrew tap", "Homebrew tap for my tools"]],
    ["validate-ubuntu-autoinstall-docker", "Dockerfile", ["dev"], ["Ubuntu Server の autoinstall 設定を Docker 上で検証", "Validates Ubuntu Server autoinstall configs on Docker"]],
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
    maint: ["共同メンテ", "Co-maintained"],
  };
  const LANG_COLORS = {
    Python: "#3572a5", TypeScript: "#3178c6", Go: "#00add8", Shell: "#89e051", Ruby: "#cc342d", Kotlin: "#a97bff",
    Svelte: "#ff3e00", HTML: "#e34c26", Dockerfile: "#384d54", Markdown: "#083fa1", YAML: "#cb171e",
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
      if (partial) d.title = "– 2026-10-17";
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
  // project cards with single-select language / tag filters (AND between the two)
  const projects = () => {
    const list = document.getElementById("projects-list");
    const count = document.getElementById("projects-count");
    const filter = { lang: null, tag: null };
    const items = PROJECTS.map(([name, lang, tags, desc, repo]) => {
      const li = el("li");
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
      li.append(top, d, tg);
      list.appendChild(li);
      return { li, lang, tags };
    });
    const update = () => {
      let n = 0;
      items.forEach(({ li, lang, tags }) => {
        li.hidden = !((!filter.lang || lang === filter.lang) && (!filter.tag || tags.includes(filter.tag)));
        if (!li.hidden) n++;
      });
      count.replaceChildren();
      i18n(count, n === items.length ? [`全 ${n} 件`, `${n} projects`] : [`${items.length} 件中 ${n} 件`, `${n} of ${items.length}`]);
    };
    const chips = (row, key, values, label) => {
      const btns = [null, ...values].map((v) => {
        const b = el("button", "chip");
        b.type = "button";
        if (v === null) i18n(b, ["すべて", "All"]);
        else {
          i18n(b, label(v));
          b.appendChild(el("small", null, String(items.filter((it) => (key === "lang" ? it.lang === v : it.tags.includes(v))).length)));
        }
        b.setAttribute("aria-pressed", String(v === null));
        b.addEventListener("click", () => {
          filter[key] = v;
          btns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          update();
        });
        row.appendChild(b);
        return b;
      });
    };
    const byCount = (f) => (a, b) => f(b) - f(a) || a.localeCompare(b);
    const langs = [...new Set(PROJECTS.map((p) => p[1]))];
    langs.sort(byCount((l) => PROJECTS.filter((p) => p[1] === l).length));
    chips(document.getElementById("filter-lang"), "lang", langs, (l) => [l, l]);
    chips(document.getElementById("filter-tag"), "tag", Object.keys(TAGS), (k) => TAGS[k]);
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

  // the initial theme is set by the inline script in <head>; "system" = no data-theme
  const setTheme = (theme) => {
    if (theme === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
    document.querySelectorAll("[data-set-theme]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.setTheme === theme));
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    const prefs = document.querySelector(".prefs");
    prefs.hidden = false;
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
    setTheme(document.documentElement.dataset.theme || "system");

    document.querySelectorAll(".river").forEach(river);
    projects();

    const b = document.getElementById("bars-grid");
    yearHeader(b);
    BARS.forEach(([name, sub, values]) => {
      const lab = i18n(el("div", "label"), name);
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
