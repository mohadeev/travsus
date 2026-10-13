import { useTranslations } from '@/lib/i18n'
import { PHOTOS } from '@/lib/photos'
import PhotoBanner from './PhotoBanner'

export default function BookNowBanner() {
	const t = useTranslations('BookNowAndPayLaterBanner')

	return (
		<PhotoBanner
			photo={PHOTOS.bookNow}
			eyebrow={`${new Date().getFullYear()} ${t('travel')}`}
			title={t('main_heading')}
			text={t('sub_heading')}
			ctaLabel={t('reserve_button')}
			ctaHref="/search?query="
			footnote={t('disclaimer')}
		/>
	)
}
