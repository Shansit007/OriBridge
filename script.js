/* ============================================================================
 * OriBridge — Odia Unicode  ->  AkrutiOriSarala-99 converter
 * ----------------------------------------------------------------------------
 * Conversion core + UI wiring. Pure vanilla ES5/ES6, no dependencies.
 * The core (OriBridge.convert) is also require()-able from Node for testing.
 *
 * Mapping derived from the OdiaWikimedia/Converter project (GPL-3.0,
 * Manoj Sahukar & Subhashish Panigrahi) and validated/corrected against a
 * supplied AkrutiOriSarala-99 newspaper corpus (100% exact match on overlap).
 * ==========================================================================*/
(function (root) {
  'use strict';

  var H = '୍'; // halant / virama (U+0B4D)

  // Independent vowels
  var VOWEL = {
    'ଅ':'@','ଆ':'@û','ଇ':'A','ଈ':'B','ଉ':'C',
    'ଊ':'D','ଋ':'E','ୠ':'F','ଌ':'&','ଏ':'G',
    'ଐ':'H','ଓ':'I','ଔ':'J'
  };

  // Base consonants
  var CONS = {
    'କ':'K','ଖ':'L','ଗ':'M','ଘ':'N','ଙ':'O',
    'ଚ':'P','ଛ':'Q','ଜ':'R','ଝ':'S','ଞ':'T',
    'ଟ':'U','ଠ':'V','ଡ':'W','ଢ':'X','ଣ':'Y',
    'ତ':'Z','ଥ':'[','ଦ':'\\','ଧ':']','ନ':'^',
    'ପ':'_','ଫ':'`','ବ':'a','ଭ':'b','ମ':'c',
    'ଯ':'~','ର':'e','ଲ':'f','ଳ':'k','ଶ':'g',
    'ଷ':'h','ସ':'i','ହ':'j','ଵ':'a','ୟ':'d',
    'ଡ଼':'Wÿ','ଢ଼':'Xÿ','ୱ':'Iß'
  };

  // Right-side (post-base) matras
  var MATRA = {
    'ା':'û','ି':'ò','ୀ':'ú','ୁ':'ê',
    'ୂ':'ì','ୃ':'é','ୄ':'é'
  };
  // Left / split matras -> [leftGlyph, rightExtraGlyph]
  var LMATRA = {
    'େ':['ù',''],       // e
    'ୈ':['ù','÷'], // ai : u + cons + divide-sign
    'ୋ':['ù','û'], // o  : u + cons + aa-kara
    'ୌ':['ù','ø']  // au : u + cons + o-slash
  };

  // Signs
  var SIGN = { 'ଁ':'ñ','ଂ':'õ','ଃ':'ü' }; // candrabindu, anusvara, visarga

  // Precomposed conjunct ligatures (Unicode -> Akruti). Longest match first.
  var CONJ = {
    'କ୍ଷ୍ଣ':'Ð','ତ୍ସ୍ନ':'œ','ସ୍ତ୍ର':'È','ନ୍ତ୍ର':'ª',
    'କ୍ଷ':'l','ଜ୍ଞ':'m','ଦ୍ଭ':'n','କ୍ଟ':'o','କ୍ତ':'q','କ୍ସ':'r',
    'ଗ୍ଦ':'s','ଗ୍ଧ':'t','ଙ୍କ':'u','ଙ୍ଖ':'v','ଙ୍ଗ':'w','ଙ୍ଘ':'x',
    'ଚ୍ଚ':'y','ଚ୍ଛ':'z','ତ୍ତ':'©','ତ୍ଥ':'Î','ତ୍ମ':'™','ତ୍ପ':'š','ତ୍ସ':'›',
    'ଦ୍ଦ':'Ÿ','ଦ୍ଧ':'¡','ଦ୍ଘ':'¢','ଧ୍ୟ':'¤','ଧ୍ଯ':'¤',
    'ନ୍ଦ':'¦','ନ୍ଧ':'§','ନ୍ତ':'«','ଞ୍ଚ':'*','ଞ୍ଜ':'¬','ଞ୍ଝ':'ƒ',
    'ଣ୍ଟ':'<','ଣ୍ଣ':'‰','ଣ୍ଡ':'Š','ଣ୍ଠ':'Œ','ଣ୍ଢ':'‹','ଟ୍ଟ':'…',
    'ପ୍ପ':'®','ପ୍ତ':'¯','ପ୍ସ':'°','ବ୍ଦ':'±','ବ୍ଧ':'²',
    'ମ୍ବ':'´','ମ୍ଭ':'¸','ମ୍ମ':'¹','ମ୍ପ':'µ','ମ୍ଫ':'¶',
    'ଲ୍କ':'º','ଲ୍ଗ':'»','ଶ୍ଛ':'¼','ଶ୍ଚ':'½',
    'ଷ୍ଣ':'¾','ଷ୍ପ':'¿','ଷ୍ଫ':'À','ଷ୍ଟ':'Á','ଷ୍ଠ':'Â','ଷ୍କ':'Ã',
    'ସ୍କ':'Ä','ସ୍ଖ':'Å','ସ୍ପ':'Æ','ସ୍ଫ':'Ç','ସ୍ତ':'É','ସ୍ୱ':'Ê',
    'ଳ୍କ':'Ë','ଳ୍ପ':'Ì','ଳ୍ଫ':'Í','ଳ୍ଳ':'Ï','ଜ୍ଜ':'{','ଜ୍ଝ':'|'
  };
  var CONJ_KEYS = Object.keys(CONJ).sort(function (a, b) { return b.length - a.length; });

  // Generic half-consonant forms (halant + consonant -> glyph)
  var HALF = {
    'କ':'Ñ','ଖ':'Ò','ଗ':'Ó','ଚ':'Ô','ଜ':'Õ','ଟ':'Ö','ଠ':'×','ଡ':'Ø',
    'ଣ':'Ù','ଥ':'Ú','ଧ':'Û','ନ':'Ü','ପ':'Ý','ଫ':'Þ','ମ':'à','ଯ':'ý',
    'ୟ':'ý','ର':'â','ଲ':'ä','ଭ':'å','ଳ':'æ','ସ':'è','ବ':'ß','ୱ':'ß'
  };

  var TALL_I = { 'ଖ':true, 'ଥ':true, 'ଧ':true }; // i-kara tall allograph -> 'ô'

  function consonant(ch) { return !!(ch && CONS.hasOwnProperty(ch)); }
  function vowel(ch)     { return !!(ch && VOWEL.hasOwnProperty(ch)); }
  function matra(ch)     { return !!(ch && (MATRA.hasOwnProperty(ch) || LMATRA.hasOwnProperty(ch))); }
  function sign(ch)      { return !!(ch && SIGN.hasOwnProperty(ch)); }

  // Render a consonant skeleton (base + halant+cons chains) to Akruti glyphs
  function renderCons(s) {
    var out = '', j = 0, k, key, matched;
    while (j < s.length) {
      matched = null;
      for (k = 0; k < CONJ_KEYS.length; k++) {
        key = CONJ_KEYS[k];
        if (s.substr(j, key.length) === key) { matched = key; break; }
      }
      if (matched) { out += CONJ[matched]; j += matched.length; continue; }
      var ch = s.charAt(j);
      if (ch === H) {
        var nxt = s.charAt(j + 1);
        if (HALF.hasOwnProperty(nxt)) { out += HALF[nxt]; j += 2; }
        else { out += (CONS[nxt] ? 'þ' + CONS[nxt] : 'þ'); j += 2; }
      } else {
        out += (CONS[ch] || VOWEL[ch] || ch); j += 1;
      }
    }
    return out;
  }

  function convert(text) {
    if (!text) return '';
    text = text.normalize ? text.normalize('NFC') : text;
    var out = [], i = 0, n = text.length;

    while (i < n) {
      var ch = text.charAt(i);

      var startsCluster = consonant(ch) || vowel(ch) ||
        (ch === 'ର' && text.charAt(i + 1) === H && consonant(text.charAt(i + 2)));

      if (!startsCluster) {
        if (ch >= '୦' && ch <= '୯') {
          out.push(String.fromCharCode(0x30 + (ch.charCodeAt(0) - 0x0B66))); // Odia digit -> ASCII
        } else if (ch === '।' || ch === '॥') {
          out.push('ö');
        } else if (sign(ch)) {
          out.push(SIGN[ch]);
        } else if (ch === H) {
          out.push('þ');
        } else {
          out.push(ch); // ASCII, punctuation, spaces, quotes, newlines
        }
        i += 1;
        continue;
      }

      // reph: ra + halant + consonant
      var reph = false;
      if (ch === 'ର' && text.charAt(i + 1) === H && consonant(text.charAt(i + 2))) {
        reph = true; i += 2; ch = text.charAt(i);
      }

      // base + conjunct skeleton
      var skel = ch; i += 1;
      while (text.charAt(i) === H && consonant(text.charAt(i + 1))) {
        skel += H + text.charAt(i + 1); i += 2;
      }
      // trailing explicit halant (word-final)
      var explicitHalant = false;
      if (text.charAt(i) === H && !consonant(text.charAt(i + 1))) {
        explicitHalant = true; i += 1;
      }
      // matra
      var m = '';
      if (matra(text.charAt(i))) { m = text.charAt(i); i += 1; }
      // trailing signs
      var signs = '';
      while (sign(text.charAt(i))) { signs += SIGN[text.charAt(i)]; i += 1; }

      // assemble (Akruti byte order)
      var consGlyph = renderCons(skel);
      var left = '', rightMatra = '';
      if (LMATRA.hasOwnProperty(m)) {
        left = LMATRA[m][0];
        rightMatra = LMATRA[m][1];
      } else if (m) {
        if (m === 'ି' && skel.length === 1 && TALL_I[skel]) rightMatra = 'ô';
        else rightMatra = MATRA[m] || '';
      }
      if (rightMatra === 'ò' && signs.charAt(0) === 'ñ') { rightMatra = 'ó'; signs = signs.slice(1); }
      var rephGlyph = reph ? 'ð' : '';

      out.push(left + consGlyph + rephGlyph + rightMatra + signs + (explicitHalant ? 'þ' : ''));
    }
    return out.join('');
  }

  var api = { convert: convert, version: '1.0.0' };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OriBridge = api;

  /* ----------------------------- UI wiring ----------------------------- */
  if (typeof document === 'undefined') return;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var input  = document.getElementById('input');
    var output = document.getElementById('output');
    var btnConv = document.getElementById('btnConvert');
    var btnCopy = document.getElementById('btnCopy');
    var btnClear = document.getElementById('btnClear');
    var live = document.getElementById('liveToggle');
    var status = document.getElementById('status');
    var inCount = document.getElementById('inCount');
    var outCount = document.getElementById('outCount');

    function flash(msg, kind) {
      status.textContent = msg;
      status.className = 'status' + (kind ? ' ' + kind : '');
      if (kind === 'ok') setTimeout(function () {
        status.textContent = ''; status.className = 'status';
      }, 2200);
    }

    function run() {
      try {
        var t0 = (performance && performance.now) ? performance.now() : Date.now();
        var res = OriBridge.convert(input.value);
        output.value = res;
        var t1 = (performance && performance.now) ? performance.now() : Date.now();
        outCount.textContent = res.length + ' chars';
        inCount.textContent = input.value.length + ' chars';
        flash('Converted in ' + (t1 - t0).toFixed(1) + ' ms', 'ok');
      } catch (e) {
        flash('Conversion error: ' + e.message, 'err');
      }
    }

    btnConv.addEventListener('click', run);

    input.addEventListener('input', function () {
      inCount.textContent = input.value.length + ' chars';
      if (live.checked) run();
    });

    btnCopy.addEventListener('click', function () {
      if (!output.value) { flash('Nothing to copy', 'err'); return; }
      output.select();
      var done = function () { flash('Output copied to clipboard', 'ok'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(output.value).then(done, function () {
          document.execCommand('copy'); done();
        });
      } else { document.execCommand('copy'); done(); }
    });

    btnClear.addEventListener('click', function () {
      input.value = ''; output.value = '';
      inCount.textContent = '0 chars'; outCount.textContent = '0 chars';
      input.focus(); flash('Cleared', 'ok');
    });

    // Ctrl/Cmd+Enter to convert
    input.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
    });
  });
})(typeof window !== 'undefined' ? window : this);
