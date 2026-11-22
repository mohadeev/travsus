'use client'
// Who travels: the adults / children counters and the rooms they need.
// Shared by the tour page booking form and the checkout page.
import { Minus, Plus } from 'lucide-react'
import predictAccommodation from '@/app/api/updateLineItems/predictAccommodation'

export type Hotel = 'Standard' | 'Luxury'

export const MAX_PEOPLE = 19

/** Rooms for these people in one hotel tier (couples share, the rest get singles). */
export function roomsFor(guests: { guestAdults: number; guestChildren: number }, tier: 'Standard' | 'Luxury') {
	const rooms: any = predictAccommodation(guests, null) // fills Standard
	if (tier === 'Standard') return rooms
	return { Standard: predictAccommodation({ guestAdults: 0, guestChildren: 0 }, null).Standard, Luxury: rooms.Standard }
}

/** Which hotel choice the current booking matches. */
export function currentHotel(booking: any): Hotel {
	const luxury = booking.accommodation?.Luxury ?? {}
	const hasLuxury = Object.values(luxury).some((room: any) => (room?.adult ?? 0) + (room?.child ?? 0) > 0)
	return hasLuxury ? 'Luxury' : 'Standard'
}

/** Small − / + counter, one row: label and age on the left. */
export function Counter({
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

