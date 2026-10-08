'use client'

import Link from 'next/link'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import styles from './HomeHero.module.css'

// Translation keys live in messages/<locale>.json
const HERO_NS = 'app_locale_test_page'
const PERKS_NS = 'app_locale_ClientHomePage'

const PERKS = [
	'app_locale_ClientHomePage_Best_Price_Guarantee',
	'app_locale_ClientHomePage_No_Hidden_Fees',
	'app_locale_ClientHomePage_5_Star_Service_Quality',
]

const CTA_HREF = '/search?query='

export default function HomeHero() {
	const t = useTranslations(HERO_NS)
	const tPerks = useTranslations(PERKS_NS)

	return (
		<section className="relative isolate overflow-hidden py-20 sm:py-28">
			{/* Background: gradient blobs + dotted grid */}
			<div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
				<div
					className={`${styles.blob} absolute -left-24 top-0 h-80 w-80 rounded-full bg-sky-400/40 blur-3xl sm:h-[28rem] sm:w-[28rem]`}
				/>
				<div
					className={`${styles.blobDelayed} absolute left-1/3 top-10 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl sm:h-96 sm:w-96`}
				/>
				<div
					className={`${styles.blob} absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-400/40 blur-3xl sm:h-[26rem] sm:w-[26rem]`}
				/>
				<div
					className={`${styles.blobDelayed} absolute bottom-10 left-10 h-64 w-64 rounded-full bg-pink-400/30 blur-3xl`}
				/>
				<div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)] dark:bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)]" />
			</div>

			<div className="container flex flex-col items-center text-center">
				<span
					className={`${styles.fadeUp} mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-neutral-700 shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-200`}
				>
					<Sparkles className="h-4 w-4 text-violet-600" />
					{tPerks('app_locale_ClientHomePage_Your_Journey_You_Deserve')}
				</span>

				<h1
					className={`${styles.fadeUp} max-w-4xl bg-gradient-to-r from-sky-600 via-violet-600 to-orange-600 bg-clip-text pb-2 text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl`}
					style={{ animationDelay: '100ms' }}
				>
					{t('app_locale_test_page_Travel_With_Ultimate_Flexibility')}
				</h1>

				<p
					className={`${styles.fadeUp} mx-auto mt-4 max-w-2xl text-lg font-medium text-neutral-700 dark:text-neutral-300 sm:text-xl`}
					style={{ animationDelay: '200ms' }}
				>
					{t('app_locale_test_page_Book_Cancel_Refund_Anytime_Anywhere')}
				</p>

				<div
					className={`${styles.fadeUp} mt-10`}
					style={{ animationDelay: '300ms' }}
				>
					<Link
						href={CTA_HREF}
						className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-xl hover:shadow-violet-500/30 dark:bg-white dark:text-neutral-900"
					>
						{t('app_locale_test_page_Plan_Your_Flexible_Trip')}
						<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>

				<ul
					className={`${styles.fadeUp} mt-10 flex flex-wrap justify-center gap-3`}
					style={{ animationDelay: '400ms' }}
				>
					{PERKS.map((key) => (
						<li
							key={key}
							className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-neutral-800 ring-1 ring-neutral-200 backdrop-blur dark:bg-neutral-900/50 dark:text-neutral-200 dark:ring-neutral-700"
						>
							<Check className="h-4 w-4 text-emerald-600" />
							{tPerks(key)}
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
