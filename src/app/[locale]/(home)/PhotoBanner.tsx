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
		<section className="relative isolate overflow-hidden rounded-3xl bg-neutral-900 sm:rounded-[28px] text-white">
			<Image src={photo} alt="" fill sizes="(max-width: 1280px) 100vw, 1280px" className="-z-10 object-cover" />
			<div
				className={`absolute inset-0 -z-10 ${
					right
						? 'bg-gradient-to-t from-black/85 via-black/55 to-black/10 sm:bg-gradient-to-l sm:from-black/80 sm:via-black/45 sm:to-transparent'
						: 'bg-gradient-to-t from-black/85 via-black/55 to-black/10 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/45 sm:to-transparent'
				}`}
			/>

			<div
				className={`flex min-h-[340px] flex-col justify-end p-6 sm:min-h-[480px] sm:justify-center sm:p-14 ${
					right ? 'sm:items-end sm:text-right' : ''
				}`}
			>
				<div className="max-w-lg">
					{eyebrow && (
						<span className="mb-3 inline-block rounded-full bg-white px-3 py-1 text-[11px] sm:mb-5 sm:text-xs font-bold uppercase tracking-wider text-neutral-950">
							{eyebrow}
						</span>
					)}
					<h2 className="text-[26px] font-bold leading-tight tracking-tight [text-shadow:0_1px_16px_rgb(0_0_0/0.35)] sm:text-5xl">{title}</h2>
					{text && <p className="mt-2 text-base text-white/85 sm:mt-4 sm:text-lg">{text}</p>}
					{children}
					<Link
						href={ctaHref as any}
						className="group mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 sm:mt-8 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
					>
						{ctaLabel}
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>
					{footnote && <p className="mt-4 max-w-md text-[11px] leading-snug text-white/60 sm:mt-5 sm:text-xs">{footnote}</p>}
				</div>
			</div>
		</section>
	)
}
