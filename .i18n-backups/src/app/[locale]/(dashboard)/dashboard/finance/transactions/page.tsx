import type { Metadata } from 'next'
import { useTranslations } from '@/lib/i18n'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TransactionsList } from '@/components/dashboard/transactions-list'
import { Button } from '@/components/ui/button'
import { Download, Filter } from 'lucide-react'
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker'

export const metadata: Metadata = {
	title: t('finance_transactions_page_Transactions'),
	description: t(
		'finance_transactions_page_View_And_Manage_Your_Financial_Transactions',
	),
}

export default function TransactionsPage() {
	const t = useTranslations('finance_transactions_page')
	return (
		<DashboardShell>
			<DashboardHeader
				heading={t('Transactions')}
				text={t('Track_All_Your_Financial_Transactions')}
			>
				<div className="flex items-center gap-2">
					<CalendarDateRangePicker />
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						{t('Export')}
					</Button>
				</div>
			</DashboardHeader>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>{t('Transaction_Summary')}</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-6 md:grid-cols-4">
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">$42,568.89</h3>
						<p className="text-muted-foreground text-sm">
							{t('Total_Credits')}
						</p>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">$12,453.95</h3>
						<p className="text-muted-foreground text-sm">{t('Total_Debits')}</p>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">$30,114.94</h3>
						<p className="text-muted-foreground text-sm">{t('Net_Balance')}</p>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">156</h3>
						<p className="text-muted-foreground text-sm">
							{t('Total_Transactions')}
						</p>
					</div>
				</CardContent>
			</Card>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-medium">{t('Recent_Transactions')}</h2>
				<Button variant="outline" size="sm">
					<Filter className="mr-2 h-4 w-4" />
					{t('Filter')}
				</Button>
			</div>
			<TransactionsList />
		</DashboardShell>
	)
}
