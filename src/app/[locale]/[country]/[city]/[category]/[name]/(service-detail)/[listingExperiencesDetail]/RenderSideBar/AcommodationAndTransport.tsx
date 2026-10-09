'use client'
import Checkbox from '@/components/ui/checkbox'
import { useAppDispatch } from '@/store/hooks'
import { includeLineItem } from '@/store/slices/booking'
import { useTranslations } from '@/lib/i18n'

export default function AcommodationAndTransport({
	RowBedAccommodationSelector,
	GuestsInput,
	bookOwnHotels,
	handleBookOwnHotels,
}: any) {
	const t = useTranslations('Jan03_AccommodationTransport_p2k7')
	const dispatch = useAppDispatch()

	const handleCheckboxChange = (checked: boolean) => {
		handleBookOwnHotels(checked)
		dispatch(includeLineItem({ description: 'accommodation', include: !checked }))
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
