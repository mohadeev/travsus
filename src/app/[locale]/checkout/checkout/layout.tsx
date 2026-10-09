import { Suspense } from 'react'

// This page reads URL parameters (useSearchParams): the Suspense boundary
// keeps that to the page itself instead of the whole site layout.
export default function Layout({ children }: { children: React.ReactNode }) {
	return <Suspense fallback={null}>{children}</Suspense>
}
