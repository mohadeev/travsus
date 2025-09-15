import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
// import TourBuilder from '@/components/dashboard/tour/TourBuilder'
import { getTour } from '@/app/actions/tourActions'
import { TourBuilder } from '@/components/dashboard/tour/tour-builder'

export const metadata: Metadata = {
	title: 'Edit Tour',
	description: 'Edit an existing tour package',
}

export default async function EditTourPage({
	params,
}: {
	params: { id: string }
}) {
	const result = await getTour(params.id)

	if (!result.success) {
		notFound()
	}

	const tour = result.tour

	return (
		<DashboardShell>
			<DashboardHeader
				heading={`Edit Tour: ${tour.name}`}
				text={
					tour.updated
						? 'Update your tour package details'
						: 'Complete your tour setup'
				}
			/>
			<TourBuilder tour={tour} />
		</DashboardShell>
	)
}
