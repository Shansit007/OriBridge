# Phase 2 — Mapping Specification (Unicode → AkrutiOriSarala-99)

Glyphs below are the literal Windows‑1252 characters to emit; applying the
AkrutiOriSarala-99 font renders them as Odia. Confidence: **H** = confirmed by
the supplied -99 corpus, **M** = from the GPL OdiaWikimedia table, not seen in
corpus.

## 1. Independent vowels

| Unicode | Glyph | Conf | | Unicode | Glyph | Conf |
|---|---|---|---|---|---|---|
| ଅ | `@` | H | | ଋ | `E` | M |
| ଆ | `@û` | H | | ୠ | `F` | M |
| ଇ | `A` | H | | ଏ | `G` | H |
| ଈ | `B` | M | | ଐ | `H` | M |
| ଉ | `C` | H | | ଓ | `I` | M |
| ଊ | `D` | M | | ଔ | `J` | M |
| ଌ | `&` | M | | | | |

## 2. Consonants

| Unicode | Glyph | | Unicode | Glyph | | Unicode | Glyph |
|---|---|---|---|---|---|---|---|
| କ | `K` | | ଟ | `U` | | ବ | `a` |
| ଖ | `L` | | ଠ | `V` | | ଭ | `b` |
| ଗ | `M` | | ଡ | `W` | | ମ | `c` |
| ଘ | `N` | | ଢ | `X` | | ଯ | `~` |
| ଙ | `O` | | ଣ | `Y` | | ର | `e` |
| ଚ | `P` | | ତ | `Z` | | ଲ | `f` |
| ଛ | `Q` | | ଥ | `[` | | ଳ | `k` |
| ଜ | `R` | | ଦ | `\` | | ଶ | `g` |
| ଝ | `S` | | ଧ | `]` | | ଷ | `h` |
| ଞ | `T` | | ନ | `^` | | ସ | `i` |
| | | | ପ | `_` | | ହ | `j` |
| | | | ଫ | `` ` `` | | ୟ | `d` |

Nukta / special: ଡ଼ `Wÿ`, ଢ଼ `Xÿ`, ୱ `Iß`, ଵ `a`.

## 3. Matras (dependent vowel signs)

**Right-side (emitted after the base):**

| Unicode | Glyph | Conf |
|---|---|---|
| ା (aa) | `û` | H |
| ି (i)  | `ò` | H |
| ୀ (ii) | `ú` | H |
| ୁ (u)  | `ê` | H |
| ୂ (uu) | `ì` | H |
| ୃ (ru) | `é` | H |

**i-kara tall allograph:** ି after ଖ/ଥ/ଧ → `ô` (so ଖି `Lô`, ଥି `[ô`, ଧି `]ô`). **H**

**Left / split (reordered — emitted as left glyph + optional right tail):**

| Unicode | Akruti pattern | Meaning | Conf |
|---|---|---|---|
| େ (e)  | `ù` + C | left e | H |
| ୈ (ai) | `ù` + C + `÷` | left + divide-sign tail | H |
| ୋ (o)  | `ù` + C + `û` | left + aa tail | H |
| ୌ (au) | `ù` + C + `ø` | left + o-slash tail | H |

## 4. Signs

| Unicode | Glyph | Conf |
|---|---|---|
| ଁ candrabindu | `ñ` | H |
| ଂ anusvara   | `õ` | H |
| ଃ visarga    | `ü` | M |
| ିଁ (i + candrabindu) | `ó` | M |

## 5. Halant / Virama (୍)

- **Forms a conjunct** with the next consonant → see §6 (precomposed) or §7
  (half-form). 
- **Word-final / before non-consonant** → explicit halant `þ` (e.g. ସ୍ `iþ`). **H**

## 6. Precomposed conjunct ligatures (longest match first)

