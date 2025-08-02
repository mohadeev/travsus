import type { Metadata } from 'next'
import { useTranslations } from '@/lib/i18n'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { BookingsList } from '@/components/dashboard/bookings-list'

// export const metadata: Metadata = {
// 	title: t('bookings_pending_page_Pending_Bookings'),
// 	description: t('bookings_pending_page_Manage_Your_Pending_Tour_Bookings'),
// }

export default function PendingBookingsPage() {
	const t = useTranslations('bookings_pending_page')
	return (
		<DashboardShell>
			<DashboardHeader
				heading={t('bookings_pending_page_Pending_Bookings')}
				text={t(
					'bookings_pending_page_Review_And_Confirm_Pending_Tour_Bookings',
				)}
			/>
			<BookingsList statusFilter="pending" />
		</DashboardShell>
	)
}
