# OriBridge — Final Release (v1.0)

A production, offline, single-page Odia Unicode → AkrutiOriSarala-99 converter.
No backend, no database, no API, zero recurring cost.

## 1. Local testing

**Just open it** — no build:
```bash
# from the project folder
open index.html        # macOS
# or: xdg-open index.html   (Linux) / start index.html (Windows)
```
Or serve it (recommended, avoids any file:// quirks):
```bash
python3 -m http.server 8080      # then visit http://localhost:8080
# or:  npx serve .
```

Run the conversion tests:
```bash
node tests/run.js
# → 254/254 words, exact overlap = true, 10/10 unit cases, ALL TESTS PASSED
```

## 2. Deploy — GitHub Pages

```bash
git init
git add .
git commit -m "OriBridge v1.0"
git branch -M main
git remote add origin https://github.com/<you>/OriBridge.git
git push -u origin main
```
Then on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a
branch → Branch: `main` / root → Save.** Your site is live at
`https://<you>.github.io/OriBridge/` in ~1 minute. (It's a static site at repo
root, so no extra config is needed.)

## 3. Deploy — Netlify (free)

- **Drag & drop:** zip the folder (or drag the folder) onto
  <https://app.netlify.com/drop>. Done.
- **Git-based:** "Add new site → Import an existing project", pick the repo.
  Build command: *(leave empty)*. Publish directory: `.` (root).

## 4. Deploy — Vercel (free)

- "Add New → Project", import the repo.
- Framework preset: **Other**. Build command: *(none)*. Output directory: `.`.
- Deploy. (Or run `npx vercel` from the folder and accept defaults.)

## 5. Deploy — any shared hosting

Upload `index.html`, `style.css`, `script.js` (and optionally `docs/`,
`tests/`) to the web root via FTP/cPanel. No server runtime required.

## 6. Remaining risks (summary)

- Validated exactly on a real -99 newspaper article; **low-frequency glyphs**
  outside that corpus are at medium confidence — see
  `docs/production-audit.md` §4–5 for the exact list and the snippets that would
  close the gap.
- Targets AkrutiOriSarala-**99**; the newer AkrutiOriSarala font differs slightly.
- PageMaker must have the AkrutiOriSarala-99 font installed.

## 7. Future improvements

1. Fold in additional parallel snippets to promote medium-confidence rows to
   corpus-confirmed (test harness already supports this).
2. Optional **reverse** mode (Akruti-99 → Unicode) for round-tripping old files.
3. A toggle for the newer **AkrutiOriSarala** variant.
4. File-in / file-out (drag a `.txt`, download converted `.txt`).
5. Per-glyph "unknown character" highlighting for proofreading.

## 8. License

GPL-3.0 (derives from the GPL-3.0 OdiaWikimedia/Converter mapping). See `LICENSE`.
```
```
