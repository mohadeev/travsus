// "How it works": the three steps from choosing a tour to meeting the guide,
// so nothing about booking feels uncertain (€20 deposit, free cancellation).
import { CalendarCheck, Compass, MapPinned } from 'lucide-react'
import { useTranslations } from 'next-intl'
import styles from './home.module.css'

const STEPS = [
	[Compass, 'step1'],
	[CalendarCheck, 'step2'],
	[MapPinned, 'step3'],
] as const

export default function HowItWorks() {
	const t = useTranslations('Landing')

	return (
		<section className={styles.reveal} aria-labelledby="how-title">
			<h2 id="how-title" className="headline text-2xl sm:text-[32px]">
				{t('how_title')}
			</h2>
			<p className="mt-1 text-sm text-neutral-500 sm:mt-2 sm:text-base">{t('how_sub')}</p>

			<ol className={`${styles.stagger} mt-5 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-3`}>
				{STEPS.map(([Icon, key], i) => (
					<li key={key} className="relative rounded-2xl bg-neutral-100 p-5 sm:p-7 dark:bg-neutral-900">
						<div className="flex items-center justify-between">
							<span className="grid h-12 w-12 place-items-center rounded-full bg-white text-neutral-950 shadow-sm dark:bg-neutral-950 dark:text-white">
								<Icon className="h-6 w-6" aria-hidden />
							</span>
							<span aria-hidden className="text-5xl font-black leading-none text-neutral-200 dark:text-neutral-800">
								{i + 1}
							</span>
						</div>
						<h3 className="mt-5 text-lg font-bold">{t(`${key}_title`)}</h3>
						<p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">{t(`${key}_text`)}</p>
					</li>
				))}
			</ol>
		</section>
	)
}
