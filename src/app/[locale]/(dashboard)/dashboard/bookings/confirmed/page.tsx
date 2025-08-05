import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { BookingsList } from '@/components/dashboard/bookings-list'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
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
		namespace: 'Jan03_ConfirmedBookings_w9x1',
	})

	return {
		title: t('Confirmed_Bookings'),
		description: t('Manage_Your_Confirmed_Tour_Bookings'),
	}
}

export default async function ConfirmedBookingsPage({ params }: PageProps) {
	const { locale } = await params
	const t = await getTranslations({
		locale,
		namespace: 'Jan03_ConfirmedBookings_w9x1',
	})

	return (
		<DashboardShell>
			<DashboardHeader
				heading={t('Confirmed_Bookings')}
				text={t('Manage_Your_Confirmed_Tour_Bookings')}
			>
				<Button variant="outline">
					<Download className="mr-2 h-4 w-4" />
					{t('Export')}
				</Button>
			</DashboardHeader>
			<BookingsList statusFilter="confirmed" />
		</DashboardShell>
	)
}
