export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardHeader } from "@/components/dashboard/header"
import { ToursList } from "@/components/dashboard/tours-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: "Edit Tours",
  description: "Manage and edit your existing tours",
}

export default function EditToursPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Tours" text="Manage and update your existing tours" />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Manage Tours</CardTitle>
          <CardDescription>Select a tour from the list below to edit its details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Input placeholder="Search tours..." className="max-w-sm" />
          </div>
          <ToursList />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}

