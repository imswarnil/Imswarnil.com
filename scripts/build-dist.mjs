#!/usr/bin/env node
/**
 * Builds dist/theme — the copy that actually ships.
 *
 *   node scripts/build-dist.mjs
 *
 * The repository is a workspace: demo content, notes, a component lab, the
 * design-system skill. Ghost needs none of it. This assembles the theme from
 * the parts that matter, minifies the templates on the way, and strips the
 * authoring fields out of package.json so the shipped theme has no reference
 * to the design system it was built from.
 *
 * It has NO dependencies on purpose — CSS and JS are already built and
 * committed, so a deploy runner can call this with nothing installed.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { minifyHbs } from './minify-hbs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist', 'theme');

/* What Ghost reads. Anything not named here does not ship — an allow-list,
   because a deny-list quietly leaks every new folder somebody adds. */
const INCLUDE_DIRS = ['partials', 'locales', 'assets/built', 'assets/logo'];
const INCLUDE_FILES = [
	'routes.yaml',
	'redirects.yaml',
	'LICENSE',
	'README.md',
	'ads.txt',
	'assets/favicon.svg',
	'assets/screenshot-desktop.jpg',
];

const stats = { hbs: 0, before: 0, after: 0, copied: 0 };

function walk(dir, acc = []) {
	if (!fs.existsSync(dir)) return acc;
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		if (e.name === '.DS_Store') continue;
		const full = path.join(dir, e.name);
		e.isDirectory() ? walk(full, acc) : acc.push(full);
	}
	return acc;
}

function emit(rel, contents) {
	const dest = path.join(OUT, rel);
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	fs.writeFileSync(dest, contents);
}

function copy(rel) {
	const src = path.join(ROOT, rel);
	if (!fs.existsSync(src)) return;
	const dest = path.join(OUT, rel);
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	fs.copyFileSync(src, dest);
	stats.copied += 1;
}

/* ── 1 · templates, minified ─────────────────────────────────────────────── */

function addTemplate(rel) {
	const source = fs.readFileSync(path.join(ROOT, rel), 'utf8');
	const min = minifyHbs(source);
	stats.hbs += 1;
	stats.before += Buffer.byteLength(source);
	stats.after += Buffer.byteLength(min);
	emit(rel, min);
}

fs.rmSync(OUT, { recursive: true, force: true });

for (const name of fs.readdirSync(ROOT)) {
	if (name.endsWith('.hbs')) addTemplate(name);
}
for (const file of walk(path.join(ROOT, 'partials'))) {
	const rel = path.relative(ROOT, file);
	rel.endsWith('.hbs') ? addTemplate(rel) : copy(rel);
}

/* ── 2 · everything else, as-is ──────────────────────────────────────────── */

for (const dir of INCLUDE_DIRS) {
	if (dir === 'partials') continue;
	for (const file of walk(path.join(ROOT, dir))) copy(path.relative(ROOT, file));
}
for (const file of INCLUDE_FILES) copy(file);

/* ── 3 · package.json, without the workshop ──────────────────────────────── */

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
for (const field of ['scripts', 'dependencies', 'devDependencies']) delete pkg[field];
emit('package.json', JSON.stringify(pkg, null, '\t') + '\n');

/* ── 4 · say what happened ───────────────────────────────────────────────── */

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const saved = stats.before - stats.after;
console.log(
	`dist: ${stats.hbs} templates minified ${kb(stats.before)} → ${kb(stats.after)} ` +
		`(−${((saved / stats.before) * 100).toFixed(0)}%), ${stats.copied} files copied → dist/theme`
);
