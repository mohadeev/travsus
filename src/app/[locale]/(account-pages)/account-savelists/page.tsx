// Saved tours: the tours you saved with the heart, newest saved first.
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getHomeData } from '@/lib/homeData'
import { getSessionUser } from '@/lib/session'
import TourCard from '../../(home)/TourCard'
import SavedItem from './SavedItem'

export const dynamic = 'force-dynamic'

export default async function SavedToursPage({ params }: { params: { locale: string } }) {
	const { locale } = params
	setRequestLocale(locale)
	const t = await getTranslations('Account')
	const user = await getSessionUser()
	if (!user) return null // the layout shows the sign-in prompt

	const savedIds: string[] = [...(user.savedList ?? [])].reverse()
	const { tours } = await getHomeData(locale)
	const byId = new Map(tours.map((tour) => [tour.id, tour]))
	const saved = savedIds.map((id) => byId.get(id)).filter((tour): tour is NonNullable<typeof tour> => !!tour)

	return (
		<div>
			<h1 className="text-2xl font-bold tracking-tight sm:text-5xl">{t('nav_saved')}</h1>
			<p className="mt-2 text-neutral-500">{t('saved_count', { count: saved.length })}</p>

			{saved.length === 0 ? (
				<div className="mt-10 rounded-[28px] bg-neutral-100 px-6 py-14 text-center dark:bg-neutral-900">
					<Heart className="mx-auto h-10 w-10 text-neutral-400" strokeWidth={1.5} />
					<p className="mt-5 text-2xl font-bold tracking-tight">{t('saved_empty_title')}</p>
					<p className="mx-auto mt-2 max-w-sm text-neutral-500">{t('saved_empty_text')}</p>
					<Link
						href={`/${locale}/search?query=` as any}
						className="mt-7 inline-flex h-12 items-center rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
					>
						{t('explore_tours')}
					</Link>
				</div>
			) : (
				<ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-10 xl:grid-cols-3">
					{saved.map((tour) => (
						<li key={tour.id}>
							<SavedItem id={tour.id} name={tour.name}>
								<TourCard tour={tour} />
							</SavedItem>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
