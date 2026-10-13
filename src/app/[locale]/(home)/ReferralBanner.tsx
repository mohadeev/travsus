import { Check } from 'lucide-react'
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
			{/* Phones: a short checklist. Larger screens: glass cards with details. */}
			<ul className="mt-4 space-y-1.5 sm:ml-auto sm:mt-6 sm:max-w-sm sm:space-y-2">
				{FEATURES.map(([title, desc]) => (
					<li
						key={title}
						className="flex items-center gap-2 text-left sm:block sm:rounded-2xl sm:bg-white/10 sm:px-4 sm:py-3 sm:ring-1 sm:ring-white/20 sm:backdrop-blur-md"
					>
						<Check className="h-4 w-4 shrink-0 sm:hidden" strokeWidth={3} />
						<p className="text-sm font-semibold">{t(title)}</p>
						<p className="hidden text-xs text-white/70 sm:block">{t(desc)}</p>
					</li>
				))}
			</ul>
		</PhotoBanner>
	)
}
