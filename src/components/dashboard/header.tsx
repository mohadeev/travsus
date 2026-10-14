import type React from 'react'

/** Page title, short description and optional actions on the right. */
export function DashboardHeader({ heading, text, children }: { heading: string; text?: string; children?: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div className="min-w-0">
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h1>
				{text && <p className="mt-1.5 text-neutral-500">{text}</p>}
			</div>
			{children && <div className="flex shrink-0 flex-wrap gap-2">{children}</div>}
		</div>
	)
}
