// Image loader for next/image: Cloudinary resizes and compresses our photos
// (f_auto: WebP/AVIF when the browser takes it, q_auto: right quality,
// w_: the width the page asks for), so images don't go through Vercel's image
// optimisation, which has a monthly quota. Other images load as they are.
const UPLOAD = '/image/upload/'

/**
 * Cloudinary delivery URL: f_auto (WebP/AVIF), q_auto, and a width cap.
 * An existing transform is replaced, so this is safe to call twice.
 */
export function cloudinarySrc(src: string, width: number, quality?: number) {
	if (!src.includes('res.cloudinary.com') || !src.includes(UPLOAD)) return src
	const [base, rest] = src.replace(/^http:/, 'https:').split(UPLOAD)
	const file = rest.replace(/^(?:(?!v\d+\/)[^/]+\/)+/, '')
	const q = quality || 'auto'
	return `${base}${UPLOAD}f_auto,c_limit,w_${Math.max(1, Math.round(width))},q_${q}/${file}`
}

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
	if (src.includes('res.cloudinary.com') && src.includes(UPLOAD)) return cloudinarySrc(src, width, quality)
	if (src.startsWith('data:') || src.startsWith('blob:')) return src
	// Local files and other websites: no resizing (the browser still gets one size per width)
	return width ? `${src}${src.includes('?') ? '&' : '?'}w=${width}` : src
}
