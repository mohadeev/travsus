import type { Metadata } from 'next'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InvoicesList } from '@/components/dashboard/invoices-list'
import { Button } from '@/components/ui/button'
import { Download, Plus } from 'lucide-react'

export const metadata: Metadata = {
	title: 'Invoices',
	description: 'Manage your tour invoices',
}

export default function InvoicesPage() {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Invoices"
				text="Create and manage your tour invoices"
			>
				<div className="flex items-center gap-2">
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Create Invoice
					</Button>
				</div>
			</DashboardHeader>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Invoice Summary</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-6 md:grid-cols-3">
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">$48,250.84</h3>
						<p className="text-muted-foreground text-sm">Total Invoiced</p>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">$6,594.00</h3>
						<p className="text-muted-foreground text-sm">Pending</p>
					</div>
					<div className="flex flex-col gap-1">
						<h3 className="text-xl font-bold">$2,150.12</h3>
						<p className="text-muted-foreground text-sm">Overdue</p>
					</div>
				</CardContent>
			</Card>
			<InvoicesList />
		</DashboardShell>
	)
}
