'use client'
// What's included, per package. All TRAVSUS tours are private: Standard and
// Luxury (the old "shared" lists in the data are not shown). Side by side,
// Luxury as the dark premium card, its extras over Standard marked with a sparkle.
// Always in the page (not hidden behind a click), so it's readable and indexable.
import type { ReactNode } from 'react'
import { Check, Crown, ShieldCheck, Sparkles } from 'lucide-react'
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

			<div className="mt-6 grid items-stretch gap-4 md:grid-cols-2">
				{standard.length > 0 && (
					<div className="rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
						<Header icon={<ShieldCheck className="h-5 w-5" />} name="Standard" count={standard.length} />
						<ul className="mt-5 space-y-3">
							{standard.map((item, i) => (
								<li key={i} className="flex gap-3 text-[15px] leading-snug text-neutral-700 dark:text-neutral-300">
									<span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#00AA6C]/10 text-[#00AA6C]">
										<Check className="h-3 w-3" strokeWidth={3} />
									</span>
									{item}
								</li>
							))}
						</ul>
					</div>
				)}

				{luxury.length > 0 && (
					<div className="relative overflow-hidden rounded-3xl bg-neutral-950 p-6 text-white shadow-xl ring-1 ring-amber-300/30">
						<div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
						<Header icon={<Crown className="h-5 w-5" />} name="Luxury" count={luxury.length} dark />
						<ul className="relative mt-5 space-y-3">
							{luxury.map((item, i) => {
								const extra = standard.length > 0 && !inStandard.has(item.trim().toLowerCase())
								return (
									<li key={i} className="flex gap-3 text-[15px] leading-snug text-white/85">
										<span className={`mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full ${extra ? 'bg-amber-300 text-neutral-950' : 'bg-white/10 text-amber-300'}`}>
											{extra ? <Sparkles className="h-3 w-3" strokeWidth={2.5} /> : <Check className="h-3 w-3" strokeWidth={3} />}
										</span>
										<span className={extra ? 'font-medium text-white' : ''}>{item}</span>
									</li>
								)
							})}
						</ul>
					</div>
				)}
			</div>
		</section>
	)
}

function Header({ icon, name, count, dark = false }: { icon: ReactNode; name: string; count: number; dark?: boolean }) {
	return (
		<div className="relative flex items-center gap-3">
			<span className={`grid h-11 w-11 place-items-center rounded-2xl ${dark ? 'bg-gradient-to-br from-amber-200 to-amber-500 text-neutral-950' : 'bg-brand-50 text-brand-600 dark:bg-neutral-800'}`}>
				{icon}
			</span>
			<div className="min-w-0 flex-1">
				<p className="text-lg font-bold leading-tight">{name}</p>
				<p className={`text-xs font-medium uppercase tracking-wider ${dark ? 'text-amber-300' : 'text-neutral-500'}`}>Private tour</p>
			</div>
			<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${dark ? 'bg-white/10 text-white/80' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'}`}>
				{count} ✓
			</span>
		</div>
	)
}

export default Included
