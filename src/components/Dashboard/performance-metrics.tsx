"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const quarterlyData = [
  {
    name: "Q1",
    revenue: 12400,
    profit: 4200,
    costs: 8200,
  },
  {
    name: "Q2",
    revenue: 15600,
    profit: 5800,
    costs: 9800,
  },
  {
    name: "Q3",
    revenue: 18200,
    profit: 7100,
    costs: 11100,
  },
  {
    name: "Q4",
    revenue: 21400,
    profit: 8900,
    costs: 12500,
  },
]

const kpiData = [
  {
    name: "Jan",
    bookingRate: 65,
    customerSatisfaction: 4.1,
    repeatCustomers: 22,
  },
  {
    name: "Feb",
    bookingRate: 68,
    customerSatisfaction: 4.3,
    repeatCustomers: 24,
  },
  {
    name: "Mar",
    bookingRate: 70,
    customerSatisfaction: 4.4,
    repeatCustomers: 28,
  },
  {
    name: "Apr",
    bookingRate: 72,
    customerSatisfaction: 4.5,
    repeatCustomers: 30,
  },
  {
    name: "May",
    bookingRate: 75,
    customerSatisfaction: 4.7,
    repeatCustomers: 34,
  },
  {
    name: "Jun",
    bookingRate: 78,
    customerSatisfaction: 4.8,
    repeatCustomers: 38,
  },
]

export function PerformanceMetrics() {
  return (
    <Tabs defaultValue="financial" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="financial">Financial Metrics</TabsTrigger>
        <TabsTrigger value="kpi">KPIs</TabsTrigger>
      </TabsList>
      <TabsContent value="financial" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$67,600</div>
              <p className="text-xs text-muted-foreground">+12.4% from previous year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$26,000</div>
              <p className="text-xs text-muted-foreground">+18.1% from previous year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">38.5%</div>
              <p className="text-xs text-muted-foreground">+2.5% from previous year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$41,600</div>
              <p className="text-xs text-muted-foreground">+8.7% from previous year</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Financial Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--chart-1))" />
                <Bar dataKey="costs" name="Costs" fill="hsl(var(--chart-2))" />
                <Bar dataKey="profit" name="Profit" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="kpi" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Booking Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">+5% from previous quarter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-xs text-muted-foreground">+0.3 from previous quarter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">38%</div>
              <p className="text-xs text-muted-foreground">+6% from previous quarter</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={kpiData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bookingRate"
                  name="Booking Rate (%)"
                  stroke="hsl(var(--chart-1))"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="customerSatisfaction"
                  name="Customer Satisfaction"
                  stroke="hsl(var(--chart-2))"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="repeatCustomers"
                  name="Repeat Customers (%)"
                  stroke="hsl(var(--chart-3))"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

