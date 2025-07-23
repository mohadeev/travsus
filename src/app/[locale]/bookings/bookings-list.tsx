'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
	Calendar,
	MapPin,
	MoreVertical,
	Users,
	ChevronDown,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// // Define types based on the provided data structure
// type Booking = {
// 	id: string
// 	accommodation: {
// 		[key: string]: {
// 			[key: string]: {
// 				adult: number
// 				child: number
// 			}
// 		}
// 	}
// 	guests: {
// 		guestAdults: number
// 		guestChildren: number
// 	}
// 	bookingStates: Array<{
// 		state: string
// 		by: string
// 		createdAt: string
// 		updatedAt: string
// 	}>
// 	lineItems: Array<{
// 		description: string
// 		unitPrice: number
// 		totalPrice: number
// 		totalGuests: number
// 		serviceQuantity: number
// 		includeInTotal: boolean
// 		currency: string
// 	}>
// 	selectedDate: {
// 		startDate: number
// 		endDate: number
// 	} | null
// 	tourId: string
// 	duration: number
// 	bookingState: string
// 	tour: {
// 		name: string
// 		subtitle: string
// 		images: Array<{ url: string }>
// 	}
// }

// // Sample data (you would replace this with your actual data fetching logic)
// const bookingsData: Booking[] = [
// 	{
// 		id: '1',
// 		accommodation: {},
// 		guests: { guestAdults: 4, guestChildren: 2 },
// 		bookingStates: [],
// 		lineItems: [
// 			{
// 				description: 'Accommodation',
// 				unitPrice: 750,
// 				totalPrice: 750,
// 				totalGuests: 6,
// 				serviceQuantity: 1,
// 				includeInTotal: true,
// 				currency: 'USD',
// 			},
// 		],
// 		selectedDate: {
// 			startDate: new Date(2023, 6, 15).getTime(),
// 			endDate: new Date(2023, 6, 20).getTime(),
// 		},
// 		tourId: '1',
// 		duration: 5,
// 		bookingState: 'initiated',
// 		tour: {
// 			name: 'Cozy Cabin in the Woods',
// 			subtitle: 'Cozy Cabin in the Woods',
// 			images: [],
// 		},
// 	},
// 	{
// 		id: '2',
// 		accommodation: {},
// 		guests: { guestAdults: 2, guestChildren: 1 },
// 		bookingStates: [],
// 		lineItems: [
// 			{
// 				description: 'Accommodation',
// 				unitPrice: 1200,
// 				totalPrice: 1200,
// 				totalGuests: 3,
// 				serviceQuantity: 1,
// 				includeInTotal: true,
// 				currency: 'USD',
// 			},
// 		],
// 		selectedDate: {
// 			startDate: new Date(2023, 7, 1).getTime(),
// 			endDate: new Date(2023, 7, 7).getTime(),
// 		},
// 		tourId: '2',
// 		duration: 6,
// 		bookingState: 'pending',
// 		tour: {
// 			name: 'Beachfront Paradise Villa',
// 			subtitle: 'Beachfront Paradise Villa',
// 			images: [],
// 		},
// 	},
// 	{
// 		id: '3',
// 		accommodation: {},
// 		guests: { guestAdults: 2, guestChildren: 0 },
// 		bookingStates: [],
// 		lineItems: [
// 			{
// 				description: 'Accommodation',
// 				unitPrice: 600,
// 				totalPrice: 600,
// 				totalGuests: 2,
// 				serviceQuantity: 1,
// 				includeInTotal: true,
// 				currency: 'USD',
// 			},
// 		],
// 		selectedDate: {
// 			startDate: new Date(2023, 8, 10).getTime(),
// 			endDate: new Date(2023, 8, 15).getTime(),
// 		},
// 		tourId: '3',
// 		duration: 5,
// 		bookingState: 'completed',
// 		tour: {
// 			name: 'Downtown Loft Apartment',
// 			subtitle: 'Downtown Loft Apartment',
// 			images: [],
// 		},
// 	},
// ]

