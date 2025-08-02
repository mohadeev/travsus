import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { getTour } from '@/app/actions/tourActions'
import { TourBuilder } from '@/components/dashboard/tour-builder'
import { useTranslations } from '@/lib/i18n'

// export const metadata: Metadata = {
// 	title: t('dashboard_dashboard_tours_id_edit_page_Edit_Tour'),
// 	description: t('dashboard_dashboard_tours_id_edit_page_Description'),
// }

export default async function EditTourPage({
	params,
}: {
	params: { id: string }
}) {
	const t = useTranslations('dashboard_dashboard_tours_id_edit_page')
	const result = await getTour(params.id)

	if (!result.success) {
		notFound()
	}

	const tour = result.tour

	return (
		<DashboardShell>
			<DashboardHeader
				heading={`${t('dashboard_dashboard_tours_id_edit_page_Heading')}${tour.name}`}
				text={
					tour.updated
						? t(
								'dashboard_dashboard_tours_id_edit_page_Update_Your_Tour_Package_Details',
							)
						: t(
								'dashboard_dashboard_tours_id_edit_page_Complete_Your_Tour_Setup',
							)
				}
			/>
			<TourBuilder tour={tour} />
		</DashboardShell>
	)
}
