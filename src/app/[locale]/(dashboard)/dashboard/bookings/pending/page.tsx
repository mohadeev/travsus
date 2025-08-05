import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { BookingsList } from '@/components/dashboard/bookings-list'
import { getTranslations } from 'next-intl/server'

interface PageProps {
	params: Promise<{
		locale: string
	}>
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({
		locale,
		namespace: 'Jan03_PendingBookings_k5m2',
	})

	return {
		title: t('Pending_Bookings'),
		description: t('Manage_Your_Pending_Tour_Bookings'),
	}
}

export default async function PendingBookingsPage({ params }: PageProps) {
	const { locale } = await params
	const t = await getTranslations({
		locale,
		namespace: 'Jan03_PendingBookings_k5m2',
	})

	return (
		<DashboardShell>
			<DashboardHeader
				heading={t('Pending_Bookings')}
				text={t('Review_And_Confirm_Pending_Tour_Bookings')}
			/>
			<BookingsList statusFilter="pending" />
		</DashboardShell>
	)
}
