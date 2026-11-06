'use client'
// Booking form, laid out as TripAdvisor's: the tour name (in the phone sheet),
// the date and the travelers as two pills side by side (the pill opens the
// counters), a green band (pay later, free cancellation), one card per option
// (hotels included / luxury, or the private tour) with a round radio and the
// total inside the chosen card, how to pay, and a green "Reserve" button.
import { type FC, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Route } from 'next'
import { useLocale, useTranslations } from 'next-intl'
import { useClerk } from '@clerk/nextjs'
import { Check, ChevronDown, Minus, Plus, Users, Zap } from 'lucide-react'
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
	const tHome = useTranslations('Home')
	// "from {price}" around the big price, in any word order (as on TripAdvisor: "from €276 per person")
	const [fromBefore, fromAfter = ''] = tHome.raw('from_price').split('{price}')
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
	const [whoOpen, setWhoOpen] = useState(false)
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

	const tInfo = useTranslations('BookingInfo')
	const inclusions = (tier: 'standard' | 'luxury'): string[] => tour.inclusions?.[tier]?.private ?? []
	// One card per option: the two hotel levels, or just the private tour
	const options: { value: Hotel; title: string; hint: string; items: string[] }[] =
		hasStays && hasLuxury
			? [
					{ value: 'Standard', title: t('hotel_standard'), hint: t('hotel_standard_hint'), items: inclusions('standard') },
					{ value: 'Luxury', title: t('hotel_luxury'), hint: t('hotel_luxury_hint'), items: inclusions('luxury') },
				]
			: [{ value: hotel, title: tInfo('private_title'), hint: tInfo('private_text'), items: inclusions('standard') }]

	return (
		<div className="listingSectionSidebar__wrap !space-y-5 max-lg:!rounded-none max-lg:!border-0 max-lg:!px-6 max-lg:!pb-0 max-lg:!shadow-none">
			{/* Phone sheet: the tour name on top. Desktop card: the "from" price */}
			<h2 className="headline text-2xl !leading-7 lg:hidden">{tour.name}</h2>
			<div className="hidden lg:block">
				<p>
					<span className="text-neutral-700 dark:text-neutral-300">{fromBefore}</span>
					<span className="text-[28px] font-bold tracking-tight">{wholeMoney.format(Math.ceil(perPerson))}</span>
					<span className="text-neutral-700 dark:text-neutral-300">{fromAfter} {tHome('per_person')}</span>
				</p>
			</div>

			{/* Date and travelers: two pills side by side */}
			<div>
				<div className="flex gap-3">
					<div id="booking-dates" className="min-w-0 flex-1">
						<StayDatesRangeInput
							pill
							onChange={(date: any) => {
								dispatch(setSelectedDate(date))
								if (date?.startDate) setNeedsDate(false)
							}}
							value={booking.selectedDate}
							duration={tour.days?.length}
							isFlashing={needsDate && !hasDate}
						/>
					</div>
					<button
						type="button"
						onClick={() => setWhoOpen(!whoOpen)}
						aria-expanded={whoOpen}
						aria-label={t('step_who')}
						className={`flex h-14 shrink-0 items-center gap-2 rounded-full border bg-white px-5 text-base font-bold tabular-nums text-ink transition dark:bg-neutral-900 dark:text-white ${
							whoOpen ? 'border-brand-500 ring-1 ring-brand-500' : 'border-neutral-300 hover:border-brand-400 dark:border-neutral-600'
						}`}
					>
						<Users className="h-5 w-5 text-brand-600" strokeWidth={1.8} />
						{people}
					</button>
				</div>
				{needsDate && !hasDate && (
					<p role="alert" className="mt-2 text-sm font-semibold text-red-600">
						{t('pick_date')}
					</p>
				)}
				{whoOpen && (
					<div className="mt-3 divide-y divide-neutral-200 rounded-2xl border border-neutral-300 dark:divide-neutral-800 dark:border-neutral-700">
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
				)}
			</div>

			{/* Green band (full width in the phone sheet): book now, pay later */}
			{canDeposit && (
				<p className="-mx-6 bg-brand-50 px-6 py-4 text-base leading-6 text-brand-900 lg:mx-0 lg:rounded-xl lg:px-4 lg:py-3 lg:text-sm">
					<Zap className="-mt-0.5 mr-1.5 inline h-5 w-5 fill-brand-500 text-brand-500" strokeWidth={1.8} aria-hidden />
					<b>{t('pay_deposit', { amount: deposit })}</b> • {t('pay_deposit_hint', { rest: formatCurrency(balanceAfterDeposit(tripTotal)) })}
				</p>
			)}

			{/* One card per option, the chosen one with the total */}
			<div role="radiogroup" aria-label={t('step_hotel')} className="space-y-4">
				{options.map((option) => {
					const chosen = options.length === 1 || hotel === option.value
					return (
						<div
							key={option.value}
							role="radio"
							aria-checked={chosen}
							tabIndex={0}
							onClick={() => !chosen && update({ hotel: option.value })}
							onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !chosen && update({ hotel: option.value })}
							className={`cursor-pointer rounded-2xl border bg-white p-5 transition dark:bg-neutral-900 ${
								chosen ? 'border-2 border-brand-500 bg-brand-50/40 p-[19px] shadow-[0_8px_24px_-12px_rgba(242,97,42,0.45)] dark:bg-neutral-900' : 'border-neutral-300 hover:border-ink/60 dark:border-neutral-700'
							}`}
						>
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<h3 className="text-xl font-bold leading-6">{option.title}</h3>
									<p className="mt-1 text-sm leading-5 text-ink-soft dark:text-neutral-400">{option.hint}</p>
								</div>
								<span
									aria-hidden
									className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${chosen ? 'border-brand-500' : 'border-neutral-300'}`}
								>
									{chosen && <span className="h-3.5 w-3.5 rounded-full bg-brand-500" />}
								</span>
							</div>

							{option.items.length > 0 && <Inclusions items={option.items} more={tInfo('read_more')} />}

							<p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
								<Check className="h-4 w-4 rounded-full bg-emerald-600 p-0.5 text-white" strokeWidth={3.5} aria-hidden />
								{t('free_cancel')}
							</p>

							{chosen && (
								<div className="mt-4" aria-live="polite">
									<p className="text-xl font-bold leading-7 tabular-nums">
										{t('total')}{' '}
										{updating ? <span className="text-sm font-medium text-neutral-500">{t('updating')}</span> : <span className="text-brand-600">{formatCurrency(tripTotal)}</span>}
									</p>
									<p className="text-base leading-6 text-ink-soft tabular-nums dark:text-neutral-400">
										{t('for_people', { count: people })} · {t('per_person', { price: formatCurrency(tripTotal / people) })}
									</p>
								</div>
							)}
						</div>
					)
				})}
			</div>

			{/* Pay €20 now (rest on the tour day) or everything now */}
			{canDeposit && (
				<div role="radiogroup" aria-label={t('pay_title')} className="space-y-2">
					<p className="text-base font-bold">{t('pay_title')}</p>
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
							className="flex w-full items-start gap-3 py-1.5 text-left"
						>
							<span
								className={`mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2 ${
									payPlan === value ? 'border-brand-500' : 'border-neutral-300'
								}`}
							>
								{payPlan === value && <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />}
							</span>
							<span className="min-w-0">
								<span className="block text-base font-semibold leading-6">{label}</span>
								<span className="block text-sm text-ink-soft dark:text-neutral-400">{hint}</span>
							</span>
						</button>
					))}
				</div>
			)}

			{/* Reserve: stays at the bottom of the phone sheet */}
			<div className="sticky bottom-0 -mx-6 border-t border-neutral-200 bg-white px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 lg:static lg:mx-0 lg:border-0 lg:p-0 dark:border-neutral-800 dark:bg-neutral-900">
				<button
					type="button"
					onClick={() => handleReserve(undefined)}
					disabled={reserving}
					className="h-14 w-full rounded-full bg-brand-500 px-6 text-lg font-bold text-white shadow-[0_6px_18px_-6px_rgba(242,97,42,0.7)] transition hover:bg-brand-600 active:scale-[0.98] disabled:opacity-60"
				>
					{reserving ? tOld('processing') : payPlan === 'deposit' ? t('reserve_deposit', { amount: deposit }) : t('reserve')}
				</button>
			</div>

			{booking.lineItems.length > 0 && (
				<details className="group text-center">
					<summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-ink-soft underline underline-offset-4 [&::-webkit-details-marker]:hidden">
						{t('price_details')}
						<ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
					</summary>
					<div className="mt-3 text-left">
						<LineItemsBreakdown lineItems={booking.lineItems} />
					</div>
				</details>
			)}
		</div>
	)
}

/** What an option includes: a short bulleted list that fades into "...Read more". */
function Inclusions({ items, more }: { items: string[]; more: string }) {
	const [open, setOpen] = useState(false)
	const shown = open ? items : items.slice(0, 3)
	return (
		<div className="relative mt-3">
			<ul className={`list-disc space-y-0.5 pl-5 text-base leading-6 text-ink dark:text-neutral-200`}>
				{shown.map((item, i) => (
					<li key={i}>{item}</li>
				))}
			</ul>
			{!open && items.length > 3 && (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation()
						setOpen(true)
					}}
					className="mt-1 text-base font-medium text-ink underline underline-offset-2 dark:text-white"
				>
					...{more}
				</button>
			)}
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
		'grid h-9 w-9 place-items-center rounded-full border border-neutral-300 text-neutral-700 transition hover:border-neutral-950 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white'
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
