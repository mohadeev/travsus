import { useTranslations } from 'next-intl'
import { WhistleblowerChannel } from '@/components/WhistleblowerChannel/WhistleblowerChannel'

// export const metadata = {
// 	title: t('report_confidential_page_Title'),
// 	description: t('report_confidential_page_Description'),
// }

export default function ConfidentialReportPage() {
	const t = useTranslations('report_confidential_page')
	return (
		<main>
			<WhistleblowerChannel />
		</main>
	)
}
