// Shared layout for the legal pages (legal notice, privacy, cookies, terms):
// title + last update, a table of contents and the text (Markdown).
// The legal wording itself lives in each page and is not changed here.
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getLocale, getTranslations } from 'next-intl/server'
import remarkGfm from 'remark-gfm'

type Props = {
	/** Translation key in the Legal namespace (title_notice, title_privacy…) */
	titleKey: string
	/** Markdown. A leading "# Title" and a "Last updated: …" line are taken out. */
	source: string
}

const textOf = (node: ReactNode): string =>
	typeof node === 'string' || typeof node === 'number'
		? String(node)
		: Array.isArray(node)
			? node.map(textOf).join('')
			: node && typeof node === 'object' && 'props' in node
				? textOf((node as any).props.children)
				: ''

const slug = (text: string) =>
	text
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')

const components = {
	h1: (props: any) => <h2 {...props} />,
	h2: ({ children }: any) => (
		<h2 id={slug(textOf(children))} className="scroll-mt-28">
			{children}
		</h2>
	),
	table: (props: any) => (
		<div className="not-prose my-6 overflow-x-auto rounded-2xl ring-1 ring-neutral-200 dark:ring-neutral-800">
			<table className="w-full min-w-[560px] text-left text-sm [&_td]:border-t [&_td]:border-neutral-200 [&_td]:px-4 [&_td]:py-3 [&_th]:bg-neutral-50 [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold dark:[&_td]:border-neutral-800 dark:[&_th]:bg-neutral-900 [&_a]:underline" {...props} />
		</div>
	),
	a: ({ href = '', ...props }: any) =>
		/^https?:/.test(href) ? <a href={href} target="_blank" rel="noopener noreferrer" {...props} /> : <a href={href} {...props} />,
}

export default async function LegalPage({ titleKey, source }: Props) {
	const t = await getTranslations('Legal')
	const locale = await getLocale()

	const updated = source.match(/^\s*Last updated:\s*(.+)$/m)?.[1]?.trim()
	const body = source
		.replace(/^\s*# .+$/m, '') // the page shows the title itself
		.replace(/^\s*Last updated:.*$/m, '')
	const sections = Array.from(body.matchAll(/^## (.+)$/gm), (m) => m[1].trim())

	const toc = (
		<ol className="space-y-1 text-sm">
			{sections.map((title) => (
				<li key={title}>
					<a href={`#${slug(title)}`} className="block rounded-lg px-3 py-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-900 dark:hover:text-white">
						{title}
					</a>
				</li>
			))}
		</ol>
	)

	return (
		<main className="pb-16 text-neutral-950 sm:pb-24 dark:text-white">
			<header className="mx-auto max-w-7xl px-5 pt-12 text-center sm:pt-20">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">{t('eyebrow')}</p>
				<h1 className="mx-auto mt-4 max-w-3xl text-[40px] font-bold leading-[1.05] tracking-tight [text-wrap:balance] sm:text-7xl">{t(titleKey)}</h1>
				{updated && <p className="mt-5 text-neutral-500">{t('updated', { date: updated })}</p>}
				{!locale.startsWith('en') && <p className="mx-auto mt-4 max-w-xl text-sm text-neutral-500">{t('english_only')}</p>}
			</header>

			<div className="mx-auto mt-12 grid max-w-6xl gap-10 px-5 sm:mt-16 lg:grid-cols-[240px_1fr] lg:gap-16">
				{sections.length > 2 && (
					<nav aria-label={t('contents')} className="lg:sticky lg:top-24 lg:max-h-[calc(100vh_-_8rem)] lg:self-start lg:overflow-y-auto">
						{/* Phones: folded away */}
						<details className="group rounded-2xl bg-neutral-100 lg:hidden dark:bg-neutral-900">
							<summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
								{t('contents')}
								<ChevronDown className="h-5 w-5 transition group-open:rotate-180" />
							</summary>
							<div className="px-2 pb-3">{toc}</div>
						</details>
						<div className="hidden lg:block">
							<p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">{t('contents')}</p>
							{toc}
						</div>
					</nav>
				)}

				<div className="min-w-0">
					<article lang="en" className="prose prose-neutral max-w-3xl dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-14 prose-h2:text-2xl sm:prose-h2:text-3xl prose-h3:text-xl prose-a:font-semibold prose-a:text-neutral-950 prose-a:underline-offset-4 prose-li:my-1 dark:prose-a:text-white">
						<MDXRemote source={body} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
					</article>

					<div className="mt-16 flex max-w-3xl flex-col items-start gap-4 rounded-[28px] bg-neutral-100 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9 dark:bg-neutral-900">
						<div>
							<p className="text-xl font-bold tracking-tight">{t('questions_title')}</p>
							<p className="mt-1 text-neutral-500">{t('questions_text')}</p>
						</div>
						<Link
							href={`/${locale}/contact` as any}
							className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
						>
							{t('contact_cta')}
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</div>
			</div>
		</main>
	)
}