export function BookingsList({ bookings: bookingsData }: any) {
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [openDropdowns, setOpenDropdowns] = useState<{
		[key: string]: boolean
	}>({})

	// const filteredBookings = bookingsData?.filter((booking: any) => {
	// 	const matchesSearch = booking.tour.name
	// 		.toLowerCase()
	// 		.includes(searchTerm.toLowerCase())
	// 	const matchesStatus =
	// 		statusFilter === 'all' || booking.bookingState === statusFilter
	// 	return matchesSearch && matchesStatus
	// })

	const toggleDropdown = (id: string) => {
		setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }))
	}

	const getTotalPrice = (booking: any) => {
		return booking.lineItems.reduce(
			(total: any, item: any) => total + item.totalPrice,
			0,
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row">
				<input
					type="text"
					placeholder="Search bookings..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="rounded border p-2 sm:max-w-[300px]"
				/>
				<div className="relative sm:max-w-[200px]">
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="w-full appearance-none rounded border p-2 pr-8"
					>
						<option value="all">All Statuses</option>
						<option value="initiated">Initiated</option>
						<option value="pending">Pending</option>
						<option value="completed">Completed</option>
					</select>
					<ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform" />
				</div>
			</div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{bookingsData.map((booking: any) => (
					<div key={booking.id} className="rounded-lg border shadow-sm">
						<div className="p-6">
							<div className="flex items-start justify-between">
								<span className="text-lg font-semibold">
									{booking.tour.name}
								</span>
								<Badge
									variant={
										booking.bookingState === 'initiated'
											? 'secondary'
											: 'outline'
									}
								>
									{booking.bookingState}
								</Badge>
							</div>
						</div>
						<div className="px-6 pb-6">
							<div className="text-muted-foreground mb-2 flex items-center space-x-2 text-sm">
								<Calendar className="h-4 w-4" />
								<span>
									{booking.selectedDate
										? `${format(new Date(booking.selectedDate.startDate), 'MMM d, yyyy')} - ${format(new Date(booking.selectedDate.endDate), 'MMM d, yyyy')}`
										: 'Dates not selected'}
								</span>
							</div>
							<div className="text-muted-foreground mb-2 flex items-center space-x-2 text-sm">
								<MapPin className="h-4 w-4" />
								<span>{booking.tour.subtitle}</span>
							</div>
							<div className="text-muted-foreground flex items-center space-x-2 text-sm">
								<Users className="h-4 w-4" />
								<span>
									{booking?.guests?.guestAdults} adults,{' '}
									{booking?.guests?.guestChildren} children
								</span>
							</div>
						</div>
						<div className="flex items-center justify-between px-6 pb-6">
							<span className="font-semibold">
								${getTotalPrice(booking).toFixed(2)}
							</span>
							<div className="flex space-x-2">
								<button className="rounded border px-3 py-1 text-sm">
									View Details
								</button>
								<div className="relative">
									<button
										onClick={() => toggleDropdown(booking.id)}
										className="rounded border px-2 py-1 text-sm"
									>
										<MoreVertical className="h-4 w-4" />
									</button>
									{openDropdowns[booking.id] && (
										<div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
											<div
												className="py-1"
												role="menu"
												aria-orientation="vertical"
												aria-labelledby="options-menu"
											>
												<a
													href="#"
													className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
													role="menuitem"
													onClick={(e) => {
														e.preventDefault()
														console.log(`Modify booking ${booking.id}`)
														toggleDropdown(booking.id)
													}}
												>
													Modify Booking
												</a>
												<a
													href="#"
													className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
													role="menuitem"
													onClick={(e) => {
														e.preventDefault()
														console.log(`Cancel booking ${booking.id}`)
														toggleDropdown(booking.id)
													}}
												>
													Cancel Booking
												</a>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
