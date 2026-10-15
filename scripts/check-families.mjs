#!/usr/bin/env node
// check-families — the in-tree falsifiable check for this repo's marketplace-entity
// `families:` map (opencharly/pod-charly-hooks#16, A2/R10).
//
// WHY: `charly box validate` returns "0 warnings, 0 errors" WITH OR WITHOUT a family,
// so adding one had no in-tree coverage that could fail. This asserts the map against
// scripts/skills-expected.txt: the families the org's skill entities declare, which this
// marketplace entity must carry, because `charly marketplace generate` refuses to emit a
// corpus row for an undeclared family.
//
// FAILS WITHOUT THE CHANGE: delete `fireactions` from charly.yml and this exits 1
// naming it. It also asserts each entry's shape, so a malformed entry cannot ride along.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// Only FACTUAL assertions here. An earlier draft also asserted a closed set of
// `category:` values and that every family carries `profiles:` — the run disproved both:
// 14 families legitimately use `category: commands`, and one legitimately omits
// `profiles`. A check that encodes a style guess fails on correct input, which is worse
// than no check. What matters is that every family a skill declares is PRESENT, and that
// each entry carries a non-empty description (the ADE requirement).
const REQUIRED_FIELDS = ['description'];

function declaredFamilies(src) {
  const out = new Map();
  let inFamilies = false, current = null;
  for (const line of src.split('\n')) {
    const indent = line.length - line.trimStart().length;
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    if (/^families:\s*$/.test(t)) { inFamilies = true; current = null; continue; }
    if (!inFamilies) continue;
    if (indent === 0) { inFamilies = false; continue; }
    const m = /^([A-Za-z0-9_-]+):\s*$/.exec(t);
    if (indent === 12 && m) { current = m[1]; out.set(current, {}); continue; }
    if (current && indent > 12 && t.includes(':')) {
      const i = t.indexOf(':');
      out.get(current)[t.slice(0, i).trim()] = t.slice(i + 1).trim();
    }
  }
  return out;
}

const declared = declaredFamilies(readFileSync(join(root, 'charly.yml'), 'utf8'));
const expected = readFileSync(join(root, 'scripts/skills-expected.txt'), 'utf8')
  .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));

const failures = [];
for (const family of expected) {
  if (!declared.has(family)) {
    failures.push(`family "${family}" is declared by a skill entity but MISSING from charly.yml's families: map`);
  }
}
for (const [family, fields] of declared) {
  for (const f of REQUIRED_FIELDS) {
    if (!fields[f]) failures.push(`family "${family}" is missing the required field "${f}"`);
  }
}
if (failures.length) {
  console.error(`check-families: ${failures.length} problem(s)`);
  for (const f of failures) console.error(`  FAIL ${f}`);
  process.exit(1);
}
console.log(`check-families: OK — ${declared.size} families declared, all ${expected.length} expected present and well-formed`);
