import React from 'react'
interface DashboardHeaderProps {
	heading: string
	text?: string
	children?: React.ReactNode
}

export function DashboardHeader({
	heading,
	text,
	children,
}: DashboardHeaderProps) {
	return (
		<div className="flex flex-col gap-4 pb-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
				{text && <p className="text-muted-foreground">{text}</p>}
			</div>
			{children && (
				<div className="flex w-full md:w-auto">
					{typeof children === 'object' &&
					'type' in children &&
					children.type.toString().includes('Button') ? (
						<div className="w-full md:w-auto">
							{React.cloneElement(children as React.ReactElement, {
								className:
									'w-full md:w-auto ' +
									(children as React.ReactElement).props.className,
							})}
						</div>
					) : (
						children
					)}
				</div>
			)}
		</div>
	)
}
