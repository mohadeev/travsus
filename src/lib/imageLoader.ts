// Image loader for next/image: Cloudinary resizes and compresses our photos
// (f_auto: WebP/AVIF when the browser takes it, q_auto: right quality,
// w_: the width the page asks for), so images don't go through Vercel's image
// optimisation, which has a monthly quota. Other images load as they are.
const UPLOAD = '/image/upload/'

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
	if (src.includes('res.cloudinary.com') && src.includes(UPLOAD)) {
		const [base, rest] = src.replace(/^http:/, 'https:').split(UPLOAD)
		const options = `f_auto,c_limit,w_${width},q_${quality ? quality : 'auto'}`
		return `${base}${UPLOAD}${options}/${rest}`
	}
	if (src.startsWith('data:') || src.startsWith('blob:')) return src
	// Local files and other websites: no resizing (the browser still gets one size per width)
	return width ? `${src}${src.includes('?') ? '&' : '?'}w=${width}` : src
}
