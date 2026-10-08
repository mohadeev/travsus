import { useTranslations } from '@/lib/i18n'
import PromoCard from './PromoCard'

// [emoji, title key, description key] — edit to change the feature tiles
const FEATURES = [
	['💰', 'feature1_title', 'feature1_desc'],
	['📈', 'feature2_title', 'feature2_desc'],
	['⚡', 'feature3_title', 'feature3_desc'],
] as const

export default function ReferralBanner() {
	const t = useTranslations('ReferralProgramBanner')

	return (
		<PromoCard
			badge={t('badge_text')}
			title={
				<>
					{t('main_heading_line1')}
					<br />
					{t('main_heading_line2')}
				</>
			}
			subtitle={t('sub_heading')}
			ctaLabel={t('button_text')}
			ctaHref="/affiliates"
			footnote={t('footer_text')}
		>
			<div className="mb-10 grid gap-3 sm:grid-cols-3">
				{FEATURES.map(([icon, title, desc]) => (
					<div
						key={title}
						className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-sm"
					>
						<span className="text-xl">{icon}</span>
						<div>
							<h3 className="text-sm font-bold uppercase tracking-wide text-white">
								{t(title)}
							</h3>
							<p className="text-xs text-white/70">{t(desc)}</p>
						</div>
					</div>
				))}
			</div>
		</PromoCard>
	)
}
