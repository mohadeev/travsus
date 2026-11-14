import type { Metadata } from 'next'

// Internal translation tool. It used to be a public 200 with no title.
export const metadata: Metadata = {
	title: 'Tour Translation Manager',
	robots: { index: false, follow: false },
}

export default function ToursLayout({ children }: { children: React.ReactNode }) {
	return children
}
