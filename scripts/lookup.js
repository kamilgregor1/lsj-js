// Look up a Greek word and print the matching lsj-js entries as plain text.
//
//   node scripts/lookup.js λόγος
//
// Tries, in order: plain headword, alternate form, accent-insensitive form.
// Requires vendor/plain-lookup.json (yarn build-plain-lookup).

const lsj = require('../vendor/lsj.json');
const lookup = require('../vendor/plain-lookup.json');
const { plain, bare } = require('./plain-lookup');

const text = (html) => html
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

function find(word) {
  const p = plain(word);
  if (lookup.headwords[p]) return { how: 'headword', keys: lookup.headwords[p] };
  if (lookup.alternates[p.toLowerCase()]) {
    return { how: 'alternate form', keys: lookup.alternates[p.toLowerCase()] };
  }
  if (lookup.bare[bare(p)]) return { how: 'accent-insensitive', keys: lookup.bare[bare(p)] };
  return null;
}

if (require.main === module) {
  const word = process.argv[2];
  if (!word) {
    console.error('usage: node scripts/lookup.js <greek word>');
    process.exit(1);
  }
  const hit = find(word);
  if (!hit) {
    console.log(`${word}: not found`);
    process.exit(2);
  }
  console.log(`${word}: ${hit.keys.length} entr${hit.keys.length === 1 ? 'y' : 'ies'} (${hit.how})`);
  hit.keys.forEach((key) => console.log(`\n== ${key}\n${text(lsj[key].d)}`));
}

module.exports = { find, text };
