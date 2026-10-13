import { useTranslations } from '@/lib/i18n'
import { PHOTOS } from '@/lib/photos'
import PhotoBanner from './PhotoBanner'

// [title key, description key]: edit to change the perks list
const FEATURES = [
	['feature1_title', 'feature1_desc'],
	['feature2_title', 'feature2_desc'],
	['feature3_title', 'feature3_desc'],
] as const

export default function ReferralBanner() {
	const t = useTranslations('ReferralProgramBanner')

	return (
		<PhotoBanner
			photo={PHOTOS.referral}
			align="right"
			eyebrow={t('badge_text')}
			title={
				<>
					{t('main_heading_line1')}
					<br />
					{t('main_heading_line2')}
				</>
			}
			text={t('sub_heading')}
			ctaLabel={t('button_text')}
			ctaHref="/affiliates"
			footnote={t('footer_text')}
		>
			<ul className="mt-6 space-y-2 sm:ml-auto sm:max-w-sm">
				{FEATURES.map(([title, desc]) => (
					<li key={title} className="rounded-2xl bg-white/10 px-4 py-3 text-left ring-1 ring-white/20 backdrop-blur-md">
						<p className="text-sm font-semibold">{t(title)}</p>
						<p className="text-xs text-white/70">{t(desc)}</p>
					</li>
				))}
			</ul>
		</PhotoBanner>
	)
}
