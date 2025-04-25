import type React from 'react'
import { cn } from '@/lib/utils'

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
	children,
	className,
	...props
}: DashboardShellProps) {
	return (
		<div
			className={cn(
				'grid h-full w-full items-start gap-8 overflow-auto',
				className,
			)}
			{...props}
		>
			{children}
		</div>
	)
}
export const Shell = DashboardShell
