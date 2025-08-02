import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ToursList } from '@/components/dashboard/tours-list'
import Link from 'next/link'
import { getTours } from '@/app/actions/tourActions'
import { useTranslations } from '@/lib/i18n'

// export const metadata: Metadata = {
// 	title: t('dashboard_dashboard_tours_page_Tours'),
// 	description: t('dashboard_dashboard_tours_page_Create_And_Manage_Your_Tours'),
// }

export default async function ToursPage() {
	const t = useTranslations('dashboard_dashboard_tours_page')
	const result = await getTours()
	const tours = result.success ? result.tours : []

	return (
		<DashboardShell>
			<DashboardHeader
				heading={t('dashboard_dashboard_tours_page_Tours')}
				text={t('dashboard_dashboard_tours_page_Create_And_Manage_Your_Tours')}
			>
				<Link href="/dashboard/tours/create" className="w-full md:w-auto">
					<Button className="w-full bg-black text-white hover:bg-black/90 md:w-auto">
						<Plus className="mr-2 h-4 w-4" />
						{t('dashboard_dashboard_tours_page_Create_Tour')}
					</Button>
				</Link>
			</DashboardHeader>
			<ToursList initialTours={tours} />
		</DashboardShell>
	)
}
