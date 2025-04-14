"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  {
    name: "City Tours",
    value: 35,
    color: "hsl(var(--chart-1))",
  },
  {
    name: "Adventure Tours",
    value: 25,
    color: "hsl(var(--chart-2))",
  },
  {
    name: "Cultural Tours",
    value: 20,
    color: "hsl(var(--chart-3))",
  },
  {
    name: "Beach Vacations",
    value: 15,
    color: "hsl(var(--chart-4))",
  },
  {
    name: "Cruise Tours",
    value: 5,
    color: "hsl(var(--chart-5))",
  },
]

export function SalesAnalytics() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium text-center mb-6">Tour Sales by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} contentStyle={{ borderRadius: "8px" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex-1">
          <div className="rounded-lg border p-4 h-full">
            <h3 className="text-sm font-medium mb-4">Top Performing Tours</h3>
            <div className="space-y-4">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-4">Sales Growth</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>This Month</span>
                  <span className="font-medium text-green-600">+24.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Quarter</span>
                  <span className="font-medium text-green-600">+18.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Year to Date</span>
                  <span className="font-medium text-green-600">+32.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




//comment