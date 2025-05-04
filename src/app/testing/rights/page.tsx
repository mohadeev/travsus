import dynamic from 'next/dynamic'

const GDPRDataSubjectRightsForm = dynamic(
	() =>
		import('@/components/GDPRDataSubjectRightsForm/GDPRDataSubjectRightsForm'),
	{ ssr: false },
)

export default function RightsPage() {
	return (
		<div>
			<GDPRDataSubjectRightsForm />
		</div>
	)
}
