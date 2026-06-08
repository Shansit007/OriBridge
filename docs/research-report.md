# Phase 1 — Research Report: AkrutiOriSarala-99 Encoding

## 1. Objective

Reconstruct the Odia Unicode → AkrutiOriSarala-99 conversion rules from public
evidence first, using the supplied parallel corpus only for validation and gap
filling.

## 2. What AkrutiOriSarala-99 actually is

AkrutiOriSarala-99 is a legacy **8-bit "glyph font"** in the Akruti family
(Cyberscape Multimedia / Akruti Software), built on the **ISFOC** (Indian Script
FOnt Code) approach used widely in Indian DTP through the 1990s–2000s. Unlike
Unicode — which stores characters in *logical* order and lets the rendering
engine shape and reorder them — an ISFOC font stores text in **visual order** as
a stream of single-byte codes in the Windows‑1252 (ANSI) range. Each byte maps
to one *glyph* (a base letter, a half-form, a matra, a ligature, or a
positional variant). The application (Adobe PageMaker 7.0) does **no** shaping;
the converter must therefore do all reordering and ligature selection itself.

Practical consequences for conversion:

- **Visual reordering is mandatory.** Left-hand matras (e, ai, o, au) and the
  reph must be emitted in the position they *appear*, not the logical position.
- **Conjuncts are explicit glyphs.** Common conjuncts (e.g. ନ୍ଦ, ତ୍ତ, କ୍ଷ) each
  occupy a dedicated code; rarer ones are built from a base glyph + a
  "half-consonant" glyph.
- **Digits are ASCII.** Odia digits ୦–୯ are stored as ASCII `0`–`9`; the font
  draws the Odia digit shapes.
- **Output is Windows‑1252 text**, i.e. a string of characters such as
  `\ ê ^ ð ú Z ò`, each of which the AkrutiOriSarala-99 font renders as an Odia
  glyph.

## 3. Sources consulted, ranked by reliability

| # | Source | Type | Reliability | What it gave us |
|---|--------|------|-------------|-----------------|
| 1 | **OdiaWikimedia/Converter** (GitHub, GPL-3.0) — `Akruti-Sarala - Unicode Converter.htm` | Working open-source converter with an explicit, commented mapping table for the Akruti Sarala / **Sarala-99** family | **High** | The full glyph table (consonants, vowels, matras, ~90 conjuncts, half-forms, reph/matra reordering regexes). This is the backbone of our mapping. |
| 2 | CIS-India / Wikimedia blog on the Odia font converter | Provenance + scope | High | Confirms the converter explicitly supports **AkrutiOriSarala99** and its successor AkrutiOriSarala; ~99% real-world accuracy claim. |
| 3 | Supplied **AkrutiOriSarala-99 newspaper corpus** (parallel Unicode/Akruti) | Ground-truth parallel text | **High (authoritative for -99)** | Resolved every -99-specific divergence from the generic table (reph glyph, ma half-form, i-allograph). |
| 4 | Akruti Devanagari/Marathi converters (fontconverter.online, jsahu.me, indiatyping, pramukh) | Sibling-script ISFOC converters | Medium | Confirmed the *structure* (ANSI glyph stream, visual order, half-forms, ASCII digits) generalises across Akruti scripts. |
| 5 | "Migrating to Unicode from Legacy Systems" DTP handbook (theofdn.org) | Domain background | Medium | Confirmed the legacy DTP workflow and reordering problem class. |

Other listed converters (odiaunicode.com, devlystounicode.in, bkgraphy, gyan111)
corroborate coverage but expose no machine-readable table; treated as
**corroborating, not primary**.

## 4. Encoding analysis (key findings)

1. **Code page** — Output characters live in Windows‑1252. Characters above
   U+00FF in the corpus (e.g. `™ © ‰ Š œ ƒ …`) are the Windows‑1252
   interpretations of bytes 0x80–0x9F and map to *conjunct* glyphs.
2. **Reph differs between variants.** In the generic AkrutiSarala converter the
   internal reph marker is `à`/`ð`; in **-99** the reph glyph that appears in
   real text is **`ð`**, placed **after** the consonant it rides and **before**
   that consonant's right-matra: `ର୍ + C + M → C ð M`.
3. **Left/split matras reorder.** `େ→ù` is emitted *before* the consonant;
   `ୋ/ୌ/ୈ` split into a left `ù` plus a right tail (`û`/`ø`/`÷`).
4. **i-kara allograph.** Short‑i (ି) after the tall letters ଖ/ଥ/ଧ uses a special
   glyph `ô` (`Lô [ô ]ô`) instead of the normal `ò`.
5. **Half-ma (`୍ମ`)** is `à` in **-99** (the generic table also lists `£`).

## 5. Unknown / low-confidence areas (carried into Phase 3)

- Rare conjuncts absent from both the corpus and the table (e.g. `ଙ୍ଘ`, `ଞ୍ଝ`)
  are taken from the GitHub table at **medium** confidence.
- The full set of tall-letter i-allographs — corpus + table confirm ଖ/ଥ/ଧ only.
- ASCII punctuation other than danda is assumed pass-through (corpus confirms
  `( ) : / , ' "` and ASCII digits pass through unchanged).

## 6. Reconstruction strategy

1. Treat the GitHub table as the **base** (Akruti→Unicode) and **invert** it to
   Unicode→Akruti, choosing the -99 canonical glyph where the table lists
   alternates.
2. Replace the original converter's sequential string-replace + regex passes
   with a **single-pass cluster parser** (Phase 4) that makes reordering exact
   and order-independent.
3. **Validate every rule** against the supplied -99 corpus, correcting any
   divergence (Phase 3). The corpus — not the table — wins for -99.

See `mapping-spec.md` for the full table and `validation-report.md` for the
evidence-by-evidence confirmation.
