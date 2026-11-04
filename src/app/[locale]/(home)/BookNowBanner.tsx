// Closing banner: one last, honest nudge (€20 to reserve, free cancellation)
// and the phone number for anyone who'd rather ask first.
import { useTranslations } from 'next-intl'
import { PHOTOS } from '@/lib/photos'
import { SUPPORT_PHONE } from '@/constants/contact'
import PhotoBanner from './PhotoBanner'

export default function BookNowBanner() {
	const t = useTranslations('Landing')

	return (
		<PhotoBanner
			photo={PHOTOS.bookNow}
			eyebrow={t('cta_eyebrow')}
			title={t('cta_title')}
			text={t('cta_text')}
			ctaLabel={t('cta_button')}
			ctaHref="/search?query="
			footnote={t('cta_note', { phone: SUPPORT_PHONE })}
		/>
	)
}
