// Builds vendor/plain-lookup.json: a lookup table from plain Greek words to
// lsj-js entry keys (the keys of vendor/lsj.json).
//
//   headwords   plain headword (case kept)  -> entry keys
//   alternates  plain variant form (lower-case, from the entry's `m` list,
//               e.g. μίγνυμι -> μείγνυμι) -> entry keys
//   bare        accent-, breathing- and case-insensitive form -> entry keys
//
// Usage: yarn build-plain-lookup

const fs = require('fs');
const path = require('path');
const lsj = require('../vendor/lsj.json');
const { plain, bare } = require('./plain-lookup');

const headwords = {};
const alternates = {};
const bareMap = {};

function add(map, word, key) {
  if (!word) return;
  if (!Object.prototype.hasOwnProperty.call(map, word)) map[word] = [];
  if (!map[word].includes(key)) map[word].push(key);
}

Object.entries(lsj).forEach(([key, entry]) => {
  const head = plain(key);
  add(headwords, head, key);
  add(bareMap, bare(head), key);

  entry.m.forEach((form) => {
    const variant = plain(form);
    if (variant.toLowerCase() !== head.toLowerCase()) {
      add(alternates, variant, key);
      add(bareMap, bare(variant), key);
    }
  });
});

const out = path.join(__dirname, '..', 'vendor', 'plain-lookup.json');
fs.writeFileSync(out, `${JSON.stringify({ headwords, alternates, bare: bareMap })}\n`);
console.log(
  `${Object.keys(headwords).length} headwords, `
  + `${Object.keys(alternates).length} alternate forms, `
  + `${Object.keys(bareMap).length} bare forms -> ${path.relative(process.cwd(), out)}`,
);
