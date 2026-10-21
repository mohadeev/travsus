'use client'
import { useTranslations as useIntlTranslations } from 'next-intl'
import { formatTripDates, readTripDates } from '@/lib/tripDates'
import ModalReserveMobile from './ModalReserveMobile'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectBooking, totalOf } from '@/store/slices/booking'
import { formatCurrency } from '@/utils/formatCurrency'
import { useTranslations } from '@/lib/i18n'
import { useLocale } from 'next-intl'
import { setMobileReserveOpen } from '@/store/slices/ui'
import { useTourService } from '../TourServiceContext'
import { ArrowRight, CalendarDays, Check, ChevronRight } from 'lucide-react'

const MobileFooterSticky = () => {
	const t = useTranslations('Jan03_MobileFooterSticky_m4k7')

	const tBooking = useIntlTranslations('Booking')
	const tInfo = useIntlTranslations('BookingInfo')
	const { guests, lineItems, selectedDate } = useAppSelector(selectBooking)
	const totalGuests: number = guests?.guestAdults + guests?.guestChildren
	const tourData: any = useTourService()
	// Server "from" price until the booking is priced in the browser
	const totalAmount = totalOf(lineItems) || (tourData?.fromPricePerPerson ?? 0) * 2
	const priceStart = totalOf(lineItems)
		? totalOf(lineItems) / totalGuests
		: tourData?.fromPricePerPerson ?? 0
	const locale = useLocale()
	// The dates the customer picked (nothing until they choose)
	const dates = formatTripDates(...readTripDates(selectedDate), locale)
	const dispatch = useAppDispatch()
	const haneleOpen = (openModal: any) => {
		openModal()
		dispatch(setMobileReserveOpen(true))
	}
	return totalAmount ? (
		<div
			id="mobile-book-bar"
			className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_-15px_rgb(0_0_0/0.3)] backdrop-blur lg:hidden dark:border-neutral-800 dark:bg-neutral-900/95"
		>
			{/* Keep the page's last lines above the bar */}
			<style>{'@media (max-width:1023px){body:has(#mobile-book-bar){padding-bottom:calc(7.5rem + env(safe-area-inset-bottom))}}'}</style>
			<ModalReserveMobile
				renderChildren={({ openModal }) => (
					<div className="px-4">
						<div className="flex items-center gap-3">
							{/* Price and dates: one big tap area */}
							<button type="button" onClick={() => haneleOpen(openModal)} className="min-h-14 min-w-0 flex-1 text-left">
								<span className="block truncate">
									<span className="text-[22px] font-bold leading-none tracking-tight">{formatCurrency(priceStart)}</span>
									<span className="ml-1 text-sm text-neutral-500 dark:text-neutral-400">{t('Per_Person')}</span>
								</span>
								<span className="mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded-full bg-neutral-100 py-1 pl-2.5 pr-2 text-[13px] font-semibold dark:bg-neutral-800">
									<CalendarDays className="h-4 w-4 shrink-0 text-brand-600" />
									<span className="truncate">{dates || tBooking('choose_dates')}</span>
									<ChevronRight className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
								</span>
							</button>
							<button
								type="button"
								onClick={() => haneleOpen(openModal)}
								className="inline-flex h-14 min-w-[44%] shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-6 text-[17px] font-bold text-white shadow-lg shadow-brand-500/30 transition active:scale-[0.97] hover:bg-brand-600"
							>
								{t('Reserve')}
								<ArrowRight className="h-5 w-5" />
							</button>
						</div>
						<p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
							<Check className="h-3.5 w-3.5" strokeWidth={3} />
							{tInfo('free_cancel_title')}
						</p>
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
				<div className="h-14 w-[44%] animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-700"></div>
			</div>
		</div>
	)
}
