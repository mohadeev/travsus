import type { Metadata } from 'next'
import { useTranslations } from '@/lib/i18n'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InvoicesList } from '@/components/dashboard/invoices-list'
import { Button } from '@/components/ui/button'
import { Download, Plus } from 'lucide-react'

export const metadata: Metadata = {
	title: t('finance_invoices_page_Invoices'),
	description: t('finance_invoices_page_Create_And_Manage_Your_Tour_Invoices'),
}

export default function InvoicesPage() {
	const t = useTranslations('finance_invoices_page')
	return (
		<DashboardShell>
			<DashboardHeader
				heading={t('Invoices')}
				text={t('Create_And_Manage_Your_Tour_Invoices')}
			>
				<div className="flex items-center gap-2">
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						{t('Export')}
					</Button>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						{t('Create_Invoice')}
					</Button>
				</div>
			</DashboardHeader>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>{t('Invoice_Summary')}</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-6 md:grid-cols-3">
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">$48,250.84</h3>
						<p className="text-muted-foreground text-sm">
							{t('Total_Invoiced')}
						</p>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">$6,594.00</h3>
						<p className="text-muted-foreground text-sm">{t('Pending')}</p>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">$2,150.12</h3>
						<p className="text-muted-foreground text-sm">{t('Overdue')}</p>
					</div>
				</CardContent>
			</Card>
			<InvoicesList />
		</DashboardShell>
	)
}
