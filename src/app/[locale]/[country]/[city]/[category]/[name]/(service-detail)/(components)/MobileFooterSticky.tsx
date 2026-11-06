'use client'
import { useTranslations as useIntlTranslations } from 'next-intl'
import ModalReserveMobile from './ModalReserveMobile'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectBooking, totalOf } from '@/store/slices/booking'
import { useLocale } from 'next-intl'
import { setMobileReserveOpen } from '@/store/slices/ui'
import { useTourService } from '../TourServiceContext'
import { useEffect } from 'react'
import { OPEN_RESERVE_EVENT } from '../[listingExperiencesDetail]/MobileBookingBox'

/** Opens the booking sheet when the page's "Check availability" box asks for it. */
function OpenOnRequest({ open }: { open: () => void }) {
	useEffect(() => {
		window.addEventListener(OPEN_RESERVE_EVENT, open)
		return () => window.removeEventListener(OPEN_RESERVE_EVENT, open)
	}, [open])
	return null
}

const MobileFooterSticky = () => {
	const tHome = useIntlTranslations('Home')
	// "from €276 per person": whole euros, rounded up, as on the cards and the booking box
	const [fromBefore, fromAfter = ''] = tHome.raw('from_price').split('{price}')

	const tPage = useIntlTranslations('TourPage')
	const { guests, lineItems } = useAppSelector(selectBooking)
	const totalGuests: number = guests?.guestAdults + guests?.guestChildren
	const tourData: any = useTourService()
	// Server "from" price until the booking is priced in the browser
	const totalAmount = totalOf(lineItems) || (tourData?.fromPricePerPerson ?? 0) * 2
	const priceStart = totalOf(lineItems)
		? totalOf(lineItems) / totalGuests
		: tourData?.fromPricePerPerson ?? 0
	const locale = useLocale()
	const wholeMoney = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
	const dispatch = useAppDispatch()
	const haneleOpen = (openModal: any) => {
		openModal()
		dispatch(setMobileReserveOpen(true))
	}
	return totalAmount ? (
		<div
			id="mobile-book-bar"
			className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-6px_20px_-12px_rgb(0_0_0/0.25)] backdrop-blur lg:hidden dark:border-neutral-800 dark:bg-neutral-900/95"
		>
			{/* Keep the page's last lines above the bar */}
			<style>{'@media (max-width:1023px){body:has(#mobile-book-bar){padding-bottom:calc(5.5rem + env(safe-area-inset-bottom))}}'}</style>
			<ModalReserveMobile
				renderChildren={({ openModal }) => (
					<div className="px-4">
						<OpenOnRequest open={() => haneleOpen(openModal)} />
						{/* Simple: the price on the left, one button on the right */}
						<div className="flex items-center justify-between gap-4">
							<button type="button" onClick={() => haneleOpen(openModal)} className="min-w-0 text-left leading-tight">
								<span className="block text-xs text-ink-soft dark:text-neutral-400">{fromBefore.trim() || ' '}</span>
								<span className="block text-xl font-extrabold tabular-nums text-ink dark:text-white">
									{wholeMoney.format(Math.ceil(priceStart))}
									{fromAfter.trim() && <span className="ml-1 text-xs font-normal">{fromAfter.trim()}</span>}
								</span>
								<span className="block text-xs text-ink-soft dark:text-neutral-400">{tHome('per_person')}</span>
							</button>
							<button
								type="button"
								onClick={() => haneleOpen(openModal)}
								className="h-12 shrink-0 rounded-full bg-brand-500 px-7 text-base font-bold text-white shadow-[0_6px_18px_-6px_rgba(242,97,42,0.7)] transition hover:bg-brand-600 active:scale-[0.97]"
							>
								{tPage('check_availability')}
							</button>
						</div>
					</div>
				)}
			/>
		</div>
	) : (
		<MobileFooterStickySkeleton />
	)
}

export default MobileFooterSticky

function MobileFooterStickySkeleton() {
	return (
		<div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden dark:border-neutral-800 dark:bg-neutral-900">
			<div className="flex items-center justify-between gap-3">
				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						<div className="h-7 w-24 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
						<div className="h-4 w-20 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
					</div>
					<div className="h-4 w-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
				</div>
				<div className="h-12 w-40 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
			</div>
		</div>
	)
}
