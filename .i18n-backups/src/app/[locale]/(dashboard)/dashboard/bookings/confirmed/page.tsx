import type { Metadata } from 'next'
import { useTranslations } from '@/lib/i18n'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { BookingsList } from '@/components/dashboard/bookings-list'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export const metadata: Metadata = {
	title: t('bookings_confirmed_page_Title'),
	description: t('bookings_confirmed_page_Description'),
}

export default function ConfirmedBookingsPage() {
	const t = useTranslations('ConfirmedBookingsPage')
	return (
		<DashboardShell>
			<DashboardHeader
				heading={t('bookings_confirmed_page_Heading')}
				text={t('bookings_confirmed_page_Text')}
			>
				<Button variant="outline">
					<Download className="mr-2 h-4 w-4" />
					{t('bookings_confirmed_page_Button_Label')}
				</Button>
			</DashboardHeader>
			<BookingsList statusFilter="confirmed" />
		</DashboardShell>
	)
}
