// /robots.txt — open to search engines and AI assistants, private areas excluded.
import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL || 'https://www.travsus.com'
).replace(/\/$/, '')

// Account, admin, checkout and test pages (with or without a /{locale} prefix)
const PRIVATE = [
	'account',
	'account-billing',
	'account-savelists',
	'account-settings',
	'dashboard',
	'checkout',
	'bookings',
	'pay-done',
	'add-listing',
	'cms-admin',
	'service-editor',
	'edite-tours',
	'edite-reviews',
	'editor',
	'tours',
	'sign-in',
	'sign-up',
	'rights',
	'email',
	'testing',
	'trans-test',
	'screen-shot',
	'analyze',
	'not-tracking',
	'coming-soon',
]
// Listed per locale on purpose: in robots.txt "*" also matches "/", so a
// pattern like "/*/tours" would block every tour page (/en-US/…/tours/…).
const disallow = [
	'/api/',
	...PRIVATE.flatMap((p) => [
		`/${p}`,
		...routing.locales.map((l) => `/${l}/${p}`),
	]),
]

// AI crawlers are welcome: they help travelers find our tours in AI answers
const AI_BOTS = [
	'GPTBot',
	'OAI-SearchBot',
	'ChatGPT-User',
	'ClaudeBot',
	'Claude-User',
	'Claude-SearchBot',
	'anthropic-ai',
	'PerplexityBot',
	'Perplexity-User',
	'Google-Extended',
	'Applebot',
	'Applebot-Extended',
	'Bingbot',
	'DuckAssistBot',
	'meta-externalagent',
	'CCBot',
]

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{ userAgent: '*', allow: '/', disallow },
			{ userAgent: AI_BOTS, allow: '/', disallow },
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	}
}
