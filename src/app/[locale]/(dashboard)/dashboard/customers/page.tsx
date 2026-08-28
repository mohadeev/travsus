export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CustomersTable } from "@/components/dashboard/customers-table"

export const metadata: Metadata = {
  title: "Customers",
  description: "Manage your customers",
}

export default function CustomersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Customers" text="View and manage your customer database">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DashboardHeader>
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Customer Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">1,248</h3>
            <p className="text-muted-foreground text-sm">Total Customers</p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">+24%</h3>
            <p className="text-muted-foreground text-sm">Growth Rate</p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">73%</h3>
            <p className="text-muted-foreground text-sm">Repeat Customers</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center py-4">
        <Input placeholder="Search customers..." className="max-w-sm" />
      </div>
      <CustomersTable />
    </DashboardShell>
  )
}

