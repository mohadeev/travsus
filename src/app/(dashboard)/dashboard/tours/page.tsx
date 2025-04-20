import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ToursList } from '@/components/dashboard/tours-list'
import Link from 'next/link'
import { getTours } from '@/app/actions/tourActions'

export const metadata: Metadata = {
	title: 'Tours',
	description: 'Manage your tours',
}

export default async function ToursPage() {
	const result = await getTours()
	const tours = result.success ? result.tours : []

	return (
		<DashboardShell>
			<DashboardHeader heading="Tours" text="Create and manage your tours">
				<Link href="/dashboard/tours/create" className="w-full md:w-auto">
					<Button className="w-full md:w-auto">
						<Plus className="mr-2 h-4 w-4" />
						Create Tour
					</Button>
				</Link>
			</DashboardHeader>
			<ToursList initialTours={tours} />
		</DashboardShell>
	)
}
