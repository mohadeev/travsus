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
				<div>
					<div className="mb-6 inline-block rounded-lg bg-white px-6 py-3">
						<span className="text-[0.7rem] font-bold italic text-black md:text-lg">
							{t('badge_text')}
						</span>
					</div>

					<h1 className="mb-6 text-[2.5rem] font-black leading-tight text-white md:text-5xl lg:text-6xl">
						{t('main_heading_line1')}
						<br />
						{t('main_heading_line2')}
					</h1>

					<p className="mb-8 text-[1.4rem] font-bold leading-relaxed text-white/90 md:text-xl lg:text-2xl">
						{t('sub_heading')}
					</p>

					<div className="mb-10 flex flex-nowrap space-x-4 overflow-x-auto pb-4">
						<div className="flex flex-shrink-0 items-start rounded-lg bg-white/10 p-3 backdrop-blur-sm md:p-4">
							<div className="mr-4 rounded-full bg-white/20 p-1.5 md:p-2">
								<span className="text-[0.9rem] text-white md:text-lg">💰</span>
							</div>
							<div>
								<h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-white md:text-sm">
									{t('feature1_title')}
								</h3>
								<p className="text-[0.55rem] text-white/70 md:text-xs">
									{t('feature1_desc')}
								</p>
							</div>
						</div>

						<div className="flex flex-shrink-0 items-start rounded-lg bg-white/10 p-3 backdrop-blur-sm md:p-4">
							<div className="mr-4 rounded-full bg-white/20 p-1.5 md:p-2">
								<span className="text-[0.9rem] text-white md:text-lg">📈</span>
							</div>
							<div>
								<h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-white md:text-sm">
									{t('feature2_title')}
								</h3>
								<p className="text-[0.55rem] text-white/70 md:text-xs">
									{t('feature2_desc')}
								</p>
							</div>
						</div>

						<div className="flex flex-shrink-0 items-start rounded-lg bg-white/10 p-3 backdrop-blur-sm md:p-4">
							<div className="mr-4 rounded-full bg-white/20 p-1.5 md:p-2">
								<span className="text-[0.9rem] text-white md:text-lg">⚡</span>
							</div>
							<div>
								<h3 className="text-[0.7rem] font-bold uppercase tracking-wide text-white md:text-sm">
									{t('feature3_title')}
								</h3>
								<p className="text-[0.55rem] text-white/70 md:text-xs">
									{t('feature3_desc')}
								</p>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<Button
							size="lg"
							className="rounded-full bg-black px-8 py-1.5 text-[0.9rem] font-bold text-white transition-colors hover:bg-gray-800 md:px-12 md:py-2 md:text-lg"
						>
							{t('button_text')}
						</Button>
					</div>

					<p className="text-[0.7rem] text-white/70 md:text-sm">
						{t('footer_text')}
					</p>
				</div>
			</div>
		</section>
	)
}
