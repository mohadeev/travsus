// TripAdvisor-style hero: a big "Where to?" and one search bar, nothing else.
import { Search } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import styles from './home.module.css'

export default function HomeHero() {
	const t = useTranslations('Home')
	const tSeo = useTranslations('HomeSeo')
	const locale = useLocale()

	return (
		<section className={`${styles.heroIn} mx-auto max-w-4xl px-5 pb-4 pt-10 text-center sm:pb-10 sm:pt-20`}>
			{/* The page's main heading says what we offer (for search engines and screen readers) */}
			<h1 className="sr-only">{tSeo('h1')}</h1>
			<p className="text-[44px] font-black leading-none tracking-tight text-neutral-950 sm:text-7xl dark:text-white">{t('where_to')}</p>

			{/* Plain form: works before JavaScript loads */}
			<form
				action={`/${locale}/search`}
				method="get"
				role="search"
				className="mx-auto mt-7 flex max-w-3xl items-center gap-2 rounded-full border border-neutral-300 bg-white p-1.5 pl-4 text-neutral-950 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.3)] transition focus-within:border-neutral-950 sm:mt-10 sm:p-2 sm:pl-6 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
			>
				<Search className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
				<label className="min-w-0 flex-1">
					<span className="sr-only">{t('search_label')}</span>
					<input
						type="search"
						name="query"
						placeholder={t('search_placeholder')}
						className="w-full border-0 bg-transparent p-0 py-2.5 text-base placeholder:text-neutral-500 focus:outline-none focus:ring-0 sm:py-3 sm:text-lg"
					/>
				</label>
				<button
					type="submit"
					className="shrink-0 rounded-full bg-neutral-950 px-5 py-3 text-[15px] font-bold text-white transition hover:bg-neutral-800 active:scale-95 sm:px-8 sm:py-3.5 sm:text-base dark:bg-white dark:text-neutral-950"
				>
					{t('search_cta')}
				</button>
			</form>
		</section>
	)
}
