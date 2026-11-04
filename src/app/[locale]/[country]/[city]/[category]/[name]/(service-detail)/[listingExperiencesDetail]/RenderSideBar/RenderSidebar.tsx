'use client'
// Booking card, kept minimal: the price, one box for dates and people, the
// hotel choice (when the tour has nights and a luxury option), the total,
// how to pay, and one button.
import { type FC, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Route } from 'next'
import { useLocale, useTranslations } from 'next-intl'
import { useClerk } from '@clerk/nextjs'
import { ChevronDown, Crown, Hotel, Minus, Plus, ShieldCheck } from 'lucide-react'
import StayDatesRangeInput from '../StayDatesRangeInput'
import LineItemsBreakdown from '../LineItems/LineItemsBreakdown'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
	openTourBooking,
	recalculatePrice,
	selectBooking,
	selectBookingStatus,
	setBookOwnHotels,
	setSelectedDate,
	totalOf,
} from '@/store/slices/booking'
import { formatCurrency } from '@/utils/formatCurrency'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import predictAccommodation from '@/app/api/updateLineItems/predictAccommodation'
import { useTourService } from '../../TourServiceContext'
import { hasStays as tourHasStays } from '@/lib/tourPricing'
import { DEPOSIT_EUR, balanceAfterDeposit, depositAvailable, type PaymentPlan } from '@/lib/payLater'

type Hotel = 'Standard' | 'Luxury'

const MAX_PEOPLE = 19

/** Rooms for these people in one hotel tier (couples share, the rest get singles). */
function roomsFor(guests: { guestAdults: number; guestChildren: number }, tier: 'Standard' | 'Luxury') {
	const rooms: any = predictAccommodation(guests, null) // fills Standard
	if (tier === 'Standard') return rooms
	return { Standard: predictAccommodation({ guestAdults: 0, guestChildren: 0 }, null).Standard, Luxury: rooms.Standard }
}

/** Which hotel choice the current booking matches. */
function currentHotel(booking: any): Hotel {
	const luxury = booking.accommodation?.Luxury ?? {}
	const hasLuxury = Object.values(luxury).some((room: any) => (room?.adult ?? 0) + (room?.child ?? 0) > 0)
	return hasLuxury ? 'Luxury' : 'Standard'
}

