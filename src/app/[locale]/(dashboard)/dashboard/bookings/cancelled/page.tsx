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
		namespace: 'Jan03_CancelledBookings_h7p2',
	})

	return {
		title: t('Cancelled_Bookings'),
		description: t('View_Cancelled_Tour_Bookings'),
	}
}

export default async function CancelledBookingsPage({ params }: PageProps) {
	const { locale } = await params
	const t = await getTranslations({
		locale,
		namespace: 'Jan03_CancelledBookings_h7p2',
	})

	return (
		<DashboardShell>
			<DashboardHeader
				heading={t('Cancelled_Bookings')}
				text={t('Review_Previously_Cancelled_Tour_Bookings')}
			/>
			<BookingsList statusFilter="cancelled" />
		</DashboardShell>
	)
}