`କ୍ଷ୍ଣ Ð` · `ତ୍ସ୍ନ œ` · `ସ୍ତ୍ର È` · `ନ୍ତ୍ର ª` · `କ୍ଷ l` · `ଜ୍ଞ m` · `ଦ୍ଭ n` ·
`କ୍ଟ o` · `କ୍ତ q` · `କ୍ସ r` · `ଗ୍ଦ s` · `ଗ୍ଧ t` · `ଙ୍କ u` · `ଙ୍ଖ v` · `ଙ୍ଗ w` ·
`ଙ୍ଘ x` · `ଚ୍ଚ y` · `ଚ୍ଛ z` · `ତ୍ତ ©` · `ତ୍ଥ Î` · `ତ୍ମ ™` · `ତ୍ପ š` · `ତ୍ସ ›` ·
`ଦ୍ଦ Ÿ` · `ଦ୍ଧ ¡` · `ଦ୍ଘ ¢` · `ଧ୍ୟ ¤` · `ନ୍ଦ ¦` · `ନ୍ଧ §` · `ନ୍ତ «` · `ଞ୍ଚ *` ·
`ଞ୍ଜ ¬` · `ଞ୍ଝ ƒ` · `ଣ୍ଟ <` · `ଣ୍ଣ ‰` · `ଣ୍ଡ Š` · `ଣ୍ଠ Œ` · `ଣ୍ଢ ‹` · `ଟ୍ଟ …` ·
`ପ୍ପ ®` · `ପ୍ତ ¯` · `ପ୍ସ °` · `ବ୍ଦ ±` · `ବ୍ଧ ²` · `ମ୍ବ ´` · `ମ୍ଭ ¸` · `ମ୍ମ ¹` ·
`ମ୍ପ µ` · `ମ୍ଫ ¶` · `ଲ୍କ º` · `ଲ୍ଗ »` · `ଶ୍ଛ ¼` · `ଶ୍ଚ ½` · `ଷ୍ଣ ¾` · `ଷ୍ପ ¿` ·
`ଷ୍ଫ À` · `ଷ୍ଟ Á` · `ଷ୍ଠ Â` · `ଷ୍କ Ã` · `ସ୍କ Ä` · `ସ୍ଖ Å` · `ସ୍ପ Æ` · `ସ୍ଫ Ç` ·
`ସ୍ତ É` · `ସ୍ୱ Ê` · `ଳ୍କ Ë` · `ଳ୍ପ Ì` · `ଳ୍ଫ Í` · `ଳ୍ଳ Ï` · `ଜ୍ଜ {` · `ଜ୍ଝ |`

Corpus-confirmed (**H**): ତ୍ତ, ନ୍ଦ, ନ୍ତ, ଣ୍ଣ, ଣ୍ଡ, ମ୍ପ, କ୍ଷ, ଜ୍ଞ, ଷ୍କ, ଷ୍ଠ,
ସ୍ତ୍ର, ଦ୍ଧ, ଞ୍ଜ, ଙ୍କ, ତ୍ମ. Remainder **M**.

> Deliberately **excluded** `କ୍ର→}`: the -99 corpus renders କ୍ର as `K` + ra-phala
> `â` (e.g. ସକ୍ରିୟ `iKâòd`), so କ୍ର is handled by §7, not as a precomposed glyph.

## 7. Generic half-consonant forms (halant + C, when no precomposed glyph)

`୍କ Ñ` · `୍ଖ Ò` · `୍ଗ Ó` · `୍ଚ Ô` · `୍ଜ Õ` · `୍ଟ Ö` · `୍ଠ ×` · `୍ଡ Ø` · `୍ଣ Ù` ·
`୍ଥ Ú` · `୍ଧ Û` · `୍ନ Ü` · `୍ପ Ý` · `୍ଫ Þ` · **`୍ମ à`** · `୍ୟ(ଯ/ୟ) ý` · `୍ର â`
(ra-phala) · `୍ଲ ä` · `୍ଭ å` · `୍ଳ æ` · `୍ସ è` · **`୍ୱ/୍ବ ß`**.

A base consonant followed by such a half-form composes left→right, e.g.
ସ୍ଥ → `i` + `Ú` = `iÚ`; ବିଶ୍ୱ → `aòg` + `ß`.

## 8. Numerals & punctuation

| Unicode | Glyph |
|---|---|
| ୦ ୧ ୨ ୩ ୪ ୫ ୬ ୭ ୮ ୯ | `0 1 2 3 4 5 6 7 8 9` (ASCII) **H** |
| । ॥ danda | `ö` **H** |
| `( ) : / , . ; ' "` space, newline | pass-through **H** |

## 9. Cluster assembly order (the reordering rule)

For one orthographic cluster `[reph?] base [+halant-cons…] [matra] [signs] [final-halant?]`,
emit in this **visual** order:

```
[left-matra ù] + [consonant/conjunct glyphs] + [reph ð] + [right-matra/tail] + [signs] + [final halant þ]
```

Worked example — ଦୁର୍ନୀତି:
`ଦ`→`\`, `ୁ`→`ê`, `ର୍ନୀ` = reph+na+ii → `^`(na) `ð`(reph) `ú`(ii), `ତି`→`Zò`
⟹ `\ê^ðúZò`. ✓
