'use client'
// Booking card, made so anyone can book: three big, plain steps
// (dates, people, where to sleep), one clear total and one button.
import { type FC, type ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Route } from 'next'
import { useTranslations } from 'next-intl'
import { BedDouble, Check, ChevronDown, Crown, Hotel, Minus, Plus, ShieldCheck } from 'lucide-react'
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

type Hotel = 'Standard' | 'Luxury' | 'own'

const MAX_PEOPLE = 19

/** Rooms for these people in one hotel tier (couples share, the rest get singles). */
function roomsFor(guests: { guestAdults: number; guestChildren: number }, tier: 'Standard' | 'Luxury') {
	const rooms: any = predictAccommodation(guests, null) // fills Standard
	if (tier === 'Standard') return rooms
	return { Standard: predictAccommodation({ guestAdults: 0, guestChildren: 0 }, null).Standard, Luxury: rooms.Standard }
}

/** Which hotel choice the current booking matches. */
function currentHotel(booking: any): Hotel {
	if (booking.bookOwnHotels) return 'own'
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

	const adults = booking.guests?.guestAdults ?? 2
	const children = booking.guests?.guestChildren ?? 0
	const people = adults + children || 2
	const hotel = currentHotel(booking)
	const hasLuxury = (tour.accommodations ?? []).some((a: any) => a?.name === 'Luxury')
	// Day tours have no nights: no "where to sleep" step
	const hasStays = (tour.accommodations ?? []).some((a: any) => a?.bedOptions?.length)

	const [reserving, setReserving] = useState(false)
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
		dispatch(setBookOwnHotels(choice === 'own'))
		dispatch(
			recalculatePrice({
				tour,
				changes: choice === 'own' ? { guests } : { accommodation: roomsFor(guests, choice) },
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
					// Own hotel: priced by people only
					accommodation: hotel === 'own' ? undefined : booking.accommodation,
					bookOwnHotels: hotel === 'own',
				}),
			})
			const result = await response.json()
			if (result.id) {
				router.push(`/checkout/checkout?bookingId=${result.id}&serviceId=${tour.id}` as Route)
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

	return (
		<div className="listingSectionSidebar__wrap">
			{/* Price at a glance */}
			<p className="text-lg">
				<span className="text-3xl font-bold tracking-tight">{formatCurrency(perPerson)}</span>{' '}
				<span className="text-neutral-500">{tOld('per_person')}</span>
			</p>

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
					<div className="space-y-2" role="radiogroup" aria-label={t('step_hotel')}>
						<Choice
							selected={hotel === 'Standard'}
							onSelect={() => update({ hotel: 'Standard' })}
							icon={<Hotel className="h-6 w-6" />}
							title={t('hotel_standard')}
							hint={t('hotel_standard_hint')}
						/>
						{hasLuxury && (
							<Choice
								selected={hotel === 'Luxury'}
								onSelect={() => update({ hotel: 'Luxury' })}
								icon={<Crown className="h-6 w-6" />}
								title={t('hotel_luxury')}
								hint={t('hotel_luxury_hint')}
							/>
						)}
						<Choice
							selected={hotel === 'own'}
							onSelect={() => update({ hotel: 'own' })}
							icon={<BedDouble className="h-6 w-6" />}
							title={t('hotel_own')}
							hint={t('hotel_own_hint')}
						/>
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
				{reserving ? tOld('processing') : t('reserve')}
			</button>

			<ul className="!mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
				<li className="flex items-center gap-2">
					<Check className="h-4 w-4 shrink-0 text-[#00AA6C]" strokeWidth={3} />
					{t('no_charge')}
				</li>
				<li className="flex items-center gap-2">
					<ShieldCheck className="h-4 w-4 shrink-0 text-[#00AA6C]" />
					{t('free_cancel')}
				</li>
			</ul>
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
}: {
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
			className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
				selected
					? 'border-brand-500 bg-brand-50 dark:bg-neutral-900'
					: 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-800'
			}`}
		>
			<span className={selected ? 'text-brand-600' : 'text-neutral-500'}>{icon}</span>
			<span className="min-w-0 flex-1">
				<span className="block text-base font-semibold">{title}</span>
				<span className="block text-sm text-neutral-500">{hint}</span>
			</span>
			<span
				className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
					selected ? 'border-brand-500 bg-brand-500 text-white' : 'border-neutral-300'
				}`}
			>
				{selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
			</span>
		</button>
	)
}

export default RenderSidebar
