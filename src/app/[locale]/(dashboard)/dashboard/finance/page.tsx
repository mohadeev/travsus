import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InvoicesList } from '@/components/dashboard/invoices-list'
import { TransactionsList } from '@/components/dashboard/transactions-list'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
	title: 'Finance',
	description: 'Manage your finances',
}

function FinanceStatsSkeleton() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{Array(4)
				.fill(null)
				.map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-5 w-[120px]" />
						</CardHeader>
						<CardContent>
							<Skeleton className="mb-1 h-8 w-[100px]" />
							<Skeleton className="h-4 w-[140px]" />
						</CardContent>
					</Card>
				))}
		</div>
	)
}

export default function FinancePage() {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Finance"
				text="Manage your finances and invoices"
			/>
			<Suspense fallback={<FinanceStatsSkeleton />}>
				<FinanceStats />
			</Suspense>
			<Tabs defaultValue="invoices" className="mt-6 w-full">
				<TabsList className="grid w-full grid-cols-2 md:w-[400px]">
					<TabsTrigger value="invoices">Invoices</TabsTrigger>
					<TabsTrigger value="transactions">Transactions</TabsTrigger>
				</TabsList>
				<TabsContent value="invoices">
					<InvoicesList />
				</TabsContent>
				<TabsContent value="transactions">
					<TransactionsList />
				</TabsContent>
			</Tabs>
		</DashboardShell>
	)
}

async function FinanceStats() {
	try {
		// For server components in Next.js, we need to construct a full URL
		const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
		const host =
			process.env.VERCEL_URL ||
			process.env.NEXT_PUBLIC_VERCEL_URL ||
			'localhost:3001'
		const baseUrl = `${protocol}://${host}`

		const response = await fetch(`${baseUrl}/api/dashboard/finance`, {
			cache: 'no-store', // Disable caching to always get fresh data
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			console.error('API response error:', response.status, response.statusText)
			// Return default data if the API call fails
			return <DefaultFinanceStats />
		}

		const stats = await response.json()

		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
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
							Pending Payments
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							${stats.pendingPayments.value}
						</div>
						<p className="text-muted-foreground text-xs">
							+{stats.pendingPayments.percentageChange}% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Invoices Sent</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.invoicesSent.value}</div>
						<p className="text-muted-foreground text-xs">
							+{stats.invoicesSent.percentageChange}% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.paidInvoices.value}</div>
						<p className="text-muted-foreground text-xs">
							+{stats.paidInvoices.percentageChange}% from last month
						</p>
					</CardContent>
				</Card>
			</div>
		)
	} catch (error) {
		console.error('Error in FinanceStats component:', error)
		return <DefaultFinanceStats />
	}
}

// Fallback component with default data
function DefaultFinanceStats() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">$0.00</div>
					<p className="text-muted-foreground text-xs">+0% from last month</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Pending Payments
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">$0.00</div>
					<p className="text-muted-foreground text-xs">+0% from last month</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Invoices Sent</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">0</div>
					<p className="text-muted-foreground text-xs">+0% from last month</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">0</div>
					<p className="text-muted-foreground text-xs">+0% from last month</p>
				</CardContent>
			</Card>
		</div>
	)
}
