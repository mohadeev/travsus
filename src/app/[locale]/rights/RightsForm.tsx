'use client'

import dynamic from 'next/dynamic'

// Browser-only form; next/dynamic with ssr:false must live in a Client Component (Next 15+)
const GDPRDataSubjectRightsForm = dynamic(
	() =>
		import('@/components/GDPRDataSubjectRightsForm/GDPRDataSubjectRightsForm'),
	{ ssr: false },
)

export default function RightsForm() {
	return <GDPRDataSubjectRightsForm />
}
