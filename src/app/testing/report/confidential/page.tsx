import { WhistleblowerChannel } from '@/components/WhistleblowerChannel/WhistleblowerChannel'

export const metadata = {
	title: 'Confidential Reporting Channel',
	description:
		'Submit a confidential report through our secure whistleblower channel.',
}

export default function ConfidentialReportPage() {
	return (
		<main>
			<WhistleblowerChannel />
		</main>
	)
}
