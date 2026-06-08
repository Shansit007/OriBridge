/* OriBridge regression test — validates the engine against the supplied
 * AkrutiOriSarala-99 corpus. Run:  node tests/run.js
 *
 * The supplied Unicode sample is truncated mid-paragraph 4 while the Akruti
 * reference runs longer, so we validate only the overlapping region: each
 * input line capped at its own word count. The corpus paste also contains
 * stray U+FE0F variation selectors (© ™ ® got emoji-fied); we strip them.
 */
const fs = require('fs');
const path = require('path');
const { convert } = require('../script.js');

const dir = __dirname;
const input = fs.readFileSync(path.join(dir, 'input_unicode.txt'), 'utf8').replace(/\n+$/, '');
let expected = fs.readFileSync(path.join(dir, 'expected_akruti.txt'), 'utf8').replace(/\n+$/, '').replace(/️/g, '');

const got = convert(input);
const iLines = input.split('\n');
const eLines = expected.split('\n');
const gLines = got.split('\n');

let wTot = 0, wOk = 0;
const miss = [];
for (let L = 0; L < iLines.length; L++) {
  const ew = (eLines[L] || '').split(' ');
  const gw = (gLines[L] || '').split(' ');
  const iw = iLines[L].split(' ');
  for (let w = 0; w < iw.length; w++) {
    wTot++;
    if (ew[w] === gw[w]) wOk++;
    else miss.push(`L${L + 1}#${w}  [${iw[w]}]  exp[${ew[w]}]  got[${gw[w]}]`);
  }
}
const eOverlap = iLines.map((il, L) =>
  (eLines[L] || '').split(' ').slice(0, il.split(' ').length).join(' ')).join('\n');

console.log('OriBridge corpus validation');
console.log('  word accuracy : ' + wOk + '/' + wTot + '  (' + (100 * wOk / wTot).toFixed(2) + '%)');
console.log('  exact overlap : ' + (eOverlap === got));
if (miss.length) { console.log('\nMismatches:'); miss.forEach(m => console.log('  ' + m)); }

// extra unit assertions on isolated features
const cases = [
  ['ଦୁର୍ନୀତି', '\\ê^ðúZò'],     // reph after consonant
  ['କର୍ମ', 'Kcð'],               // reph word-final
  ['ରେ', 'ùe'],                   // left e-matra reorder
  ['ସିଦ୍ଧୌର', 'iòù¡øe'],         // split au-matra around conjunct
  ['ଗଣେଶ', 'MùYg'],              // e-matra
  ['ଆଇଏଏସ୍', '@ûAGGiþ'],         // vowels + final halant
  ['ନିଷ୍କାମ', '^òÃûc'],          // sh-k conjunct
  ['ତତ୍ତ୍ୱ', 'Z©ß'],            // tt + wa-phala
  ['ଥିଲା', '[ôfû'],              // tall i-allograph
  ['(୧୦/୬)', '(10/6)']            // numerals
];
let uOk = 0;
console.log('\nUnit cases:');
cases.forEach(([u, e]) => {
  const g = convert(u);
  const pass = g === e;
  if (pass) uOk++;
  console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${u} -> ${g}${pass ? '' : '   (expected ' + e + ')'}`);
});

const allPass = (eOverlap === got) && wOk === wTot && uOk === cases.length;
console.log('\n' + (allPass ? 'ALL TESTS PASSED' : 'TESTS FAILED'));
process.exit(allPass ? 0 : 1);
