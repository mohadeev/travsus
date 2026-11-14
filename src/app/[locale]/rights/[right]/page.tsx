import { notFound } from 'next/navigation'
import RightsForm from '../RightsForm'

const RIGHTS = new Set(['access', 'rectification', 'object', 'erasure', 'restriction', 'portability', 'automated-decision'])

// The privacy policy links here (/rights/object and the other rights).
// Each one opens the existing request form with that right selected.
export default async function RightPage(props: { params: Promise<{ right: string }> }) {
	const { right } = await props.params
	if (!RIGHTS.has(right)) notFound()
	return (
		<div>
			<RightsForm right={right} />
		</div>
	)
}
