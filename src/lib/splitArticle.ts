// Splits article HTML in two near the middle, at the start of a section (an
// <h2>, else an <h3>, else after a paragraph), so something can be placed
// between the halves without cutting a paragraph or a list.
export function splitArticle(html: string): [string, string] {
	const length = html.length
	if (length < 1500) return [html, '']
	const middle = length * 0.45
	const near = (positions: number[]) =>
		positions.filter((p) => p > length * 0.2 && p < length * 0.8).sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle))[0]
	const at = (pattern: RegExp, after = false) =>
		Array.from(html.matchAll(pattern)).map((m) => (m.index ?? 0) + (after ? m[0].length : 0))
	const cut = near(at(/<h2[\s>]/gi)) ?? near(at(/<h3[\s>]/gi)) ?? near(at(/<\/p>/gi, true))
	return cut ? [html.slice(0, cut), html.slice(cut)] : [html, '']
}
