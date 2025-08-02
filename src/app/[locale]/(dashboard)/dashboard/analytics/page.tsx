import type { Metadata } from 'next'
import { useTranslations } from '@/lib/i18n'
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
	const t = useTranslations('dashboard_dashboard_analytics_page')

	return (
		<DashboardShell>
			<DashboardHeader
				heading={t('Analytics')}
				text={t('Track_And_Visualize_Your_Business_Performance')}
			>
				<CalendarDateRangePicker />
			</DashboardHeader>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('Total_Revenue')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$45,231.89</div>
						<p className="text-muted-foreground text-xs">
							{t('0_From_Last_Month')}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('Bookings_Conversion')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">0%</div>
						<p className="text-muted-foreground text-xs">0% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('Average_Order_Value')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$1,298</div>
						<p className="text-muted-foreground text-xs">0% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('Customer_Satisfaction')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">5/5</div>
						<p className="text-muted-foreground text-xs">0% from last month</p>
					</CardContent>
				</Card>
			</div>
			<Tabs defaultValue="overview" className="mt-6 w-full">
				<TabsList className="grid w-full grid-cols-3 md:w-[400px]">
					<TabsTrigger value="overview">{t('Revenue')}</TabsTrigger>
					<TabsTrigger value="sales">{t('Sales')}</TabsTrigger>
					<TabsTrigger value="performance">{t('Performance')}</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<Card>
						<CardHeader>
							<CardTitle>{t('Revenue_Overview')}</CardTitle>
							<CardDescription>
								{t('Monthly_Revenue_For_The_Current_Year')}
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
							<CardTitle>{t('Sales_Analytics')}</CardTitle>
							<CardDescription>
								{t('Tour_Sales_By_Category_And_Location')}
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
							<CardTitle>{t('Performance_Metrics')}</CardTitle>
							<CardDescription>
								{t('Key_Performance_Indicators_For_Your_Business')}
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
