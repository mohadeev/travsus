import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { BookingsList } from '@/components/dashboard/bookings-list'

export const metadata: Metadata = {
	title: 'Cancelled Bookings',
	description: 'View cancelled tour bookings',
}

export default function CancelledBookingsPage() {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Cancelled Bookings"
				text="Review previously cancelled tour bookings"
			/>
			<BookingsList statusFilter="cancelled" />
		</DashboardShell>
	)
}
