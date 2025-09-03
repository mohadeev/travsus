import { redirect } from 'next/navigation'

interface CountryPageProps {
	params: Promise<{ country: string }>
}

export default async function CountryPage({ params }: CountryPageProps) {
	const { country } = await params

	redirect(`/${country}`)
}
