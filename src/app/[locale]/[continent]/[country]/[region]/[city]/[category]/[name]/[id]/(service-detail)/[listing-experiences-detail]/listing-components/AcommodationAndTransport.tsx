'use client'

import React, { useState } from 'react'
import Checkbox from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { removeLineItem } from '@/app/GlobalRedux/Features/bookingSlice/bookingSlice'
import { useDispatch } from 'react-redux'
// import RowBedAccommodationSelector from './RowBedAccommodationSelector'
// import GuestsInput from './GuestsInput'

export default function AcommodationAndTransport({
	RowBedAccommodationSelector,
	GuestsInput,
	bookOwnHotels,
	handleBookOwnHotels,
}: any) {
	// const [bookOwnHotels, setBookOwnHotels] = useState(false)
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
					label="I have my hotel booked."
					id="terms"
					onChange={handleCheckboxChange}
				/>
			</div>

			{bookOwnHotels ? GuestsInput : RowBedAccommodationSelector}
		</div>
	)
}
