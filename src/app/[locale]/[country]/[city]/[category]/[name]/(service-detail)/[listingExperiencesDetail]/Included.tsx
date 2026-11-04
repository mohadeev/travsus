'use client'
// What's included, per package. All TRAVSUS tours are private: Standard and
// Luxury (the old "shared" lists in the data are not shown). Side by side in
// two plain cards; Luxury is outlined, and what it adds over Standard has a "+".
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
		<section>
			<span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-brand-500" />
			<h2 className="text-2xl font-bold tracking-tight">
				{t('newServicedetailListingExperiencesDetailIncluded_Included')}
			</h2>
			<p className="mt-1 text-neutral-500">
				{t('newServicedetailListingExperiencesDetailIncluded_Everything_Included_In_Your_Package')}
			</p>

			<div className="mt-6 grid items-start gap-4 md:grid-cols-2">
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

/** One package: a plain white card; Luxury has a dark outline and an "Upgrade" tag. */
function Package({ name, featured = false, children }: { name: string; featured?: boolean; children: ReactNode }) {
	return (
		<div
			className={`rounded-2xl bg-white p-5 sm:p-6 dark:bg-neutral-900 ${
				featured ? 'border-[1.5px] border-neutral-950 dark:border-white' : 'border border-neutral-200 dark:border-neutral-800'
			}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-lg font-semibold leading-tight">{name}</p>
					<p className="mt-0.5 text-sm text-neutral-500">Private tour</p>
				</div>
				{featured && (
					<span className="rounded-full bg-neutral-950 px-2.5 py-1 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950">Upgrade</span>
				)}
			</div>
			<ul className="mt-5 space-y-3 border-t border-neutral-100 pt-5 dark:border-neutral-800">{children}</ul>
		</div>
	)
}

function Item({ extra = false, children }: { extra?: boolean; children: ReactNode }) {
	const Icon = extra ? Plus : Check
	return (
		<li className={`flex gap-3 text-[15px] leading-snug ${extra ? 'font-medium text-neutral-950 dark:text-white' : 'text-neutral-700 dark:text-neutral-300'}`}>
			<Icon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-950 dark:text-white" strokeWidth={2.5} aria-hidden />
			{children}
		</li>
	)
}

export default Included
