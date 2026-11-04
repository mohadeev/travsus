// "Book with confidence": who we are and what protects the traveler, with
// real facts only (the registered company, Stripe, free cancellation, how to
// reach us). Never add a badge, licence or number we don't really have.
import Link from 'next/link'
import { Building2, Headphones, Lock, Mail, MessageCircle, Phone, ShieldCheck, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import { companyProfile } from '@/constants/companyProfile'
import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_PHONE_TEL } from '@/constants/contact'
import styles from './home.module.css'

const WHATSAPP = `https://wa.me/${SUPPORT_PHONE.replace(/\D/g, '')}`

function Card({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
	return (
		<li className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-950">
			<span className="grid h-11 w-11 place-items-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
				<Icon className="h-5 w-5" aria-hidden />
			</span>
			<h3 className="mt-4 font-bold">{title}</h3>
			<div className="mt-1.5 flex flex-1 flex-col text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">{children}</div>
		</li>
	)
}

const contactLink = 'inline-flex items-center gap-2 font-medium text-neutral-950 underline-offset-4 hover:underline dark:text-white'

export default function TrustSection() {
	const t = useTranslations('Trust')

	return (
		<section className={styles.reveal} aria-labelledby="trust-title">
			<h2 id="trust-title" className="headline text-2xl sm:text-[32px]">
				{t('title')}
			</h2>
			<p className="mt-1 text-sm text-neutral-500 sm:mt-2 sm:text-base">{t('sub')}</p>

			<ul className={`${styles.stagger} mt-5 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4`}>
				<Card icon={ShieldCheck} title={t('cancel_title')}>
					<p>{t('cancel_text')}</p>
				</Card>
				<Card icon={Lock} title={t('pay_title')}>
					<p>{t('pay_text')}</p>
				</Card>
				<Card icon={Headphones} title={t('help_title')}>
					<p>{t('help_text')}</p>
					<div className="mt-3 flex flex-col items-start gap-1.5 text-sm">
						<a href={SUPPORT_PHONE_TEL} className={contactLink}>
							<Phone className="h-4 w-4" aria-hidden />
							{SUPPORT_PHONE}
						</a>
						<a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={contactLink}>
							<MessageCircle className="h-4 w-4" aria-hidden />
							WhatsApp
						</a>
						<a href={`mailto:${SUPPORT_EMAIL}`} className={contactLink}>
							<Mail className="h-4 w-4" aria-hidden />
							{SUPPORT_EMAIL}
						</a>
					</div>
				</Card>
				<Card icon={Building2} title={t('company_title')}>
					<p>{t('company_text', { number: companyProfile.registrationNumber ?? '' })}</p>
					<Link href={'/legal-notice' as Route} className={`${contactLink} mt-3 text-sm`}>
						{t('company_link')}
					</Link>
				</Card>
			</ul>
		</section>
	)
}
