#!/usr/bin/env node
/**
 * Builds assets/built/js — the minified scripts the theme actually loads.
 *
 *   node scripts/build-js.mjs
 *
 * Two sources, one output folder:
 *
 *   assets/js/main.js              this theme's own behaviour
 *   creator-design-system/…        nav.js and collection.js, vendored
 *
 * The vendored copies are checked in so a machine without the design system
 * can still build and deploy. Minification is uglify-js, which is already in
 * the tree — the theme adds no dependency for it.
 *
 * If uglify is missing (a checkout with no node_modules), the sources are
 * copied verbatim rather than failing: a slightly larger file beats a broken
 * deploy.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets', 'built', 'js');

const DS = (() => {
	const linked = path.join(ROOT, 'node_modules', 'creator-design-system');
	if (fs.existsSync(path.join(linked, 'src', 'nav.js'))) return linked;
	const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
	const spec = pkg.devDependencies?.['creator-design-system'] ?? '';
	if (spec.startsWith('file:')) {
		const p = path.resolve(ROOT, spec.slice(5));
		if (fs.existsSync(path.join(p, 'src', 'nav.js'))) return p;
	}
	return null;
})();

/* 1 · vendor the design system's scripts into assets/js, so they are in the
       repo and reviewable next to the theme's own. */
if (DS) {
	fs.copyFileSync(path.join(DS, 'src', 'nav.js'), path.join(ROOT, 'assets/js/nav.js'));
	fs.copyFileSync(
		path.join(DS, 'collection', 'collection.js'),
		path.join(ROOT, 'assets/js/collection.js')
	);
} else {
	console.warn('build:js — design system not present; using the vendored copies as they are.');
}

/* 2 · minify each one into assets/built/js. */
let minify = null;
try {
	({ minify } = require('uglify-js'));
} catch {
	console.warn('build:js — uglify-js not installed; copying scripts unminified.');
}

fs.mkdirSync(OUT, { recursive: true });

let before = 0;
let after = 0;

for (const name of fs.readdirSync(path.join(ROOT, 'assets/js')).sort()) {
	if (!name.endsWith('.js')) continue;
	const source = fs.readFileSync(path.join(ROOT, 'assets/js', name), 'utf8');
	before += Buffer.byteLength(source);

	let code = source;
	if (minify) {
		const result = minify(source, {
			compress: { passes: 2 },
			mangle: true,
			output: { comments: false },
		});
		if (result.error) throw new Error(`${name}: ${result.error}`);
		code = result.code + '\n';
	}

	after += Buffer.byteLength(code);
	fs.writeFileSync(path.join(OUT, name), code);
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log(
	`build:js — ${kb(before)} → ${kb(after)}` +
		(before ? ` (−${(((before - after) / before) * 100).toFixed(0)}%)` : '') +
		' → assets/built/js'
);
