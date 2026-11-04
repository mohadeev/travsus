import { setRequestLocale } from 'next-intl/server'
import { GroupToursList } from '@/components/GroupToursList'

// Same page for every visitor: rendered once, served from the cache, refreshed at most every hour
export const revalidate = 3600

export default async function GroupToursPage(props: { params: Promise<{ locale: string }> }) {
	// The page's language from the address, not the request headers, so the page can be cached
	setRequestLocale((await props.params).locale)
	return (
		<main className="bg-background min-h-screen">
			<GroupToursList />
		</main>
	)
}
