# Phase 3 — Validation Report (mapping vs. supplied -99 corpus)

## 1. Method

The supplied parallel corpus (Unicode `tests/input_unicode.txt` ↔ Akruti
`tests/expected_akruti.txt`) was run through the engine and compared
**word-by-word** and **character-exact**. Two corpus artifacts were normalised:

1. The Unicode sample is **truncated mid-paragraph 4**, while the Akruti
   reference continues. Validation therefore covers the **overlapping region**:
   each input line capped at its own word count (4 paragraphs, 254 words).
2. The Akruti paste contains stray **U+FE0F** variation selectors (the
   Windows‑1252 bytes `© ™ ®` were auto-converted to emoji presentation during
   copy). These are paste noise, not part of the encoding, and are stripped
   before comparison. **The engine correctly emits the bare `© ™ ®`.**

## 2. Result

```
word accuracy : 254/254  (100.00%)
exact overlap : true        ← byte-for-byte identical over the 4 paragraphs
unit cases    : 10/10 PASS
```

Reproduce with `node tests/run.js`.

## 3. Confirmed mappings (evidence from corpus)

| Feature | Evidence (Unicode → Akruti) | Status |
|---|---|---|
| Reph after consonant, before matra | ଦୁର୍ନୀତି → `\ê^ðúZò` | ✔ confirmed |
| Reph word-final cluster | କର୍ମ → `Kcð` | ✔ |
| Reph over conjunct | ସମ୍ପୂର୍ଣ୍ଣ → `iµì‰ð` | ✔ |
| Left e-matra reorder | ...ମରେ → `...cùe` | ✔ |
| Split au-matra around conjunct | ସିଦ୍ଧୌର → `iòù¡øe` | ✔ |
| Split ai-matra | ସୁନୈନା → `iêù^÷^û` | ✔ |
| i-kara tall allograph | ଥିଲା → `[ôfû`, ଅଧିକାରୀ → `@]ôKûeú` | ✔ |
| Conjunct ତ୍ତ + wa-phala | ତତ୍ତ୍ୱ → `Z©ß` | ✔ |
| Conjunct ନ୍ଦ | ସଦାନନ୍ଦ → `i\û^¦` | ✔ |
| Conjunct କ୍ଷ | ...ଶିକ୍ଷା... → `...gòlû...` | ✔ |
| Conjunct ଜ୍ଞ | ...ଜ୍ଞାନ → `...mû^` | ✔ |
| ra-phala (not precomposed କ୍ର) | ସକ୍ରିୟ → `iKâòd` | ✔ |
| Vowels + final halant | ଆଇଏଏସ୍ → `@ûAGGiþ` | ✔ |
| Odia digits → ASCII | (୧୦/୬) → `(10/6)`, ୨୦୨୫ → `2025` | ✔ |
| Danda | । → `ö` | ✔ |

## 4. Mappings corrected because of the corpus

| Item | Generic table value | -99 corpus value | Action |
|---|---|---|---|
| Half-ma `୍ମ` | `£` (ma-phala) | **`à`** (ସ୍ମାରକପତ୍ର → `iàûeK_Zâ`) | Changed `HALF['ମ']` to `à` |
| Reph glyph | `à`/internal `ð` | **`ð`** in emitted text | Reph emits `ð` |
| `୍ୱ` | table lists `ç` and `ß` | **`ß`** (ତତ୍ତ୍ୱ → `Z©ß`) | Use `ß` |
| `୍ୟ` ya-phala | table lists `¥` and `ý` | **`ý`** (ପାଠ୍ୟ → `_ûVý`) | Use `ý` |
| କ୍ର | precomposed `}` available | decomposed `Kâ` | Excluded `}`; use ra-phala |

This was the single initial mismatch (half-ma); after the fix the overlap is
exact.

## 5. Missing / not exercised by the corpus (residual risk → Phase 6)

The corpus is one ~600-word article and does not contain every glyph. The
following are carried at **medium** confidence from the GPL table and are **not**
yet corpus-verified: ଈ ଊ ଋ ୠ ଓ ଔ ଌ (independent vowels), visarga ଃ, and the
rarer conjuncts ଙ୍ଖ ଙ୍ଘ ଞ୍ଝ ଶ୍ଛ ବ୍ଦ ବ୍ଧ ଲ୍କ ଲ୍ଗ ଳ୍କ ଳ୍ପ ଳ୍ଫ ପ୍ସ ଷ୍ପ ଷ୍ଫ ସ୍ଖ
ସ୍ଫ ଦ୍ଘ ଦ୍ଭ କ୍ସ ଗ୍ଦ ଗ୍ଧ. See `production-audit.md` §"Remaining risks".

## 6. Newly discovered rules (beyond the original converter)

- The **i-kara allograph** `ô` is a per-base positional variant, not a separate
  character — implemented as a render-time rule for ଖ/ଥ/ଧ rather than as ad-hoc
  precomposed entries.
- A **single-pass cluster parser** reproduces the original converter's three
  reordering regex passes (reph, left-matra, anusvara) deterministically and
  order-independently. See `conversion-engine-design.md`.
