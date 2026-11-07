'use client'
// What's included, per package. All TRAVSUS tours are private: Standard and
// Luxury (the old "shared" lists in the data are not shown). Side by side as
// cards like the booking form's hotel options (black, not orange); what
// Luxury adds over Standard has a "+".
// Always in the page (not hidden behind a click), so it's readable and indexable.
import type { ReactNode } from 'react'
import { Check, Plus } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { useTourService } from '../TourServiceContext'

const Included = () => {
	const { inclusions }: any = useTourService()
	const t = useTranslations('newServicedetailListingExperiencesDetailIncluded')
	if (!inclusions) return null

	const standard: string[] = inclusions.standard?.private ?? []
	const luxury: string[] = inclusions.luxury?.private ?? []
	if (!standard.length && !luxury.length) return null
	const inStandard = new Set(standard.map((item) => item.trim().toLowerCase()))

	return (
		<section id="details">
			<h2 className="headline text-[24px] !leading-tight">
				{t('newServicedetailListingExperiencesDetailIncluded_Included')}
			</h2>
			<p className="mt-1 text-neutral-600 dark:text-neutral-400">
				{t('newServicedetailListingExperiencesDetailIncluded_Everything_Included_In_Your_Package')}
			</p>

			<div className="mt-5 grid items-stretch gap-4 md:grid-cols-2">
				{standard.length > 0 && (
					<Package name="Standard">
						{standard.map((item, i) => (
							<Item key={i}>{item}</Item>
						))}
					</Package>
				)}

				{luxury.length > 0 && (
					<Package name="Luxury" featured>
						{luxury.map((item, i) => {
							// What Luxury adds over Standard gets a "+"
							const extra = standard.length > 0 && !inStandard.has(item.trim().toLowerCase())
							return (
								<Item key={i} extra={extra}>
									{item}
								</Item>
							)
						})}
					</Package>
				)}
			</div>
		</section>
	)
}

/** One package, as a card like the hotel options in the booking form,
 *  in black instead of orange: Luxury gets the thick black border. */
function Package({ name, featured = false, children }: { name: string; featured?: boolean; children: ReactNode }) {
	return (
		<div
			className={`h-full rounded-2xl border bg-white dark:bg-neutral-900 ${
				featured
					? 'border-2 border-black p-[19px] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)] dark:border-white'
					: 'border-neutral-300 p-5 dark:border-neutral-700'
			}`}
		>
			<h3 className="flex items-center gap-2 text-xl font-bold leading-6">
				{name}
				{featured && <span className="rounded bg-black px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white dark:bg-white dark:text-black">Upgrade</span>}
			</h3>
			<p className="mt-1 text-sm leading-5 text-ink-soft dark:text-neutral-400">Private tour</p>
			<ul className="mt-4 space-y-2.5">{children}</ul>
		</div>
	)
}

function Item({ extra = false, children }: { extra?: boolean; children: ReactNode }) {
	const Icon = extra ? Plus : Check
	return (
		<li className={`flex gap-3 text-[15px] leading-snug ${extra ? 'font-medium text-ink dark:text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>
			<Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink dark:text-white" strokeWidth={2.5} aria-hidden />
			{children}
		</li>
	)
}

export default Included
