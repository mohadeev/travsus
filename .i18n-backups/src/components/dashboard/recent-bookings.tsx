'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getRecentBookings } from '@/lib/actions'
import { Skeleton } from '@/components/ui/skeleton'

type Booking = {
	id: string
	name: string
	tour: string
	avatar: string
	status: string
}

export function RecentBookings() {
	const [bookings, setBookings] = useState<Booking[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				setLoading(true)
				const data = await getRecentBookings()

				// Transform the API data to match our component's expected format
				const formattedBookings = data.map((booking: any) => ({
					id: booking.id || booking._id,
					name:
						booking.customerName ||
						booking.customer?.name ||
						'Unknown Customer',
					tour: booking.tourName || booking.tour?.name || 'Unknown Tour',
					avatar:
						booking.customer?.avatar ||
						`/placeholder.svg?height=32&width=32&text=${booking.customerName?.charAt(0) || 'U'}`,
					status: booking.status.toLowerCase(),
				}))

				setBookings(formattedBookings)
				setError(null)
			} catch (err) {
				console.error('Error fetching bookings:', err)
				setError('Failed to load recent bookings')
			} finally {
				setLoading(false)
			}
		}

		fetchBookings()
	}, [])

	if (loading) {
		return <BookingsLoadingSkeleton />
	}

	if (error) {
		return <div className="text-red-500">{error}</div>
	}

	if (bookings.length === 0) {
		return (
			<div className="text-muted-foreground py-4">
				No recent bookings found.
			</div>
		)
	}

	return (
		<div className="space-y-4">
			{bookings.map((booking) => (
				<div key={booking.id} className="flex items-center">
					<Avatar className="h-9 w-9">
						<AvatarImage
							src={booking.avatar || '/placeholder.svg'}
							alt={`${booking.name}'s avatar`}
						/>
						<AvatarFallback>{booking.name.charAt(0)}</AvatarFallback>
					</Avatar>
					<div className="ml-4 space-y-1">
						<p className="text-sm font-medium leading-none">{booking.name}</p>
						<p className="text-muted-foreground text-sm">{booking.tour}</p>
					</div>
					<div className="ml-auto font-medium">
						{booking.status === 'confirmed' ? (
							<span className="text-green-500">Confirmed</span>
						) : booking.status === 'pending' ? (
							<span className="text-yellow-500">Pending</span>
						) : (
							<span className="text-red-500">Cancelled</span>
						)}
					</div>
				</div>
			))}
		</div>
	)
}

function BookingsLoadingSkeleton() {
	return (
		<div className="space-y-4">
			{[1, 2, 3, 4, 5].map((i) => (
				<div key={i} className="flex items-center">
					<Skeleton className="h-9 w-9 rounded-full" />
					<div className="ml-4 space-y-2">
						<Skeleton className="h-4 w-[120px]" />
						<Skeleton className="h-4 w-[80px]" />
					</div>
					<div className="ml-auto">
						<Skeleton className="h-4 w-[70px]" />
					</div>
				</div>
			))}
		</div>
	)
}
