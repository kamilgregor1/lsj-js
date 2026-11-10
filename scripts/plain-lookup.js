// Helpers for matching plain Greek words against lsj-js headword keys.
//
// lsj-js keys carry typographic detail that gets in the way of programmatic
// lookup: morpheme hyphens ("πολί̄τ-ης"), vowel-length marks, homograph
// numbers ("ἀκρά (2)"), a leading "*" for unattested forms, and editorial
// brackets. `plain` removes all of that; `bare` additionally removes accents,
// breathings and case so that differently accented spellings still match.

const LENGTH_MARKS = /[\u0304\u0306]/g; // macron, breve
// A bracketed single letter carrying a length mark is a pronunciation hint
// ("βίος[ῐ]", "ἐκ-κλίνω[ῑ]"), not part of the spelling. Brackets around
// supplied letters ("ἀνοχ[ικ]ός") are kept, minus the brackets.
const LENGTH_HINT = /\[\p{L}[\u0300\u0301\u0342]*[\u0304\u0306][\u0300\u0301\u0342]*\]/gu;
const ALL_MARKS = /[\u0300-\u036f]/g;

function plain(word) {
  return word
    .normalize('NFD')
    .replace(LENGTH_HINT, '')
    .replace(LENGTH_MARKS, '')
    .replace(/&lt;|&gt;/g, '')
    .replace(/[[\]*]/g, '')
    .replace(/\s*\(\d+\)\s*$/, '')
    .replace(/-/g, '')
    .normalize('NFC')
    .trim();
}

function bare(word) {
  return plain(word)
    .normalize('NFD')
    .replace(ALL_MARKS, '')
    .toLowerCase()
    .replace(/ς/g, 'σ')
    .normalize('NFC');
}

module.exports = { plain, bare };
