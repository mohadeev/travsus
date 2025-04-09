"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart,
  Calendar,
  CreditCard,
  FileText,
  Home,
  Map,
  Settings,
  Plus,
  Clock,
  Check,
  X,
  DollarSign,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavProps {
  isCollapsed: boolean
}

export function Nav({ isCollapsed }: NavProps) {
  const pathname = usePathname()

  return (
    <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slate-800 text-white"
                        : "text-muted-foreground hover:bg-slate-100 hover:text-slate-900",
                      isCollapsed ? "justify-center" : "",
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground")} />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent
                    side="right"
                    className="flex items-center gap-4 bg-slate-800 text-white border-slate-700"
                  >
                    {item.title}
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </nav>

      {!isCollapsed && (
        <>
          <div className="mt-2">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Tours</h2>
              <div className="space-y-1">
                {tourItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-slate-800 text-white"
                          : "text-muted-foreground hover:bg-slate-100 hover:text-slate-900",
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "")} />
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Bookings</h2>
              <div className="space-y-1">
                {bookingItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-slate-800 text-white"
                          : "text-muted-foreground hover:bg-slate-100 hover:text-slate-900",
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "")} />
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Finance</h2>
              <div className="space-y-1">
                {financeItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-slate-800 text-white"
                          : "text-muted-foreground hover:bg-slate-100 hover:text-slate-900",
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "")} />
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Tours",
    href: "/dashboard/tours",
    icon: Map,
  },
  {
    title: "Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Finance",
    href: "/dashboard/finance",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

const tourItems = [
  {
    title: "All Tours",
    href: "/dashboard/tours",
    icon: Map,
  },
  {
    title: "Create Tour",
    href: "/dashboard/tours/create",
    icon: Plus,
  },
  {
    title: "Edit Tours",
    href: "/dashboard/tours/edit",
    icon: Settings,
  },
]

const bookingItems = [
  {
    title: "All Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Pending",
    href: "/dashboard/bookings/pending",
    icon: Clock,
  },
  {
    title: "Confirmed",
    href: "/dashboard/bookings/confirmed",
    icon: Check,
  },
  {
    title: "Cancelled",
    href: "/dashboard/bookings/cancelled",
    icon: X,
  },
]

const financeItems = [
  {
    title: "Overview",
    href: "/dashboard/finance",
    icon: DollarSign,
  },
  {
    title: "Invoices",
    href: "/dashboard/finance/invoices",
    icon: FileText,
  },
  {
    title: "Transactions",
    href: "/dashboard/finance/transactions",
    icon: CreditCard,
  },
]

