'use client'
// Cloudflare build only (see vite.config.ts): next/image for vinext, which
// ignores next.config's images.loaderFile. Cloudinary photos get the same
// resized URLs as on Next.js (src/lib/imageLoader.ts: f_auto, c_limit, w_, q_)
// with a srcset built the way Next.js builds it; everything else goes to
// vinext's own next/image unchanged.
import { forwardRef, type ComponentProps, type CSSProperties } from 'react'
import VinextImage from 'travsus:vinext-image'
import imageLoader from '@/lib/imageLoader'

// Next.js defaults (next.config doesn't change them)
const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
const ALL_SIZES = [16, 32, 48, 64, 96, 128, 256, 384, ...DEVICE_SIZES]

type Props = ComponentProps<typeof VinextImage>

const isCloudinary = (src: unknown): src is string =>
	typeof src === 'string' && src.includes('res.cloudinary.com') && src.includes('/image/upload/')

const toNumber = (v: unknown) => (v === undefined || v === null || v === '' ? undefined : Number(v))

function widthsFor(width: number | undefined, sizes: string | undefined): { widths: number[]; kind: 'w' | 'x' } {
	if (sizes) {
		const percents = Array.from(sizes.matchAll(/(^|\s)(1?\d?\d)vw/g), (m) => parseInt(m[2], 10))
		const min = percents.length ? DEVICE_SIZES[0] * Math.min(...percents) * 0.01 : 0
		return { widths: ALL_SIZES.filter((w) => w >= min), kind: 'w' }
	}
	if (!width) return { widths: DEVICE_SIZES, kind: 'w' }
	const pick = (target: number) => ALL_SIZES.find((w) => w >= target) ?? ALL_SIZES[ALL_SIZES.length - 1]
	return { widths: [...new Set([pick(width), pick(width * 2)])], kind: 'x' }
}

const Image = forwardRef<HTMLImageElement, Props>(function Image(props, ref) {
	if (!isCloudinary(props.src) || props.unoptimized) return <VinextImage ref={ref} {...props} />

	const {
		src, alt, width, height, fill, sizes, quality, priority, preload, loading, className, style,
		placeholder: _placeholder, blurDataURL: _blur, loader: _loader, unoptimized: _u, overrideSrc: _o,
		onLoadingComplete: _olc, ...rest
	} = props as Props & Record<string, any>

	const w = toNumber(width)
	const h = toNumber(height)
	const q = toNumber(quality)
	const imgSizes = sizes ?? (fill ? '100vw' : undefined)
	const { widths, kind } = widthsFor(w, imgSizes)
	const url = (size: number) => imageLoader({ src, width: size, quality: q })
	const srcSet = widths.map((size, i) => `${url(size)} ${kind === 'w' ? `${size}w` : `${i + 1}x`}`).join(', ')
	const eager = priority || preload
	const fillStyle: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }

	return (
		<img
			ref={ref}
			{...rest}
			src={url(widths[widths.length - 1])}
			srcSet={srcSet}
			sizes={imgSizes}
			alt={alt}
			width={fill ? undefined : w}
			height={fill ? undefined : h}
			loading={eager ? 'eager' : (loading ?? 'lazy')}
			fetchPriority={eager ? 'high' : undefined}
			decoding="async"
			className={className}
			data-nimg={fill ? 'fill' : '1'}
			style={fill ? { ...fillStyle, ...style } : style}
		/>
	)
})

export default Image
export * from 'travsus:vinext-image'
