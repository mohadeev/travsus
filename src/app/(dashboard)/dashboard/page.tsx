import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker'
import { Icons } from '@/components/icons'
import { getDashboardStats, getRecentBookings } from '@/lib/actions'

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Tour Agency Dashboard',
}

export default async function DashboardPage() {
	const stats = await getDashboardStats()
	const recentBookings = await getRecentBookings()

	return (
		<DashboardShell>
			<DashboardHeader heading="Dashboard" text="Overview of your tour agency">
				<div className="flex items-center gap-2">
					<CalendarDateRangePicker />
					<Button>
						<Icons.download className="mr-2 h-4 w-4" />
						Download
					</Button>
				</div>
			</DashboardHeader>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<Icons.dollarSign className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							${stats.totalRevenue.value}
						</div>
						<p className="text-muted-foreground text-xs">
							+{stats.totalRevenue.percentageChange}% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Tours</CardTitle>
						<Icons.users className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+{stats.activeTours.value}</div>
						<p className="text-muted-foreground text-xs">
							+{stats.activeTours.percentageChange}% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Pending Bookings
						</CardTitle>
						<Icons.clock className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.pendingBookings.value}
						</div>
						<p className="text-muted-foreground text-xs">
							+{stats.pendingBookings.percentageChange}% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Customer Satisfaction
						</CardTitle>
						<Icons.star className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.customerSatisfaction.value}/5
						</div>
						<p className="text-muted-foreground text-xs">
							+{stats.customerSatisfaction.percentageChange}% from last month
						</p>
					</CardContent>
				</Card>
			</div>
		</DashboardShell>
	)
}
