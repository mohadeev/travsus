'use client'
import Checkbox from '@/components/ui/checkbox'
import { removeLineItem } from '@/app/[locale]/GlobalRedux/Features/bookingSlice/bookingSlice'
import { useDispatch } from 'react-redux'
import { useTranslations } from '@/lib/i18n'

export default function AcommodationAndTransport({
	RowBedAccommodationSelector,
	GuestsInput,
	bookOwnHotels,
	handleBookOwnHotels,
}: any) {
	const t = useTranslations('Jan03_AccommodationTransport_p2k7')
	const dispatch = useDispatch()

	const handleCheckboxChange = (checked: boolean) => {
		console.log(checked)
		handleBookOwnHotels(checked)
		dispatch(removeLineItem({ description: 'accommodation', value: !checked }))
	}

	return (
		<div className="mx-auto w-full max-w-2xl p-0">
			<div className="mb-0 flex items-center space-x-2 p-4">
				<Checkbox
					checked={bookOwnHotels}
					label={t('Hotel_Already_Booked')}
					id="terms"
					onChange={handleCheckboxChange}
				/>
			</div>
			{bookOwnHotels ? GuestsInput : RowBedAccommodationSelector}
		</div>
	)
}
