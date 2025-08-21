import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { BookingsList } from '@/components/dashboard/bookings-list'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export const metadata: Metadata = {
	title: 'Confirmed Bookings',
	description: 'Manage your confirmed tour bookings',
}

export default function ConfirmedBookingsPage() {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Confirmed Bookings"
				text="Manage your confirmed tour bookings"
			>
				<Button variant="outline">
					<Download className="mr-2 h-4 w-4" />
					Export
				</Button>
			</DashboardHeader>
			<BookingsList statusFilter="confirmed" />
		</DashboardShell>
	)
}
