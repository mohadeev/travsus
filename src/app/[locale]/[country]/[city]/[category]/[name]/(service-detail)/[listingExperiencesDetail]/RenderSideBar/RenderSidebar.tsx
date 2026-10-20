'use client'
// Booking card, made so anyone can book: three big, plain steps
// (dates, people, where to sleep), one clear total and one button.
import { type FC, type ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Route } from 'next'
import { useTranslations } from 'next-intl'
import { useClerk } from '@clerk/nextjs'
import { CalendarClock, Check, ChevronDown, Crown, Hotel, Minus, Plus, ShieldCheck } from 'lucide-react'
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

	return (
		<div className="listingSectionSidebar__wrap">
			{/* Price at a glance */}
			<p className="text-lg">
				<span className="text-3xl font-bold tracking-tight">{formatCurrency(perPerson)}</span>{' '}
				<span className="text-neutral-500">{tOld('per_person')}</span>
			</p>
			{canDeposit && (
				<p className="!mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#00AA6C]">
					<CalendarClock className="h-4 w-4 shrink-0" />
					{t('pay_later_teaser', { amount: deposit })}
				</p>
			)}

			{/* 1. Dates */}
			<Step number={1} title={t('step_when')}>
				<div
					id="booking-dates"
					className={`rounded-2xl border-2 transition [&_button]:rounded-2xl ${
						needsDate && !hasDate ? 'border-brand-500 ring-4 ring-brand-100' : 'border-neutral-200 dark:border-neutral-800'
					}`}
				>
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
				{needsDate && !hasDate && (
					<p role="alert" className="mt-2 text-base font-semibold text-brand-600">
						{t('pick_date')}
					</p>
				)}
			</Step>

			{/* 2. People */}
			<Step number={2} title={t('step_who')}>
				<div className="divide-y divide-neutral-200 rounded-2xl border-2 border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
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
			</Step>

			{/* 3. Where to sleep */}
			{hasStays && (
				<Step number={3} title={t('step_hotel')}>
					<div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t('step_hotel')}>
						<Choice
							compact
							selected={hotel === 'Standard'}
							onSelect={() => update({ hotel: 'Standard' })}
							icon={<Hotel className="h-6 w-6" />}
							title={t('hotel_standard')}
							hint={t('hotel_standard_hint')}
						/>
						{hasLuxury && (
							<Choice
								compact
								selected={hotel === 'Luxury'}
								onSelect={() => update({ hotel: 'Luxury' })}
								icon={<Crown className="h-6 w-6" />}
								title={t('hotel_luxury')}
								hint={t('hotel_luxury_hint')}
							/>
						)}
					</div>
				</Step>
			)}

			{/* Total + Reserve */}
			<div className="rounded-2xl bg-sand-100 p-5 dark:bg-neutral-900">
				<div className="flex items-end justify-between gap-3">
					<div>
						<p className="text-base font-semibold">{t('total')}</p>
						<p className="text-sm text-neutral-500">{t('for_people', { count: people })}</p>
					</div>
					<p className="text-3xl font-bold tracking-tight" aria-live="polite">
						{updating ? <span className="text-base font-medium text-neutral-500">{t('updating')}</span> : formatCurrency(total || perPerson * people)}
					</p>
				</div>
				{/* Pay €20 now (rest on the tour day) or everything now */}
				{canDeposit && (
					<>
						<div role="radiogroup" aria-label={t('pay_title')} className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-white p-1 ring-1 ring-neutral-200 dark:bg-neutral-950 dark:ring-neutral-800">
							{(['deposit', 'full'] as const).map((option) => (
								<button
									key={option}
									type="button"
									role="radio"
									aria-checked={payPlan === option}
									onClick={() => setPlan(option)}
									className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
										payPlan === option ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400'
									}`}
								>
									{option === 'deposit' ? t('switch_deposit', { amount: deposit }) : t('switch_full')}
								</button>
							))}
						</div>
						{payPlan === 'deposit' && (
							<div className="mt-3 grid grid-cols-2 gap-2 text-sm">
								<p className="rounded-xl bg-white px-3 py-2 dark:bg-neutral-950">
									<span className="block text-neutral-500">{t('today')}</span>
									<span className="font-bold">{deposit}</span>
								</p>
								<p className="rounded-xl bg-white px-3 py-2 dark:bg-neutral-950">
									<span className="block text-neutral-500">{t('on_tour_day')}</span>
									<span className="font-bold">{formatCurrency(balanceAfterDeposit(tripTotal))}</span>
								</p>
							</div>
						)}
					</>
				)}
				{booking.lineItems.length > 0 && (
					<details className="group mt-3">
						<summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-neutral-600 underline underline-offset-4 [&::-webkit-details-marker]:hidden">
							{t('price_details')}
							<ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
						</summary>
						<div className="mt-3">
							<LineItemsBreakdown lineItems={booking.lineItems} />
						</div>
					</details>
				)}
			</div>

			<button
				type="button"
				onClick={() => handleReserve(undefined)}
				disabled={reserving}
				className="w-full rounded-full bg-brand-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 disabled:opacity-60"
			>
				{reserving ? tOld('processing') : payPlan === 'deposit' ? t('reserve_deposit', { amount: deposit }) : t('reserve')}
			</button>

			<p className="!mt-3 flex items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
				<ShieldCheck className="h-4 w-4 shrink-0 text-[#00AA6C]" />
				{t('free_cancel')}
			</p>
		</div>
	)
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
	return (
		<section>
			<h3 className="mb-3 flex items-center gap-3 text-lg font-bold">
				<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-500 text-base text-white">{number}</span>
				{title}
			</h3>
			{children}
		</section>
	)
}

/** Big, finger-friendly − / + counter. */
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
		'grid h-12 w-12 place-items-center rounded-full border-2 border-neutral-300 transition hover:border-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-30 dark:border-neutral-700'
	return (
		<div className="flex items-center justify-between gap-3 p-4">
			<div>
				<p className="text-base font-semibold">{label}</p>
				<p className="text-sm text-neutral-500">{hint}</p>
			</div>
			<div className="flex items-center gap-3">
				<button type="button" className={button} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`${lessLabel}: ${label}`}>
					<Minus className="h-5 w-5" strokeWidth={2.5} />
				</button>
				<span className="w-7 text-center text-2xl font-bold tabular-nums" aria-live="polite">
					{value}
				</span>
				<button type="button" className={button} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`${moreLabel}: ${label}`}>
					<Plus className="h-5 w-5" strokeWidth={2.5} />
				</button>
			</div>
		</div>
	)
}

/** Big tappable choice card with a clear selected state. */
function Choice({
	selected,
	onSelect,
	icon,
	title,
	hint,
	compact = false,
}: {
	compact?: boolean
	selected: boolean
	onSelect: () => void
	icon: ReactNode
	title: string
	hint: string
}) {
	return (
		<button
			type="button"
			role="radio"
			aria-checked={selected}
			onClick={onSelect}
			className={`flex w-full rounded-2xl border-2 text-left transition ${compact ? 'flex-col items-start gap-1.5 p-3' : 'items-center gap-4 p-4'} ${
				selected
					? 'border-brand-500 bg-brand-50 dark:bg-neutral-900'
					: 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-800'
			}`}
		>
			<span className={selected ? 'text-brand-600' : 'text-neutral-500'}>{icon}</span>
			<span className="min-w-0 flex-1">
				<span className={`block font-semibold ${compact ? 'text-sm leading-snug' : 'text-base'}`}>{title}</span>
				{!compact && <span className="block text-sm text-neutral-500">{hint}</span>}
			</span>
			<span
				className={`${compact ? 'hidden' : 'grid'} h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
					selected ? 'border-brand-500 bg-brand-500 text-white' : 'border-neutral-300'
				}`}
			>
				{selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
			</span>
		</button>
	)
}

export default RenderSidebar
