// Old city links (/destinations/{country}/{city}?lcId=<city id>): the
// middleware rewrites them here, and this sends them to the city's address
// for good. Kept apart so the city page itself never reads the query string.
import { notFound, permanentRedirect } from 'next/navigation'
import { getCity } from '@/lib/destinations'

export const dynamic = 'force-dynamic'

export default async function LegacyCity(props: { params: Promise<{ locale: string; code: string; city: string; lcId: string }> }) {
	const { locale, code, city, lcId } = await props.params
	const found = await getCity(code, city, locale, decodeURIComponent(lcId))
	if (!found) notFound()
	permanentRedirect(found.href as any)
}
