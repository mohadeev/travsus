// Full-photo banner: happy people, dark gradient, bold white text, one action.
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface PhotoBannerProps {
	photo: string
	eyebrow?: ReactNode
	title: ReactNode
	text?: ReactNode
	ctaLabel: string
	ctaHref: string
	footnote?: ReactNode
	/** Where the text sits on the photo */
	align?: 'left' | 'right'
	children?: ReactNode
}

export default function PhotoBanner({
	photo,
	eyebrow,
	title,
	text,
	ctaLabel,
	ctaHref,
	footnote,
	align = 'left',
	children,
}: PhotoBannerProps) {
	const right = align === 'right'

	return (
		<section className="relative isolate overflow-hidden rounded-[28px] bg-neutral-900 text-white">
			<Image src={photo} alt="" fill sizes="(max-width: 1280px) 100vw, 1280px" className="-z-10 object-cover" />
			<div
				className={`absolute inset-0 -z-10 ${
					right
						? 'bg-gradient-to-l from-black/80 via-black/45 to-transparent'
						: 'bg-gradient-to-r from-black/80 via-black/45 to-transparent'
				}`}
			/>

			<div
				className={`flex min-h-[420px] flex-col justify-end p-7 sm:min-h-[480px] sm:justify-center sm:p-14 ${
					right ? 'sm:items-end sm:text-right' : ''
				}`}
			>
				<div className="max-w-lg">
					{eyebrow && (
						<span className="mb-5 inline-block rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-neutral-950">
							{eyebrow}
						</span>
					)}
					<h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{title}</h2>
					{text && <p className="mt-4 text-lg text-white/85">{text}</p>}
					{children}
					<Link
						href={ctaHref as any}
						className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
					>
						{ctaLabel}
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>
					{footnote && <p className="mt-5 max-w-md text-xs text-white/60">{footnote}</p>}
				</div>
			</div>
		</section>
	)
}
