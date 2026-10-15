import type React from 'react'
import { cn } from '@/lib/utils'

/** Vertical rhythm for a dashboard page (the layout adds the menu and padding). */
export function DashboardShell({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn('grid w-full min-w-0 grid-cols-1 items-start gap-8', className)} {...props}>
			{children}
		</div>
	)
}
export const Shell = DashboardShell
