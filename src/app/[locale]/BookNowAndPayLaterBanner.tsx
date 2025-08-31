import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/i18n'

export default function BookNowAndPayLaterBanner() {
	const currentYear = new Date().getFullYear()
	const t = useTranslations('BookNowAndPayLaterBanner')

	return (
		<section
			className="relative w-full overflow-hidden border-b border-t border-gray-300 bg-cover bg-center bg-no-repeat"
			style={{
				backgroundImage: 'url("/images/freepik_assistant_1753873160366.png")',
			}}
		>
			<div className="relative z-10 px-8 py-8 md:py-8">
				<div className="max-w-2xl">
					<div className="mb-6 inline-block rounded-lg bg-white px-6 py-3">
						<span className="text-lg font-bold italic text-black">
							{currentYear} {t('travel')}
						</span>
					</div>

					<h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
						{t('main_heading')}
					</h1>

					<p className="mb-8 text-xl font-bold leading-relaxed text-white/90 md:text-2xl">
						{t('sub_heading')}
					</p>

					<div className="mb-6">
						<Button
							size="lg"
							className="rounded-full bg-black px-12 py-2 text-lg font-bold text-white"
						>
							{t('reserve_button')}
						</Button>
					</div>

					<p className="text-sm text-white/70">{t('disclaimer')}</p>
				</div>
			</div>
		</section>
	)
}
