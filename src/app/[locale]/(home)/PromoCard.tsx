import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

const DEFAULT_BG = '/images/freepik_assistant_1753873160366.png'

interface PromoCardProps {
	badge: ReactNode
	title: ReactNode
	subtitle: ReactNode
	ctaLabel: string
	ctaHref: string
	footnote?: ReactNode
	backgroundImage?: string
	children?: ReactNode
}

// Shared rounded banner used by the home page promos.
export default function PromoCard({
	badge,
	title,
	subtitle,
	ctaLabel,
	ctaHref,
	footnote,
	backgroundImage = DEFAULT_BG,
	children,
}: PromoCardProps) {
	return (
		<section
			className="relative isolate overflow-hidden rounded-3xl bg-cover bg-center px-6 py-12 shadow-xl sm:px-12 sm:py-16"
			style={{ backgroundImage: `url("${backgroundImage}")` }}
		>
			{/* Darkens the image so white text stays readable */}
			<div
				aria-hidden
				className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/45 to-black/10"
			/>

			<div className="max-w-2xl">
				<span className="mb-6 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black sm:text-sm">
					{badge}
				</span>

				<h2 className="mb-4 text-3xl font-black leading-tight text-white sm:text-5xl">
					{title}
				</h2>

				<p className="mb-8 text-lg font-semibold text-white/90 sm:text-xl">
					{subtitle}
				</p>

				{children}

				<Link
					href={ctaHref}
					className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-base font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-lg"
				>
					{ctaLabel}
					<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
				</Link>

				{footnote && <p className="mt-6 text-sm text-white/70">{footnote}</p>}
			</div>
		</section>
	)
}
