export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { ReactNode } from 'react'

export default function GeneralConditionsLayout({
	children,
}: {
	children: ReactNode
}) {
	return (
		<div className="min-h-screen bg-gray-50">
			<main>{children}</main>
		</div>
	)
}
