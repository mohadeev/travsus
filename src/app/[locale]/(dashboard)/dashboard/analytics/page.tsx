export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker'
import { Overview } from '@/components/dashboard/overview'
import { SalesAnalytics } from '@/components/dashboard/sales-analytics'
import { PerformanceMetrics } from '@/components/dashboard/performance-metrics'

export const metadata: Metadata = {
	title: 'Analytics',
	description: 'Tour business analytics and insights',
}

export default function AnalyticsPage() {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Analytics"
				text="Track and visualize your business performance"
			>
				<CalendarDateRangePicker />
			</DashboardHeader>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$45,231.89</div>
						<p className="text-muted-foreground text-xs">
							0 from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Bookings Conversion
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">0%</div>
						<p className="text-muted-foreground text-xs">
							0% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Average Order Value
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$1,298</div>
						<p className="text-muted-foreground text-xs">
							0% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Customer Satisfaction
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">5/5</div>
						<p className="text-muted-foreground text-xs">
							0% from last month
						</p>
					</CardContent>
				</Card>
			</div>
			<Tabs defaultValue="overview" className="mt-6 w-full">
				<TabsList className="grid w-full grid-cols-3 md:w-[400px]">
					<TabsTrigger value="overview">Revenue</TabsTrigger>
					<TabsTrigger value="sales">Sales</TabsTrigger>
					<TabsTrigger value="performance">Performance</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<Card>
						<CardHeader>
							<CardTitle>Revenue Overview</CardTitle>
							<CardDescription>
								Monthly revenue for the current year
							</CardDescription>
						</CardHeader>
						<CardContent className="pl-2">
							<Overview />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="sales">
					<Card>
						<CardHeader>
							<CardTitle>Sales Analytics</CardTitle>
							<CardDescription>
								Tour sales by category and location
							</CardDescription>
						</CardHeader>
						<CardContent>
							<SalesAnalytics />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="performance">
					<Card>
						<CardHeader>
							<CardTitle>Performance Metrics</CardTitle>
							<CardDescription>
								Key performance indicators for your business
							</CardDescription>
						</CardHeader>
						<CardContent>
							<PerformanceMetrics />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</DashboardShell>
	)
}
