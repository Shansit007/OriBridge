# Phase 4 — Conversion Engine Design

## 1. Why a cluster parser (not string replacement)

The reference GPL converter does Akruti→Unicode with ~150 sequential
`String.replace` passes plus regex reordering. That direction is forgiving.
The **reverse** direction (Unicode→Akruti) needs *visual reordering* (left
matras, reph) and *longest-match* ligature selection, where naive sequential
replacement is order-sensitive and error-prone. OriBridge instead parses the
input into **orthographic clusters** and emits each cluster in visual order.
This makes reordering exact and independent of rule order.

## 2. Cluster grammar

```
cluster := [ ର ୍ ]?            ; optional reph (ra + halant + following consonant)
           base                ; consonant OR independent vowel OR nukta letter
           ( ୍ consonant )*    ; zero or more conjunct members
           [ ୍ ]?              ; optional word-final explicit halant
           [ matra ]?          ; one dependent vowel sign
           ( sign )*           ; candrabindu / anusvara / visarga
```

Anything not starting a cluster (spaces, ASCII, punctuation, Odia digits, danda,
stray signs/halant) is handled in a fast side-branch.

## 3. Pipeline

```
input (UTF-8)
   │  NFC normalise
   ▼
scan char-by-char
   ├─ non-cluster char ─► digit→ASCII | danda→ö | sign | pass-through
   └─ cluster ─► 1. detect & strip reph (ର୍ before a consonant)
                 2. read base + halant-consonant skeleton
                 3. read optional final halant
                 4. read optional matra
                 5. read trailing signs
                 6. renderCons(skeleton)            ← longest-match conjuncts,
                 7. assemble in VISUAL order:          then half-forms, then base
                    [leftMatra] consGlyphs [reph ð] [rightMatra/tail] [signs] [þ]
   ▼
output (Windows-1252 glyph string)
```

### renderCons (skeleton → glyphs)
Greedy left-to-right over the skeleton string:
1. Try the **longest** precomposed conjunct key at the cursor (`CONJ`).
2. Else if cursor is a halant, emit the **half-form** of the next consonant
   (`HALF`); fall back to `þ`+base glyph if none.
3. Else emit the single **base** consonant/vowel glyph.

### Reordering rules realised by assembly order
- **Reph** (`ର୍` preceding a consonant) → glyph `ð` placed *after* the consonant
  cluster and *before* its right-matra.
- **Left matra** `େ` → `ù` before the cluster. **Split** `ୋ/ୌ/ୈ` → `ù` before +
  tail `û/ø/÷` after.
- **i-kara allograph** → `ò` becomes `ô` when the matra is short‑i and the base
  is a lone ଖ/ଥ/ଧ.
- **i + candrabindu** → combined glyph `ó`.

## 4. Complexity & performance

Single pass, O(n) in input length; the per-cluster conjunct lookup is bounded by
a fixed key list. Converts the full ~4-paragraph corpus in well under 1 ms in
Node and in-browser. No async, no I/O, no allocation hot spots beyond the output
array.

## 5. Error handling & robustness

- Empty / null input → `''`.
- Unknown or mixed (Latin/Odia) characters pass through unchanged, so mixed
  bilingual copy survives.
- Malformed sequences (orphan matra, double halant) degrade gracefully to
  best-effort glyphs rather than throwing.
- The UI wraps `convert()` in try/catch and reports timing; the core never
  touches the network, storage, or DOM (DOM wiring is isolated and guarded by
  `typeof document`).

## 6. Single source of truth

`script.js` exports `OriBridge.convert` for both the browser UI and the Node
test harness (`module.exports`), so what ships is exactly what is tested.
