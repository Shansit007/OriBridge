# Phase 6 — Production Audit

## 1. Deliverables present

| File | Purpose | Status |
|---|---|---|
| `index.html` | Single-page UI | ✔ |
| `style.css` | Responsive styling, offline | ✔ |
| `script.js` | Engine core + UI (single source of truth) | ✔ |
| `README.md` | Usage / deploy / dev | ✔ |
| `FINAL_RELEASE.md` | Deployment + risks + roadmap | ✔ |
| `tests/run.js` + corpus | Regression + unit tests | ✔ |
| `docs/*.md` | Phase 1–6 documentation | ✔ |

## 2. Requirements checklist

- [x] Input textarea, output textarea, Convert, Copy Output, Clear
- [x] Responsive (desktop + mobile breakpoint at 820px)
- [x] Fast conversion (<1 ms on the test corpus) + optional live mode
- [x] Works fully offline — no network, no fonts/CDN, no analytics
- [x] No login, no backend, no database, no API
- [x] Deployable on GitHub Pages / Netlify / Vercel / static hosting
- [x] Vowels, consonants, matras, halant, reph, conjuncts, ligatures,
      numerals, punctuation, reordering
- [x] Error handling (try/catch in UI; graceful degradation in core)

## 3. Quality gates

- **Correctness:** 254/254 words, exact character overlap on the supplied -99
  corpus; 10/10 unit cases. Reproducible via `node tests/run.js`.
- **No secrets / network calls:** core touches no `fetch`, `XMLHttpRequest`,
  `localStorage`, or cookies. (Clipboard write only, on user click.)
- **Self-contained:** no external scripts, fonts, or styles referenced.
- **Encoding hygiene:** input NFC-normalised; output is pure Windows‑1252-range
  glyph text suitable for PageMaker paste.

## 4. Known limitations / remaining risks

1. **Coverage breadth.** Validated on one ~600-word article. Glyphs not present
   in that corpus (listed in `validation-report.md` §5) rely on the GPL table at
   medium confidence. *Mitigation:* see §5 below — supply more pairs.
2. **Font version.** Targets AkrutiOriSarala-**99** specifically. The newer
   AkrutiOriSarala differs (e.g. reph marker, ma-phala). Using the output with a
   different Akruti font may misrender a few glyphs.
3. **Defective input.** Text that is already mojibake, or uses Devanagari code
   points for Odia, is out of scope.
4. **Right-to-paste in PageMaker.** PageMaker must have the AkrutiOriSarala-99
   font installed; OriBridge produces the codes, not the font.

## 5. What additional corpus would most improve accuracy

Short parallel snippets (Unicode + Akruti) containing, in priority order:
1. **Independent vowels** ଈ ଊ ଋ ଓ ଔ and **visarga** ଃ (e.g. ଈଶ୍ୱର, ଊଷା, ଋଷି,
   ଓଡ଼ିଶା, ଔଷଧ, ଦୁଃଖ).
2. **Rarer conjuncts**: ଙ୍ଘ ଞ୍ଝ ଶ୍ଛ ବ୍ଦ ବ୍ଧ ଲ୍ଗ ଳ୍ପ ଦ୍ଭ ଗ୍ଧ ଷ୍ଫ ସ୍ଖ.
3. Any words where a **second tall-letter i-allograph** might exist beyond
   ଖ/ଥ/ଧ (e.g. ଭି, ଶି variants) to confirm the allograph set.
4. **Headline/display** strings with unusual punctuation or stacked conjuncts.

A dozen such snippets would let us promote most medium-confidence rows to
corpus-confirmed.

## 6. Verdict

**Production-ready for AkrutiOriSarala-99 newspaper/DTP body text.** Exact on all
supplied ground truth; residual risk is confined to low-frequency glyphs that
are isolated, easy to spot-check, and easy to extend via the test harness.
