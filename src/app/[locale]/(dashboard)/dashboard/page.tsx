import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker'
import { Icons } from '@/components/icons'
import { getDashboardStats, getRecentBookings, getTours } from '@/lib/actions'
import { RecentBookings } from '@/components/dashboard/recent-bookings'
import { RecentTours } from '@/components/dashboard/recent-tours'

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Tour Agency Dashboard',
}

export default async function DashboardPage() {
	const t = useTranslations('dashboard_dashboard_page')
	const stats = await getDashboardStats()
	const recentBookings = await getRecentBookings()
	const recentTours = await getTours('', 5) // Get 5 most recent tours

	return (
		<DashboardShell>
			<DashboardHeader
				heading={t('Dashboard')}
				text={t('Overview_Of_Your_Tour_Agency')}
			>
				{/* <div className="flex items-center gap-2">
					<CalendarDateRangePicker />
					<Button>
						<Icons.download className="mr-2 h-4 w-4" />
						Download
					</Button>
				</div> */}
			</DashboardHeader>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('Total_Revenue')}
						</CardTitle>
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
						<CardTitle className="text-sm font-medium">
							{t('Active_Tours')}
						</CardTitle>
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
							{t('Pending_Bookings')}
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
							{t('Customer_Satisfaction')}
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
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>{t('Recent_Bookings')}</CardTitle>
						<CardDescription>
							{t('You_Have_Received_Bookings_Recently', {
								recentBookings: recentBookings.length,
							})}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<RecentBookings bookings={recentBookings} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>{t('Recent_Tours')}</CardTitle>
						<CardDescription>
							{t('Your_Most_Recent_Tours', { recentTours: recentTours.length })}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<RecentTours tours={recentTours} />
					</CardContent>
				</Card>
			</div>
		</DashboardShell>
	)
}
