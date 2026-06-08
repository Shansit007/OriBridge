# OriBridge

**Odia Unicode (Nirmala UI / MS Word) → AkrutiOriSarala-99 converter for Adobe
PageMaker 7.0.** Single-page web app, 100% offline, no login, no backend, no
build step.

![status](https://img.shields.io/badge/corpus%20accuracy-100%25%20exact-3ecf8e)
![offline](https://img.shields.io/badge/runs-fully%20offline-2ea7e0)

## Why

Newspaper / DTP shops still set Odia in Adobe PageMaker 7.0 using the legacy
8-bit **AkrutiOriSarala-99** font. Modern text (web, MS Word, Nirmala UI) is
Unicode and cannot be pasted into that workflow directly. OriBridge converts
logical-order Unicode Odia into the visual-order AkrutiOriSarala-99 code stream:
paste the result into PageMaker and apply the AkrutiOriSarala-99 font.

## Use it

1. Open `index.html` in any modern browser (or your deployed URL).
2. Paste Unicode Odia into the left box.
3. Click **Convert →**, then **Copy Output**.
4. In PageMaker 7.0, paste into a text frame and apply **AkrutiOriSarala-99**.

Shortcuts: **Ctrl/Cmd + Enter** converts. Toggle **Live convert** for as-you-type.

## Project structure

```
OriBridge/
├── index.html          # UI
├── style.css           # styling (no external assets)
├── script.js           # conversion engine + UI (single source of truth)
├── README.md
├── FINAL_RELEASE.md    # deployment, risks, roadmap
├── tests/
│   ├── run.js          # node tests/run.js  → regression + unit tests
│   ├── input_unicode.txt
│   └── expected_akruti.txt
└── docs/
    ├── research-report.md
    ├── mapping-spec.md
    ├── validation-report.md
    ├── conversion-engine-design.md
    ├── test-cases.md
    └── production-audit.md
```

## How it works (one paragraph)

AkrutiOriSarala-99 is an ISFOC-style glyph font: text is stored in *visual*
order as Windows‑1252 bytes, one per glyph, with no shaping by the application.
OriBridge parses Unicode into orthographic **clusters** and emits each in visual
order — reordering left matras (େ ୋ ୌ ୈ), placing the **reph** (`ð`) after its
consonant, selecting precomposed conjunct glyphs (longest-match) or building them
from half-forms, applying the i-kara tall allograph (`ô` after ଖ/ଥ/ଧ), and
mapping Odia digits to ASCII. Full detail in `docs/`.

## Testing

```bash
node tests/run.js
```
Expected: `254/254 words`, `exact overlap = true`, `10/10 unit cases`,
`ALL TESTS PASSED`. No dependencies — plain Node ≥ 12.

## Accuracy & scope

Validated **byte-for-byte** against a real AkrutiOriSarala-99 newspaper article.
Low-frequency glyphs not present in that corpus are carried from the source
mapping table at medium confidence — see `docs/validation-report.md` §5 and
`docs/production-audit.md`. To improve coverage, add parallel snippets to
`tests/` and re-run.

## Credits & license

Conversion mapping foundation adapted and inverted from the GPL-3.0
[OdiaWikimedia/Converter](https://github.com/OdiaWikimedia/Converter) by
**Manoj Sahukar** and **Subhashish Panigrahi**, then validated/corrected for the
AkrutiOriSarala-99 variant against a supplied corpus. Because it derives from
that table, OriBridge is released under **GPL-3.0** (see `LICENSE`).
