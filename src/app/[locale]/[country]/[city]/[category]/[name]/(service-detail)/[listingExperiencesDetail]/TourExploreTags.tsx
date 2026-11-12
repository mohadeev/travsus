'use client'
// "Explore more" at the very end of the tour page: link chips to the guides of
// the cities this tour goes through and of the country (built on the server
// from the route, see lib/tourTags).
import Link from 'next/link'
import type { Route } from 'next'
import { MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { TourTag } from '@/lib/tourTags'
import { useTourService } from '../TourServiceContext'

export default function TourExploreTags() {
	const t = useTranslations('TourPage')
	const service: any = useTourService()
	const tags: TourTag[] = service?.exploreTags ?? []
	if (!tags.length) return null
	return (
		<section aria-labelledby="explore-more" className="mt-16 border-t border-neutral-200 pt-10 dark:border-neutral-800">
			<h2 id="explore-more" className="headline mb-4 text-[24px] !leading-tight">{t('explore_more')}</h2>
			<ul className="flex flex-wrap gap-2">
				{tags.map((tag) => (
					<li key={tag.href}>
						<Link
							href={tag.href as Route}
							prefetch={false}
							className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-900"
						>
							<MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
							{tag.kind === 'country' ? t('tag_country_guide', { country: tag.name }) : t('tag_things_to_do', { city: tag.name })}
						</Link>
					</li>
				))}
			</ul>
		</section>
	)
}
