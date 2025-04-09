"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentBookings() {
  return (
    <div className="space-y-8">
      {recentBookings.map((booking) => (
        <div key={booking.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={booking.avatar} alt="Avatar" />
            <AvatarFallback>{booking.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{booking.name}</p>
            <p className="text-sm text-muted-foreground">{booking.tour}</p>
          </div>
          <div className="ml-auto font-medium">
            {booking.status === "confirmed" ? (
              <span className="text-green-500">Confirmed</span>
            ) : booking.status === "pending" ? (
              <span className="text-yellow-500">Pending</span>
            ) : (
              <span className="text-red-500">Cancelled</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const recentBookings = [
  {
    id: "1",
    name: "John Smith",
    tour: "Paris Explorer",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "confirmed",
  },
  {
    id: "2",
    name: "Emma Johnson",
    tour: "Rome Adventure",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "pending",
  },
  {
    id: "3",
    name: "Michael Brown",
    tour: "Tokyo Discovery",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "confirmed",
  },
  {
    id: "4",
    name: "Sophia Williams",
    tour: "New York City Tour",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "cancelled",
  },
  {
    id: "5",
    name: "James Davis",
    tour: "London Explorer",
    avatar: "/placeholder.svg?height=32&width=32",
    status: "confirmed",
  },
]

