import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentBookings } from "@/components/dashboard/recent-bookings"
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker"
import { Icons } from "@/components/icons"
import { getDashboardStats, getMonthlyRevenueData, getRecentBookings } from "@/lib/actions"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Tour Agency Dashboard",
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const chartData = await getMonthlyRevenueData()
  const recentBookings = await getRecentBookings()

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your tour agency">
        <div className="flex items-center gap-2">
          <CalendarDateRangePicker />
          <Button>
            <Icons.download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.value}</div>
            <p className="text-xs text-muted-foreground">+{stats.totalRevenue.percentageChange}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tours</CardTitle>
            <Icons.users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.activeTours.value}</div>
            <p className="text-xs text-muted-foreground">+{stats.activeTours.percentageChange}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Icons.clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings.value}</div>
            <p className="text-xs text-muted-foreground">+{stats.pendingBookings.percentageChange}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Icons.star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customerSatisfaction.value}/5</div>
            <p className="text-xs text-muted-foreground">
              +{stats.customerSatisfaction.percentageChange}% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={chartData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>You have received {recentBookings.length} bookings recently.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentBookings bookings={recentBookings} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

