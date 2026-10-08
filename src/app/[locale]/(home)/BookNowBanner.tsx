import { useTranslations } from '@/lib/i18n'
import PromoCard from './PromoCard'

export default function BookNowBanner() {
	const t = useTranslations('BookNowAndPayLaterBanner')

	return (
		<PromoCard
			badge={`${new Date().getFullYear()} ${t('travel')}`}
			title={t('main_heading')}
			subtitle={t('sub_heading')}
			ctaLabel={t('reserve_button')}
			ctaHref="/search?query="
			footnote={t('disclaimer')}
		/>
	)
}
