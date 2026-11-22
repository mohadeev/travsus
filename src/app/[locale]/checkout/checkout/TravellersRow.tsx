'use client'
// Checkout: who travels. Shows "2 adults, 1 child" with Edit; Edit opens
// the same − / + counters as the tour page. Each change is saved (after a
// short pause, so several clicks make one request) and the server re-prices.
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { hasStays } from '@/lib/tourPricing'
import {
	Counter,
	MAX_PEOPLE,
	currentHotel,
	roomsFor,
} from '../../[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/RenderSideBar/travellers'

export default function TravellersRow({
	booking,
	label,
	describe,
	editLabel,
	onSave,
}: {
	booking: any
	label: string
	/** "2 adults, 1 child" in the page's language */
	describe: (adults: number, children: number) => string
	editLabel: string
	onSave: (changes: Record<string, any>) => unknown
}) {
	const t = useTranslations('Booking')
	const [open, setOpen] = useState(false)
	const savedAdults = booking.guests?.guestAdults ?? 1
	const savedChildren = booking.guests?.guestChildren ?? 0
	const [adults, setAdults] = useState(savedAdults)
	const [children, setChildren] = useState(savedChildren)
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

	// Follow the saved booking (first load, or the server's answer)
	useEffect(() => {
		setAdults(savedAdults)
		setChildren(savedChildren)
	}, [savedAdults, savedChildren])

	useEffect(() => () => clearTimeout(timer.current), [])

	const change = (nextAdults: number, nextChildren: number) => {
		setAdults(nextAdults)
		setChildren(nextChildren)
		clearTimeout(timer.current)
		timer.current = setTimeout(() => {
			const guests = { guestAdults: nextAdults, guestChildren: nextChildren }
			// Tours with hotels: the rooms follow the people (same hotel choice)
			const withRooms = hasStays(booking.tour?.accommodations) && !booking.bookOwnHotels
			onSave(withRooms ? { accommodation: roomsFor(guests, currentHotel(booking)) } : { guests })
		}, 500)
	}

	const summary = describe(adults, children)

	return (
		<div>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
			>
				<span className="min-w-0">
					<span className="block text-sm text-neutral-500">{label}</span>
					<span className="mt-0.5 block truncate font-semibold">{summary}</span>
				</span>
				<span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold underline underline-offset-4">
					<PencilSquareIcon className="h-4 w-4" />
					{editLabel}
				</span>
			</button>
			{open && (
				<div className="divide-y divide-neutral-200 border-t border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
					<Counter
						label={t('adults')}
						hint={t('adults_hint')}
						value={adults}
						min={1}
						max={MAX_PEOPLE - children}
						onChange={(value) => change(value, children)}
						lessLabel={t('less')}
						moreLabel={t('more')}
					/>
					<Counter
						label={t('children')}
						hint={t('children_hint')}
						value={children}
						min={0}
						max={MAX_PEOPLE - adults}
						onChange={(value) => change(adults, value)}
						lessLabel={t('less')}
						moreLabel={t('more')}
					/>
				</div>
			)}
		</div>
	)
}
