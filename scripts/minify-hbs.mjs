/**
 * Handlebars/HTML whitespace minifier.
 *
 * Ghost renders templates at request time, so the only way to strip whitespace
 * from the HTML a reader downloads is to strip it from the templates first —
 * which is why this runs on the way into dist/ and never on the source.
 *
 * The rules are deliberately conservative. Whitespace between inline elements
 * is meaningful ("</span> <span>" is not "</span><span>"), so runs collapse to
 * ONE space rather than to nothing. Everything that treats whitespace as
 * content — <pre>, <textarea>, <script>, <style> — is lifted out first and put
 * back untouched.
 *
 * Comments go entirely. Handlebars comments never reach the browser anyway,
 * but HTML comments do, and none of ours are load-bearing.
 */

const PROTECTED = /<(pre|textarea|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;

// NUL never appears in a template, so a placeholder built from it cannot
// collide with anything the file actually contains. A plain ` 3 ` would: the
// first template with a bare number between two spaces would get a <script>
// spliced into the middle of a sentence on the way back.
const MARK = (i) => `\u0000${i}\u0000`;

export function minifyHbs(source) {
	const kept = [];

	// 1 · lift out everything whose whitespace is content
	let out = source.replace(PROTECTED, (match) => {
		kept.push(match);
		return MARK(kept.length - 1);
	});

	// 2 · comments: {{!-- … --}}, {{! … }} and <!-- … -->
	out = out
		.replace(/\{\{!--[\s\S]*?--\}\}/g, '')
		.replace(/\{\{![^}]*\}\}/g, '')
		.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');

	// 3 · a line break and its indentation become one space; never nothing
	out = out
		.replace(/\s*\r?\n\s*/g, ' ')
		.replace(/[ \t]{2,}/g, ' ')
		.trim();

	// 4 · put the protected blocks back
	out = out.replace(/\u0000(\d+)\u0000/g, (_, i) => kept[Number(i)]);

	return out + '\n';
}
