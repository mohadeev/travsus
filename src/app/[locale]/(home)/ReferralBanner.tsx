// Affiliate program banner, calm and editorial: a warm sand card with the
// invitation, the three facts of the program as a simple row of numbers, one
// black button, and a real photo of friends on the right (on top on phones).
// Same texts as the affiliates page.
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PHOTOS } from '@/lib/photos'

export default function ReferralBanner() {
	const t = useTranslations('Affiliates')

	const facts = [
		[t('stat_rate_value'), t('stat_rate_label')],
		[t('stat_cookie_value'), t('stat_cookie_label')],
		[t('stat_payout_value'), t('stat_payout_label')],
	]

	return (
		<section className="grid overflow-hidden rounded-3xl bg-sand-100 text-neutral-950 sm:rounded-[28px] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] dark:bg-neutral-900 dark:text-white">
			<div className="flex flex-col justify-center px-6 py-8 sm:px-12 sm:py-12 lg:px-14 lg:py-14">
				<p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">{t('eyebrow')}</p>
				<h2 className="headline mt-2 text-[28px] sm:mt-3 sm:text-[40px]">{t('hero_title')}</h2>
				<p className="mt-3 max-w-md text-base leading-relaxed text-neutral-600 sm:mt-4 sm:text-lg dark:text-neutral-300">{t('hero_text')}</p>

				{/* The program in three numbers */}
				<dl className="mt-7 divide-y divide-neutral-300/70 border-y border-neutral-300/70 sm:mt-9 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-neutral-700 dark:border-neutral-700">
					{facts.map(([value, label], i) => (
						<div key={value} className={`flex items-baseline gap-3 py-3 sm:block sm:py-5 ${i > 0 ? 'sm:pl-5' : ''} ${i < 2 ? 'sm:pr-5' : ''}`}>
							<dd className="w-24 shrink-0 whitespace-nowrap text-2xl font-bold tracking-tight sm:w-auto sm:text-[28px]">{value}</dd>
							<dt className="text-sm leading-snug text-neutral-600 sm:mt-1 sm:text-[13px] dark:text-neutral-400">{label}</dt>
						</div>
					))}
				</dl>

				<div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-5">
					<Link
						href={'/affiliates' as any}
						className="group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-neutral-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
					>
						{t('form_submit')}
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
					</Link>
					<p className="text-center text-sm text-neutral-500 sm:text-left dark:text-neutral-400">{t('cta_text')}</p>
				</div>
			</div>

			<div className="relative order-first aspect-[16/10] lg:order-none lg:aspect-auto lg:min-h-full">
				<Image src={PHOTOS.referral} alt="" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover object-[60%_40%]" />
			</div>
		</section>
	)
}
