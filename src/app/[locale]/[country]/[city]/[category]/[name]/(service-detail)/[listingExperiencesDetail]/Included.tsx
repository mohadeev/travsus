'use client'
// What's included, per package. All TRAVSUS tours are private: Standard and
// Luxury (the old "shared" lists in the data are not shown).
// Always in the page (not hidden behind a click), so it's readable and indexable.
import { Check } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { useTourService } from '../TourServiceContext'

const Included = () => {
	const { inclusions }: any = useTourService()
	const t = useTranslations('newServicedetailListingExperiencesDetailIncluded')
	if (!inclusions) return null

	const packages = [
		{ title: 'Standard · Private', items: inclusions.standard?.private ?? [] },
		{ title: 'Luxury · Private', items: inclusions.luxury?.private ?? [] },
	].filter((pack) => pack.items.length > 0)
	if (!packages.length) return null

	return (
		<section>
			<span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-brand-500" />
			<h2 className="text-2xl font-bold tracking-tight">
				{t('newServicedetailListingExperiencesDetailIncluded_Included')}
			</h2>
			<p className="mt-1 text-neutral-500">
				{t('newServicedetailListingExperiencesDetailIncluded_Everything_Included_In_Your_Package')}
			</p>
			<div className="mt-6 grid items-start gap-4 sm:grid-cols-2">
				{packages.map(({ title, items }) => (
					<details
						key={title}
						open
						className="group rounded-2xl border border-neutral-200 p-5 open:pb-6 dark:border-neutral-800"
					>
						<summary className="flex cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden">
							{title}
							<span className="text-sm font-normal text-neutral-500 group-open:hidden">{items.length}</span>
						</summary>
						<ul className="mt-4 space-y-2.5">
							{items.map((item: string, i: number) => (
								<li key={i} className="flex gap-3 text-[15px] text-neutral-700 dark:text-neutral-300">
									<Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00AA6C]" strokeWidth={2.5} />
									{item}
								</li>
							))}
						</ul>
					</details>
				))}
			</div>
		</section>
	)
}

export default Included
