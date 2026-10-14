// Contact: ways to reach us (email, phone, Instagram) and a message form.
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Instagram, Mail, MessageCircle, Phone } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { companyProfile } from '@/constants/companyProfile'
import { routing } from '@/i18n/routing'
import ContactForm from './ContactForm'

type PageProps = { params: { locale: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const t = await getTranslations({ locale: params.locale, namespace: 'Contact' })
	return {
		title: `${t('meta_title')} | TRAVSUS`,
		description: t('meta_description'),
		alternates: {
			canonical: `/${params.locale}/contact`,
			languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/contact`])),
		},
	}
}

export default async function ContactPage({ params }: PageProps) {
	const { locale } = params
	setRequestLocale(locale)
	const t = await getTranslations('Contact')
	const email: string = companyProfile.contactEmail
	const phone: string | undefined = companyProfile.contactPhone

	const channels = [
		{ icon: Mail, label: t('email'), value: email, href: `mailto:${email}` },
		phone ? { icon: Phone, label: t('phone'), value: phone, href: `tel:${phone.replace(/[^\d+]/g, '')}` } : null,
		{ icon: Instagram, label: 'Instagram', value: '@travsusofficial', href: 'https://www.instagram.com/travsusofficial' },
	].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string }[]

	return (
		<main className="pb-16 text-neutral-950 sm:pb-24 dark:text-white [&_h1]:[text-wrap:balance]">
			<section className="mx-auto max-w-7xl px-5 pt-12 text-center sm:pt-20">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">{t('eyebrow')}</p>
				<h1 className="mx-auto mt-4 max-w-4xl text-[40px] font-bold leading-[1.04] tracking-tight sm:text-7xl">{t('hero_title')}</h1>
				<p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-500 sm:text-2xl">{t('hero_text')}</p>
			</section>

			{/* Ways to reach us */}
			<ul className="mx-auto mt-12 grid max-w-5xl gap-3 px-5 sm:mt-16 sm:grid-cols-3 sm:gap-4">
				{channels.map(({ icon: Icon, label, value, href }) => (
					<li key={label}>
						<a
							href={href}
							{...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
							className="group flex h-full items-center gap-4 rounded-3xl bg-neutral-100 p-5 transition hover:bg-neutral-200 sm:flex-col sm:items-start sm:p-7 dark:bg-neutral-900 dark:hover:bg-neutral-800"
						>
							<span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white dark:bg-neutral-950">
								<Icon className="h-5 w-5" />
							</span>
							<span className="min-w-0">
								<span className="block text-sm text-neutral-500">{label}</span>
								<span className="block truncate font-semibold group-hover:underline">{value}</span>
							</span>
						</a>
					</li>
				))}
			</ul>

			{/* Message form */}
			<section className="mx-auto mt-16 grid max-w-5xl gap-10 px-5 sm:mt-24 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
				<div>
					<h2 className="text-3xl font-bold tracking-tight sm:text-5xl">{t('form_title')}</h2>
					<p className="mt-4 text-lg text-neutral-500">{t('form_text')}</p>
					<Link
						href={`/${locale}/forum` as any}
						className="mt-8 inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white"
					>
						<MessageCircle className="h-4 w-4" />
						{t('forum_cta')}
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
				<ContactForm email={email} />
			</section>
		</main>
	)
}
