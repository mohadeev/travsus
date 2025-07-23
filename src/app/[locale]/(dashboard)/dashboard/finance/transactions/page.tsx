import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TransactionsList } from '@/components/dashboard/transactions-list'
import { Button } from '@/components/ui/button'
import { Download, Filter } from 'lucide-react'
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker'

export const metadata: Metadata = {
	title: 'Transactions',
	description: 'View and manage your financial transactions',
}

export default function TransactionsPage() {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Transactions"
				text="Track all your financial transactions"
			>
				<div className="flex items-center gap-2">
					<CalendarDateRangePicker />
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
				</div>
			</DashboardHeader>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Transaction Summary</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-6 md:grid-cols-4">
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">$42,568.89</h3>
						<p className="text-muted-foreground text-sm">Total Credits</p>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">$12,453.95</h3>
						<p className="text-muted-foreground text-sm">Total Debits</p>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">$30,114.94</h3>
						<p className="text-muted-foreground text-sm">Net Balance</p>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">156</h3>
						<p className="text-muted-foreground text-sm">Total Transactions</p>
					</div>
				</CardContent>
			</Card>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-medium">Recent Transactions</h2>
				<Button variant="outline" size="sm">
					<Filter className="mr-2 h-4 w-4" />
					Filter
				</Button>
			</div>
			<TransactionsList />
		</DashboardShell>
	)
}