const RenderSidebar: FC = () => {
	const t = useTranslations('Booking')
	const locale = useLocale()
	const tOld = useTranslations('Jan03_RenderSidebar_k7m9')
	const router = useRouter()
	const dispatch = useAppDispatch()
	const booking = useAppSelector(selectBooking)
	const status = useAppSelector(selectBookingStatus)
	const tour: any = useTourService()
	const { openSignIn } = useClerk()

	const adults = booking.guests?.guestAdults ?? 2
	const children = booking.guests?.guestChildren ?? 0
	const people = adults + children || 2
	const hotel = currentHotel(booking)
	const hasLuxury = (tour.accommodations ?? []).some((a: any) => a?.name === 'Luxury')
	// Day tours have no nights: no "where to sleep" step
	const hasStays = tourHasStays(tour.accommodations)

	const [reserving, setReserving] = useState(false)
	// Book now, pay later: €20 now, the rest on the first tour day
	const [plan, setPlan] = useState<PaymentPlan>('deposit')
	const [needsDate, setNeedsDate] = useState(false)
	const hasDate = !!booking.selectedDate?.startDate

	// Once per tour (depending on `booking` here caused an endless loop)
	useEffect(() => {
		dispatch(openTourBooking(tour))
	}, [tour?.id, dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

	/** Re-price for a new number of people and/or hotel choice. */
	const update = (next: { adults?: number; children?: number; hotel?: Hotel }) => {
		const guests = {
			guestAdults: next.adults ?? adults,
			guestChildren: next.children ?? children,
		}
		const choice = next.hotel ?? hotel
		dispatch(setBookOwnHotels(false))
		dispatch(
			recalculatePrice({
				tour,
				changes: hasStays ? { accommodation: roomsFor(guests, choice) } : { guests },
			}),
		)
	}

	const handleReserve = useAuthAction(async () => {
		if (!hasDate) {
			setNeedsDate(true)
			document.getElementById('booking-dates')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
			return
		}
		setReserving(true)
		try {
			// Only the choices are sent: the server sets the price
			const response = await fetch('/api/bookings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					tourId: tour.id,
					selectedDate: booking.selectedDate,
					guests: booking.guests,
					// Day tours: priced by people only
					accommodation: hasStays ? booking.accommodation : undefined,
					bookOwnHotels: false,
				}),
			})
			// The server doesn't see a signed-in user (e.g. the session expired): sign in, then come back here
			if (response.status === 401) {
				setReserving(false)
				openSignIn({ forceRedirectUrl: window.location.href })
				return
			}
			const result = await response.json()
			if (result.id) {
				router.push(`/checkout/checkout?bookingId=${result.id}&serviceId=${tour.id}&plan=${payPlan}` as Route)
				return
			}
			alert(result.error || tOld('no_booking_created'))
		} catch (error) {
			console.error('Reserve failed:', error)
		}
		setReserving(false)
	})

	const total = totalOf(booking.lineItems)
	// Before the booking is priced in the browser, show the server's "from" price
	const perPerson = booking.lineItems.length ? total / people : tour.fromPricePerPerson ?? 0
	const updating = status === 'loading'
	// The deposit needs a real balance; without a date yet it is still offered (the date is asked first)
	const tripTotal = total || perPerson * people
	const canDeposit = hasDate ? depositAvailable(tripTotal, booking.selectedDate) : tripTotal - DEPOSIT_EUR >= 20
	const payPlan: PaymentPlan = canDeposit ? plan : 'full'
	const deposit = formatCurrency(DEPOSIT_EUR)
	const wholeMoney = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

	return (
		<div className="listingSectionSidebar__wrap !space-y-5">
			{/* Price at a glance: a whole number, rounded up, like on the tour cards */}
			<div>
				<p>
					<span className="text-[28px] font-bold tracking-tight">{wholeMoney.format(Math.ceil(perPerson))}</span>{' '}
					<span className="text-neutral-500">{tOld('per_person')}</span>
				</p>
				{canDeposit && <p className="mt-0.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">{t('pay_later_teaser', { amount: deposit })}</p>}
			</div>

			{/* Dates and people in one box */}
			<div>
				<div
					className={`divide-y divide-neutral-200 rounded-2xl border transition dark:divide-neutral-800 ${
						needsDate && !hasDate ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-neutral-300 dark:border-neutral-700'
					}`}
				>
					<div id="booking-dates">
						<StayDatesRangeInput
							onChange={(date: any) => {
								dispatch(setSelectedDate(date))
								if (date?.startDate) setNeedsDate(false)
							}}
							value={booking.selectedDate}
							duration={tour.days?.length}
							isFlashing={needsDate && !hasDate}
						/>
					</div>
					<Counter
						label={t('adults')}
						hint={t('adults_hint')}
						value={adults}
						min={1}
						max={MAX_PEOPLE - children}
						onChange={(value) => update({ adults: value })}
						lessLabel={t('less')}
						moreLabel={t('more')}
					/>
					<Counter
						label={t('children')}
						hint={t('children_hint')}
						value={children}
						min={0}
						max={MAX_PEOPLE - adults}
						onChange={(value) => update({ children: value })}
						lessLabel={t('less')}
						moreLabel={t('more')}
					/>
				</div>
				{needsDate && !hasDate && (
					<p role="alert" className="mt-2 text-sm font-semibold text-brand-600">
						{t('pick_date')}
					</p>
				)}
			</div>

			{/* Where to sleep: two options side by side */}
			{hasStays && hasLuxury && (
				<div>
					<p className="mb-2 text-sm font-semibold">{t('step_hotel')}</p>
					<div role="radiogroup" aria-label={t('step_hotel')} className="grid grid-cols-2 gap-1 rounded-full bg-neutral-100 p-1 dark:bg-neutral-900">
						{([
							['Standard', Hotel, t('hotel_standard')],
							['Luxury', Crown, t('hotel_luxury')],
						] as const).map(([value, Icon, label]) => (
							<button
								key={value}
								type="button"
								role="radio"
								aria-checked={hotel === value}
								onClick={() => update({ hotel: value })}
								className={`flex items-center justify-center gap-1.5 rounded-full px-2 py-2 text-sm font-semibold transition ${
									hotel === value
										? 'bg-white text-neutral-950 shadow-sm dark:bg-neutral-800 dark:text-white'
										: 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
								}`}
							>
								<Icon className="h-4 w-4 shrink-0" aria-hidden />
								<span className="truncate">{label}</span>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Total */}
			<div className="flex items-baseline justify-between gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
				<p className="text-sm">
					<span className="font-semibold">{t('total')}</span>{' '}
					<span className="text-neutral-500">· {t('for_people', { count: people })}</span>
				</p>
				<p className="text-xl font-bold tracking-tight" aria-live="polite">
					{updating ? <span className="text-sm font-medium text-neutral-500">{t('updating')}</span> : formatCurrency(tripTotal)}
				</p>
			</div>

			{/* Pay €20 now (rest on the tour day) or everything now */}
			{canDeposit && (
				<div role="radiogroup" aria-label={t('pay_title')} className="!mt-3 space-y-2">
					{([
						['deposit', t('switch_deposit', { amount: deposit }), t('pay_deposit_hint', { rest: formatCurrency(balanceAfterDeposit(tripTotal)) })],
						['full', t('pay_full'), t('pay_full_hint', { amount: formatCurrency(tripTotal) })],
					] as const).map(([value, label, hint]) => (
						<button
							key={value}
							type="button"
							role="radio"
							aria-checked={payPlan === value}
							onClick={() => setPlan(value)}
							className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition ${
								payPlan === value ? 'border-neutral-950 bg-neutral-50 dark:border-white dark:bg-neutral-900' : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-800'
							}`}
						>
							<span
								className={`mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-2 ${
									payPlan === value ? 'border-neutral-950 dark:border-white' : 'border-neutral-300 dark:border-neutral-600'
								}`}
							>
								{payPlan === value && <span className="h-2 w-2 rounded-full bg-neutral-950 dark:bg-white" />}
							</span>
							<span className="min-w-0">
								<span className="block text-sm font-semibold">{label}</span>
								<span className="block text-xs text-neutral-500">{hint}</span>
							</span>
						</button>
					))}
				</div>
			)}

			<div className="!mt-4">
				<button
					type="button"
					onClick={() => handleReserve(undefined)}
					disabled={reserving}
					className="w-full rounded-full bg-brand-500 px-6 py-3.5 text-base font-bold text-white transition hover:bg-brand-600 disabled:opacity-60"
				>
					{reserving ? tOld('processing') : payPlan === 'deposit' ? t('reserve_deposit', { amount: deposit }) : t('reserve')}
				</button>
				<p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
					<ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
					{t('free_cancel')}
				</p>
				{booking.lineItems.length > 0 && (
					<details className="group mt-3 text-center">
						<summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-neutral-600 underline underline-offset-4 [&::-webkit-details-marker]:hidden">
							{t('price_details')}
							<ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
						</summary>
						<div className="mt-3 text-left">
							<LineItemsBreakdown lineItems={booking.lineItems} />
						</div>
					</details>
				)}
			</div>
		</div>
	)
}

/** Small − / + counter, one row: label and age on the left. */
function Counter({
	label,
	hint,
	value,
	min,
	max,
	onChange,
	lessLabel,
	moreLabel,
}: {
	label: string
	hint: string
	value: number
	min: number
	max: number
	onChange: (value: number) => void
	lessLabel: string
	moreLabel: string
}) {
	const button =
		'grid h-9 w-9 place-items-center rounded-full border border-neutral-300 text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-30 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white'
	return (
		<div className="flex items-center justify-between gap-3 px-4 py-3">
			<div className="min-w-0">
				<p className="text-[15px] font-semibold">{label}</p>
				<p className="text-xs text-neutral-500">{hint}</p>
			</div>
			<div className="flex items-center gap-2.5">
				<button type="button" className={button} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`${lessLabel}: ${label}`}>
					<Minus className="h-4 w-4" strokeWidth={2.25} />
				</button>
				<span className="w-5 text-center text-base font-semibold tabular-nums" aria-live="polite">
					{value}
				</span>
				<button type="button" className={button} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`${moreLabel}: ${label}`}>
					<Plus className="h-4 w-4" strokeWidth={2.25} />
				</button>
			</div>
		</div>
	)
}

export default RenderSidebar
