import type React from 'react'
import DashboardShell from './DashboardShell'

// The dashboard shows the signed-in user's own data: always render per request
export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return <DashboardShell>{children}</DashboardShell>
}
