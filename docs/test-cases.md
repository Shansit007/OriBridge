# Phase 4 — Test Cases

Automated by `tests/run.js` (`node tests/run.js`). Two layers: (A) the full
parallel-corpus regression, (B) isolated feature unit cases.

## A. Corpus regression
- Source: `tests/input_unicode.txt` ↔ `tests/expected_akruti.txt`.
- Scope: overlapping region (4 paragraphs / 254 words); stray U+FE0F stripped.
- Pass bar: **100% word accuracy** AND **exact character overlap**.
- Current: **254/254 words, exact overlap = true**.

## B. Feature unit cases

| # | Feature under test | Input (Unicode) | Expected (Akruti) | Result |
|---|---|---|---|---|
| 1 | Reph after consonant + ii-matra | ଦୁର୍ନୀତି | `\ê^ðúZò` | PASS |
| 2 | Reph, word-final cluster | କର୍ମ | `Kcð` | PASS |
| 3 | Left e-matra reorder | ରେ | `ùe` | PASS |
| 4 | Split au-matra around ଦ୍ଧ conjunct | ସିଦ୍ଧୌର | `iòù¡øe` | PASS |
| 5 | Left e-matra on ଣ | ଗଣେଶ | `MùYg` | PASS |
| 6 | Independent vowels + final halant | ଆଇଏଏସ୍ | `@ûAGGiþ` | PASS |
| 7 | ଷ୍କ conjunct + matras | ନିଷ୍କାମ | `^òÃûc` | PASS |
| 8 | ତ୍ତ ligature + wa-phala | ତତ୍ତ୍ୱ | `Z©ß` | PASS |
| 9 | i-kara tall allograph (ଥି) | ଥିଲା | `[ôfû` | PASS |
| 10 | Odia numerals + punctuation | (୧୦/୬) | `(10/6)` | PASS |

## C. Edge / negative cases (manual, covered by engine design)
- Empty string → `''`.
- Mixed English + Odia → English passes through, Odia converts.
- Trailing/standalone halant → `þ`.
- Danda । and double danda ॥ → `ö`.

## D. How to extend
Add a `[unicode, expectedAkruti]` pair to the `cases` array in `tests/run.js`,
or append parallel lines to the two corpus files, then re-run. Any regression
fails the build (`process.exit(1)`).
