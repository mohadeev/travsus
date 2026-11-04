// Big two-part promo card, TripAdvisor layout: a photo on one side and a solid
// colour panel with a heavy headline, one line of text and a pill button on the
// other. "dark" = deep green panel, white text; "yellow" = yellow panel on the left.
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
	tone: 'dark' | 'yellow'
	photo: string
	eyebrow?: ReactNode
	title: string
	text: string
	cta: string
	href: string
}

export default function PromoCard({ tone, photo, eyebrow, title, text, cta, href }: Props) {
	const dark = tone === 'dark'
	return (
		<section className={`grid overflow-hidden rounded-xl md:min-h-[340px] ${dark ? 'md:grid-cols-2' : 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'}`}>
			<div className={`relative aspect-[16/10] md:aspect-auto ${dark ? '' : 'md:order-last'}`}>
				<Image src={photo} alt="" fill sizes="(max-width: 768px) 100vw, 620px" className="object-cover" />
			</div>
			<div className={`flex flex-col items-start justify-center gap-3.5 p-6 md:px-12 md:py-10 ${dark ? 'bg-[#004f32] text-white' : 'bg-[#fcd34d] text-black'}`}>
				{eyebrow && <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.06em]">{eyebrow}</p>}
				<h2 className="headline text-[28px] !font-black !leading-[1.08] md:text-[40px]">{title}</h2>
				<p className="max-w-[34ch] text-base md:text-lg">{text}</p>
				<Link
					href={href as any}
					className={`mt-1 rounded-full px-[18px] py-3 text-base font-bold leading-none transition ${dark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'}`}
				>
					{cta}
				</Link>
			</div>
		</section>
	)
}
