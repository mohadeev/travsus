import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/i18n'

export default function ReferralProgramBanner() {
	const t = useTranslations('ReferralProgramBanner')

	return (
		<section
			className="relative w-full overflow-hidden border-b border-t bg-cover bg-center bg-no-repeat py-12"
			style={{
				backgroundImage: 'url("/images/freepik_assistant_1753873160366.png")',
			}}
		>
			<div className="mx-auto px-4">
				<div className="">
					<div className="mb-6 inline-block rounded-lg bg-white px-6 py-3">
						<span className="text-lg font-bold italic text-black">
							{t('badge_text')}
						</span>
					</div>

					<h1 className="mb-6 text-5xl font-black leading-tight text-white md:text-6xl">
						{t('main_heading_line1')}
						<br />
						{t('main_heading_line2')}
					</h1>

					<p className="mb-8 text-xl font-bold leading-relaxed text-white/90 md:text-2xl">
						{t('sub_heading')}
					</p>

					{/* Horizontal features using flex */}
					<div className="mb-10 flex flex-nowrap space-x-4 overflow-x-auto pb-4">
						{/* Feature 1 */}
						<div className="flex flex-shrink-0 items-start rounded-lg bg-white/10 p-4 backdrop-blur-sm">
							<div className="mr-4 rounded-full bg-white/20 p-2">
								<span className="text-lg text-white">💰</span>
							</div>
							<div>
								<h3 className="text-sm font-bold uppercase tracking-wide text-white">
									{t('feature1_title')}
								</h3>
								<p className="text-xs text-white/70">{t('feature1_desc')}</p>
							</div>
						</div>

						{/* Feature 2 */}
						<div className="flex flex-shrink-0 items-start rounded-lg bg-white/10 p-4 backdrop-blur-sm">
							<div className="mr-4 rounded-full bg-white/20 p-2">
								<span className="text-lg text-white">📈</span>
							</div>
							<div>
								<h3 className="text-sm font-bold uppercase tracking-wide text-white">
									{t('feature2_title')}
								</h3>
								<p className="text-xs text-white/70">{t('feature2_desc')}</p>
							</div>
						</div>

						{/* Feature 3 */}
						<div className="flex flex-shrink-0 items-start rounded-lg bg-white/10 p-4 backdrop-blur-sm">
							<div className="mr-4 rounded-full bg-white/20 p-2">
								<span className="text-lg text-white">⚡</span>
							</div>
							<div>
								<h3 className="text-sm font-bold uppercase tracking-wide text-white">
									{t('feature3_title')}
								</h3>
								<p className="text-xs text-white/70">{t('feature3_desc')}</p>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<Button
							size="lg"
							className="rounded-full bg-black px-12 py-2 text-lg font-bold text-white transition-colors hover:bg-gray-800"
						>
							{t('button_text')}
						</Button>
					</div>

					<p className="text-sm text-white/70">{t('footer_text')}</p>
				</div>
			</div>
		</section>
	)
}
