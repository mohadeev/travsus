import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { BookingsList } from '@/components/dashboard/bookings-list'

export const metadata: Metadata = {
	title: t('bookings_cancelled_page_Title'),
	description: t('bookings_cancelled_page_Description'),
}

export default function CancelledBookingsPage() {
	const t = useTranslations('bookings_cancelled_page')
	return (
		<DashboardShell>
			<DashboardHeader
				heading={t('bookings_cancelled_page_Heading')}
				text={t('bookings_cancelled_page_Text')}
			/>
			<BookingsList statusFilter="cancelled" />
		</DashboardShell>
	)
}
