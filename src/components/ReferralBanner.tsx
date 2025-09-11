import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/i18n'

export default function ReferralProgramBanner() {
	const t = useTranslations('ReferralProgramBanner')

	return (
		<section
			className="relative w-full overflow-hidden border-b border-t border-gray-300 bg-cover bg-center bg-no-repeat"
			style={{
				backgroundImage: 'url("/images/freepik_assistant_1753873160366.png")',
			}}
		>
			<div className="relative z-10 px-8 py-8 md:py-12">
				<div className="max-w-2xl">
					<div className="mb-6 inline-block rounded-lg bg-white px-6 py-3">
						<span className="text-lg font-bold italic text-black">
							{t('limited_time')}
						</span>
					</div>

					<h1 className="mb-6 text-5xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
						{t('main_heading')}
					</h1>

					<p className="mb-8 text-xl font-bold leading-relaxed text-white/90 md:text-2xl">
						{t('sub_heading')}
					</p>

					<div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
						<div className="flex items-start">
							<div className="mr-4 rounded-full bg-white/20 p-3">
								<span className="text-2xl">💰</span>
							</div>
							<div>
								<h3 className="text-lg font-bold text-white">
									{t('feature1_title')}
								</h3>
								<p className="text-white/80">{t('feature1_desc')}</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="mr-4 rounded-full bg-white/20 p-3">
								<span className="text-2xl">🔗</span>
							</div>
							<div>
								<h3 className="text-lg font-bold text-white">
									{t('feature2_title')}
								</h3>
								<p className="text-white/80">{t('feature2_desc')}</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="mr-4 rounded-full bg-white/20 p-3">
								<span className="text-2xl">⚡</span>
							</div>
							<div>
								<h3 className="text-lg font-bold text-white">
									{t('feature3_title')}
								</h3>
								<p className="text-white/80">{t('feature3_desc')}</p>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<Button
							size="lg"
							className="rounded-full bg-black px-12 py-2 text-lg font-bold text-white"
                        >
							{t('learn_more_button')}
						</Button>
					</div>

					<p className="text-sm text-white/70">{t('disclaimer')}</p>
				</div>
			</div>
		</section>
	)
}
