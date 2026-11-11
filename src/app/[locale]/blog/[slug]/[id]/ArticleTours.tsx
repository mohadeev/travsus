// "Tours for this trip": tour cards inside a blog article, like an ad block in
// the middle of the text (a few cards that scroll sideways) and again at the
// end (a grid). Which tours: lib/blogTours (only tours that match the article).
import { useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import ShelfCard from '@/app/[locale]/(home)/ShelfCard'
import HomeRow from '@/app/[locale]/(home)/HomeRow'

type Card = Omit<HomeTour, 'searchText'>

export default function ArticleTours({ tours, variant }: { tours: Card[]; variant: 'inline' | 'end' }) {
	const t = useTranslations('Blog')
	if (!tours.length) return null

	if (variant === 'inline') {
		return (
			<aside aria-label={t('article_tours_title')} className="not-prose mx-auto my-10 max-w-3xl px-5">
				<div className="rounded-3xl bg-neutral-100 p-5 sm:p-6 dark:bg-neutral-900">
					<p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-soft dark:text-neutral-400">{t('article_tours_label')}</p>
					<h2 className="mt-1 text-xl font-bold leading-6">{t('article_tours_title')}</h2>
					<div className="mt-4">
						<HomeRow label={t('article_tours_title')}>
							{tours.slice(0, 3).map((tour) => (
								<li key={tour.id} className="min-w-0 snap-start">
									<ShelfCard tour={tour} />
								</li>
							))}
						</HomeRow>
					</div>
				</div>
			</aside>
		)
	}

	return (
		<section className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20">
			<h2 className="headline text-2xl !leading-7 sm:text-3xl sm:!leading-9">{t('article_tours_end_title')}</h2>
			<p className="mt-1 text-base text-ink-soft dark:text-neutral-400">{t('article_tours_end_text')}</p>
			<ul className="mt-6 grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 lg:grid-cols-4">
				{tours.slice(0, 4).map((tour) => (
					<li key={tour.id} className="min-w-0">
						<ShelfCard tour={tour} />
					</li>
				))}
			</ul>
		</section>
	)
}
