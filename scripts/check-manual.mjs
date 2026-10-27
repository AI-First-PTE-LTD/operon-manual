#!/usr/bin/env node
// Consistency checks for the manual (design §2.6). Run in CI on every pull request.
//
// Errors (exit 1):
//   - a screenshot id that is not of the form <chapter>/<topic>-<state> (lower-case kebab-case)
//   - an image that is not a screenshot tag (Markdown image or <img>): images come only from the screenshot pipeline
//   - in strict mode (--strict or MANUAL_STRICT_SCREENSHOTS=1): a screenshot id without an en and a zh-cn entry in
//     src/assets/screenshots/manifest.json
// Warnings:
//   - a referenced screenshot that has no image yet (not strict mode)
//   - a page in en/ that has no zh-cn/ counterpart (Starlight falls back to English)
//   - a manifest entry that no page references
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const docsDir = join(root, 'src/content/docs');
const locales = ['en', 'zh-cn'];
const strict = process.argv.includes('--strict') || process.env.MANUAL_STRICT_SCREENSHOTS === '1';
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

const errors = [];
const warnings = [];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : /\.(mdoc|md|mdx)$/.test(name) ? [p] : [];
  });
}

const manifest = JSON.parse(readFileSync(join(root, 'src/assets/screenshots/manifest.json'), 'utf8'));
const shots = new Set(manifest.map((m) => `${m.locale}:${m.id}`));
const referenced = new Set();

const pages = Object.fromEntries(locales.map((l) => [l, walk(join(docsDir, l)).map((p) => relative(join(docsDir, l), p))]));

for (const locale of locales) {
  for (const page of pages[locale]) {
    const file = join(docsDir, locale, page);
    const text = readFileSync(file, 'utf8');
    const where = relative(root, file);
    if (/!\[[^\]]*\]\(/.test(text) || /<img\b/i.test(text)) {
      errors.push(`${where}: free images are not allowed; use {% screenshot id="..." /%}`);
    }
    for (const m of text.matchAll(/\{%\s*screenshot\s+[^%]*?id="([^"]*)"/g)) {
      const id = m[1];
      referenced.add(id);
      if (!ID.test(id)) {
        errors.push(`${where}: screenshot id "${id}" is not <chapter>/<topic>-<state> in lower-case kebab-case`);
        continue;
      }
      for (const l of locales) {
        if (!shots.has(`${l}:${id}`)) {
          (strict ? errors : warnings).push(`${where}: screenshot "${id}" has no ${l} image yet`);
        }
      }
    }
  }
}

for (const page of pages.en) {
  if (!pages['zh-cn'].includes(page)) warnings.push(`zh-cn/${page} is missing (English is shown instead)`);
}
for (const m of manifest) {
  if (!referenced.has(m.id)) warnings.push(`manifest: screenshot "${m.id}" (${m.locale}) is not used by any page`);
}

const uniq = (a) => [...new Set(a)];
for (const w of uniq(warnings)) console.warn(`warning: ${w}`);
for (const e of uniq(errors)) console.error(`error: ${e}`);
console.log(
  `check-manual: ${pages.en.length} en pages, ${pages['zh-cn'].length} zh-cn pages, ${referenced.size} screenshot ids, ` +
    `${uniq(errors).length} errors, ${uniq(warnings).length} warnings${strict ? ' (strict)' : ''}`,
);
process.exit(errors.length > 0 ? 1 : 0);
