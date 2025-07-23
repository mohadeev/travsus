import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { BookingsList } from '@/components/dashboard/bookings-list'

export const metadata: Metadata = {
	title: 'Pending Bookings',
	description: 'Manage your pending tour bookings',
}

export default function PendingBookingsPage() {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Pending Bookings"
				text="Review and confirm pending tour bookings"
			/>
			<BookingsList statusFilter="pending" />
		</DashboardShell>
	)
}
