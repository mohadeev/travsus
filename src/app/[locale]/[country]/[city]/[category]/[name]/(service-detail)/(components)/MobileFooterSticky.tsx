'use client'
import { useState } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import converSelectedDateToString from '@/utils/converSelectedDateToString'
import ModalReserveMobile from './ModalReserveMobile'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectBooking, totalOf } from '@/store/slices/booking'
import { formatCurrency } from '@/utils/formatCurrency'
import { useTranslations } from '@/lib/i18n'
import { useLocale } from 'next-intl'
import locales from '@/lib/dateFnsLocales'
import { registerLocale } from 'react-datepicker'
import moment from 'moment'
import { setMobileReserveOpen } from '@/store/slices/ui'
import { useTourService } from '../TourServiceContext'

const MobileFooterSticky = () => {
	const t = useTranslations('Jan03_MobileFooterSticky_m4k7')

	const { guests, lineItems } = useAppSelector(selectBooking)
	const totalGuests: number = guests?.guestAdults + guests?.guestChildren
	const {
		name: title,
		price,
		days,
	}: any = useTourService()
	const tourData: any = useTourService()
	// Server "from" price until the booking is priced in the browser
	const totalAmount = totalOf(lineItems) || (tourData?.fromPricePerPerson ?? 0) * 2
	const priceStart = totalOf(lineItems)
		? totalOf(lineItems) / totalGuests
		: tourData?.fromPricePerPerson ?? 0
	const locale = useLocale()
	// console.log('locale:')
	moment.locale(locale) // ar-ma
	registerLocale(locale, locales[locale])

	const daysLength = days?.length || 3 // make sure `days` is defined

	const [startDate, setStartDate] = useState<Date | null>(
		moment().add(10, 'days').toDate(),
	)

	const [endDate, setEndDate] = useState<Date | null>(
		moment()
			.add(10 + daysLength, 'days')
			.toDate(),
	)
	//
	const dispatch = useAppDispatch()
	const haneleOpen = (openModal: any) => {
		openModal()
		dispatch(setMobileReserveOpen(true))
	}
	return (
		<>
			{totalAmount ? (
				<div className="dark:border-neutral-6000 fixed inset-x-0 bottom-0 z-10 block border-t border-neutral-200 bg-white py-2 dark:bg-neutral-800 sm:py-3 lg:hidden">
					<ModalReserveMobile
						renderChildren={({ openModal }) => (
							<div className="container flex items-center justify-between">
								<div className="">
									<span className="block text-xl font-semibold">
										{formatCurrency(priceStart)}
										<span className="ml-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
											{t('Per_Person')}
										</span>
									</span>
									<span
										onClick={() => haneleOpen(openModal)}
										className="block text-sm font-medium underline"
									>
										{converSelectedDateToString([startDate, endDate], locale)}
									</span>
								</div>
								<ButtonPrimary
									sizeClass="px-5 sm:px-7 py-3 !rounded-2xl"
									onClick={() => haneleOpen(openModal)}
								>
									{t('Reserve')}
								</ButtonPrimary>
							</div>
						)}
					/>
				</div>
			) : (
				<MobileFooterStickySkeleton />
			)}
		</>
	)
}

export default MobileFooterSticky

function MobileFooterStickySkeleton() {
	return (
		<div className="dark:border-neutral-6000 fixed inset-x-0 bottom-0 z-40 block border-t border-neutral-200 bg-white py-2 dark:bg-neutral-800 sm:py-3 lg:hidden">
			<div className="container flex items-center justify-between">
				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						<div className="h-7 w-24 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
						<div className="h-4 w-20 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
					</div>
					<div className="h-4 w-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
				</div>
				<div className="h-12 w-24 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-700"></div>
			</div>
		</div>
	)
}
