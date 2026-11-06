'use client'
// Phones, under the "About" text, as on TripAdvisor: "from €276 per person",
// then a grey box "Select date and travelers" with the date, the travelers
// and a green "Check availability" button. Each opens the booking sheet of
// the bar at the bottom of the screen (MobileFooterSticky).
import { CalendarDays, Users } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { formatTripDates, readTripDates } from '@/lib/tripDates'
import { useAppSelector } from '@/store/hooks'
import { selectBooking } from '@/store/slices/booking'
import { useTourService } from '../TourServiceContext'

export const OPEN_RESERVE_EVENT = 'travsus:open-reserve'

export default function MobileBookingBox() {
	const t = useTranslations('TourPage')
	const tHome = useTranslations('Home')
	const locale = useLocale()
	const service: any = useTourService()
	const { guests, selectedDate } = useAppSelector(selectBooking)
	const price: number = service?.fromPricePerPerson ?? 0
	const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
	const [fromBefore, fromAfter = ''] = tHome.raw('from_price').split('{price}')
	const dates = formatTripDates(...readTripDates(selectedDate), locale)
	const adults: number = guests?.guestAdults || 2
	const open = () => window.dispatchEvent(new Event(OPEN_RESERVE_EVENT))
	const pill =
		'flex h-14 w-full items-center gap-3 rounded-full border border-sand-200 bg-white px-5 shadow-sm hover:border-brand-400 text-left text-base font-bold text-ink dark:border-neutral-500 dark:bg-neutral-900 dark:text-white'

	return (
		<div className="lg:hidden">
			{price > 0 && (
				<p className="mt-8 text-base leading-6">
					{fromBefore}
					<span className="text-2xl font-extrabold tabular-nums text-brand-600">{money.format(Math.ceil(price))}</span>
					{fromAfter} {tHome('per_person')}
				</p>
			)}
			<div className="-mx-6 mt-6 bg-sand-100 px-6 py-8 dark:bg-neutral-900">
				<h2 className="headline text-2xl !leading-7">{t('select_title')}</h2>
				<div className="mt-6 grid gap-3">
					<button type="button" onClick={open} className={pill}>
						<CalendarDays className="h-5 w-5 shrink-0 text-brand-600" strokeWidth={1.8} />
						<span className="truncate">{dates || t('choose_date')}</span>
					</button>
					<button type="button" onClick={open} className={pill}>
						<Users className="h-5 w-5 shrink-0 text-brand-600" strokeWidth={1.8} />
						<span>{t('adults_count', { count: adults })}</span>
					</button>
					<button
						type="button"
						onClick={open}
						className="mt-1 h-14 w-full rounded-full bg-brand-500 text-lg font-bold text-white shadow-[0_6px_18px_-6px_rgba(242,97,42,0.7)] transition hover:bg-brand-600 active:scale-[0.98]"
					>
						{t('check_availability')}
					</button>
				</div>
			</div>
		</div>
	)
}
