'use client'

import dynamic from 'next/dynamic'

// @react-pdf touches browser APIs. `ssr: false` is only allowed in a Client Component.
const GDPRDataSubjectRightsForm = dynamic(
	() => import('@/components/GDPRDataSubjectRightsForm/GDPRDataSubjectRightsForm'),
	{ ssr: false },
)

export default function RightsForm() {
	return <GDPRDataSubjectRightsForm />
}
