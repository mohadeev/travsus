'use client'
// "Plan your trip": what the competitors ranking on Google give that a tour
// page lacked. The best time to go (season by season, with a desert note when
// the route reaches the Sahara), the nearest airport to the start, what to
// bring, practical info (money, plugs, SIM, visa), that the private tour can
// be changed (opens the chat), and day trips along the route to add.
import { CalendarRange, Info, Luggage, MessageCircle, Plane } from 'lucide-react'
import ShelfCard from '@/app/[locale]/(home)/ShelfCard'
import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { useAppDispatch } from '@/store/hooks'
import { openChat } from '@/store/slices/ui'
import { useTourService } from '../TourServiceContext'

// Nearest airport to each start city: [name, IATA code, km from the centre]
const AIRPORTS: Record<string, [string, string, number]> = {
	marrakech: ['Marrakech Menara', 'RAK', 6],
	fes: ['Fès–Saïss', 'FEZ', 15],
	fez: ['Fès–Saïss', 'FEZ', 15],
	casablanca: ['Casablanca Mohammed V', 'CMN', 30],
	tangier: ['Tangier Ibn Battuta', 'TNG', 15],
	ouarzazate: ['Ouarzazate', 'OZZ', 2],
	agadir: ['Agadir Al Massira', 'AGA', 25],
	errachidia: ['Errachidia Moulay Ali Cherif', 'ERH', 5],
	merzouga: ['Errachidia Moulay Ali Cherif', 'ERH', 130],
	chefchaouen: ['Tetouan Sania Ramel', 'TTU', 65],
	rabat: ['Rabat–Salé', 'RBA', 8],
	essaouira: ['Essaouira Mogador', 'ESU', 15],
}
const SEASONS = ['spring', 'autumn', 'winter', 'summer'] as const
const BRING = ['bring_shoes', 'bring_layers', 'bring_sun', 'bring_cash', 'bring_cover', 'bring_passport'] as const

export default function TourPlanning() {
	const t = useTranslations('TourPlan')
	const dispatch = useAppDispatch()
	const tour: any = useTourService() || {}
	const startCity = String(tour.startAddress?.city ?? '')
	const airport = AIRPORTS[startCity.toLowerCase()]
	const cityName = tour.days?.[0]?.city || startCity
	const text = JSON.stringify(tour.days ?? []).toLowerCase()
	const desert = /merzouga|sahara|erg chebbi|zagora|chigaga|desert/.test(text)

	return (
		<section id="plan">
			<h2 className="headline text-[24px] !leading-tight">{t('title')}</h2>
			<div className="mt-5 grid gap-3 sm:grid-cols-2">
				<Card icon={<CalendarRange className="h-5 w-5" strokeWidth={2} />} title={t('when_title')}>
					<ul className="space-y-1.5">
						{SEASONS.map((key) => (
							<li key={key}>{t(desert ? `${key}_desert` : key)}</li>
						))}
					</ul>
				</Card>
				<div className="grid gap-3">
					{airport && (
						<Card icon={<Plane className="h-5 w-5" strokeWidth={2} />} title={t('getting_title')}>
							{t('getting_text', { airport: airport[0], code: airport[1], km: airport[2], city: cityName })}
						</Card>
					)}
					<Card icon={<MessageCircle className="h-5 w-5" strokeWidth={2} />} title={t('custom_title')}>
						<p>{t('custom_text')}</p>
						<button
							type="button"
							onClick={() => dispatch(openChat())}
							className="mt-3 inline-flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-sm font-bold text-ink transition hover:bg-white dark:border-white dark:text-white dark:hover:bg-neutral-800"
						>
							{t('custom_cta')}
						</button>
					</Card>
				</div>
				<Card icon={<Info className="h-5 w-5" strokeWidth={2} />} title={t('practical_title')}>
					<ul className="space-y-1.5">
						{(['practical_money', 'practical_plugs', 'practical_sim', 'practical_visa'] as const).map((key) => (
							<li key={key}>{t(key)}</li>
						))}
					</ul>
				</Card>
				<div>
					<Card icon={<Luggage className="h-5 w-5" strokeWidth={2} />} title={t('bring_title')}>
						<ul className="list-disc space-y-1 pl-5">
							{BRING.filter((key) => desert || key !== 'bring_layers').map((key) => (
								<li key={key}>{t(key)}</li>
							))}
						</ul>
					</Card>
				</div>
			</div>

			{/* Day trips and activities in the places on the route */}
			{(tour.addOns ?? []).length > 0 && (
				<div className="mt-8">
					<h3 className="text-lg font-bold leading-6">{t('addons_title')}</h3>
					<p className="mt-1 text-sm text-ink-soft dark:text-neutral-400">{t('addons_text')}</p>
					<ul className="mt-4 grid grid-cols-2 gap-x-2 gap-y-6 sm:gap-x-4 lg:grid-cols-4">
						{(tour.addOns as any[]).map((addOn) => (
							<li key={addOn.id} className="min-w-0">
								<ShelfCard tour={addOn} />
							</li>
						))}
					</ul>
				</div>
			)}
		</section>
	)
}

function Card({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
	return (
		<div className="h-full rounded-3xl bg-neutral-100 p-5 sm:p-6 dark:bg-neutral-900">
			<span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink dark:bg-neutral-800 dark:text-white">{icon}</span>
			<h3 className="mt-3 text-base font-bold leading-6">{title}</h3>
			<div className="mt-1 text-sm leading-6 text-ink-soft dark:text-neutral-400">{children}</div>
		</div>
	)
}
