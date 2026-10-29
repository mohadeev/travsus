// Admin home: a few live numbers, then one card per tool.
import Link from 'next/link'
import { ArrowUpRight, BarChart3, Building2, Handshake, MessageCircle, Store, Languages, Mail, MapPin } from 'lucide-react'
import { db, T } from '@/lib/db'
import { liveVisitors } from '@/lib/analytics/report'
import { readAll } from '@/lib/admin/translations'
import { dashboardScope, overview } from '@/lib/dashboard'
import { TEMPLATES } from '@/lib/email/templates'
import { emailConfigured } from '@/lib/email/send'

const euros = (n: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
const ago = (days: number) => new Date(Date.now() - days * 86400_000).toISOString()
/** A failing number shows "–" instead of breaking the page */
const safe = <V,>(p: Promise<V>) => p.catch(() => null)

/** Texts that exist in English but are empty or missing in another language */
async function missingTexts() {
	const all = await readAll()
	const base = all['en-US'] ?? {}
	let missing = 0
	for (const [locale, messages] of Object.entries(all)) {
		if (locale === 'en-US') continue
		for (const [group, keys] of Object.entries(base))
			for (const key of Object.keys(keys)) {
				const v = messages[group]?.[key]
				if (!(Array.isArray(v) ? v.length : typeof v === 'string' && v.trim())) missing++
			}
	}
	return { missing, languages: Object.keys(all).length }
}

async function stats() {
	const scope = await dashboardScope()
	const [live, visits, accounts, texts, business, affiliates, agencies, outreach] = await Promise.all([
		safe(liveVisitors()),
		safe(Promise.resolve(db.from(T.analyticsSessions).select('id', { count: 'exact', head: true }).gte('started_at', ago(1)))),
		safe(Promise.resolve(db.from(T.users).select('id', { count: 'exact', head: true }).gte('createdAt', ago(7)))),
		safe(missingTexts()),
		scope ? safe(overview(scope)) : null,
		safe(Promise.resolve(db.from(T.affiliates).select('id', { count: 'exact', head: true }).eq('status', 'pending'))),
		safe(Promise.resolve(db.from(T.agencies).select('id', { count: 'exact', head: true }).eq('status', 'pending'))),
		safe(Promise.resolve(db.from(T.outreach).select('id', { count: 'exact', head: true }))),
	])
	return { live, visits: visits?.count ?? null, accounts: accounts?.count ?? null, texts, business, pendingAffiliates: affiliates?.count ?? null, pendingAgencies: agencies?.count ?? null, outreach: outreach?.count ?? null }
}

export default async function AdminHome({ params }: { params: { locale: string } }) {
	const s = await stats()
	const href = (path: string) => `/${params.locale}${path}` as any
	const dash = (v: unknown) => (v === null || v === undefined ? '–' : String(v))

	const numbers: [string, string, string?][] = [
		['Online now', dash(s.live?.length), s.live?.length ? s.live.slice(0, 3).map((v: any) => v.country).filter(Boolean).join(', ') : undefined],
		['Visits, 24 h', dash(s.visits)],
		['New accounts, 7 days', dash(s.accounts)],
		['Revenue, 30 days', s.business ? euros(s.business.revenue30) : '–', s.business ? `${s.business.upcomingCount} upcoming trips` : undefined],
	]

	const tools: [string, string, string, typeof BarChart3, string?][] = [
		['Analytics', 'Live visitors, where they come from, what they read and where they drop off.', '/admin/analytics', BarChart3, s.live ? `${s.live.length} online now` : undefined],
		['Site texts', 'Every text of the site in all languages: edit, translate, add.', '/admin/translations', Languages, s.texts ? (s.texts.missing ? `${s.texts.missing} missing translations` : `All ${s.texts.languages} languages complete`) : undefined],
		['Places', 'Countries, cities and places: photos, descriptions, new places.', '/cms-admin', MapPin],
		['Affiliates', 'Access requests from the affiliates page: accept or decline, set commissions.', '/admin/affiliates', Handshake, s.pendingAffiliates ? `${s.pendingAffiliates} to review` : s.pendingAffiliates === 0 ? 'Nothing to review' : undefined],
		['Outreach', 'Everyone you talk to about becoming an affiliate (Instagram DMs): status, follow-ups and notes.', '/admin/outreach', MessageCircle, s.outreach ? `${s.outreach} people` : undefined],
		['Agencies', 'Tour agencies and guides asking to list their tours: accept or decline.', '/admin/agencies', Store, s.pendingAgencies ? `${s.pendingAgencies} to review` : s.pendingAgencies === 0 ? 'Nothing to review' : undefined],
		['Emails', 'Every email the site sends: preview, when it goes out, test sends, booking PDF.', '/admin/emails', Mail, emailConfigured() ? `${Object.keys(TEMPLATES).length} emails` : 'Brevo key missing'],
		['Business dashboard', 'All of TRAVSUS: bookings, customers, revenue and tours.', '/dashboard', Building2, s.business ? `${s.business.unpaidCount} unpaid bookings` : undefined],
	]

	return (
		<div className="mx-auto max-w-7xl px-5 pb-24 pt-8 text-neutral-950 sm:pt-12 dark:text-white">
			<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">TRAVSUS</p>
			<h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Admin</h1>
			<p className="mt-2 text-lg text-neutral-500">Everything you run the site with, in one place.</p>

			<dl className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
				{numbers.map(([label, value, note], i) => (
					<div key={label} className="rounded-3xl bg-neutral-100 p-5 dark:bg-neutral-900">
						<dt className="flex items-center gap-2 text-sm font-medium text-neutral-500">
							{i === 0 && (
								<span className="relative flex h-2 w-2">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
									<span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
								</span>
							)}
							{label}
						</dt>
						<dd className="mt-2 text-3xl font-bold tabular-nums tracking-tight">{value}</dd>
						{note && <dd className="mt-1 truncate text-xs text-neutral-500">{note}</dd>}
					</div>
				))}
			</dl>

			<div className="mt-10 grid gap-4 sm:grid-cols-2">
				{tools.map(([title, text, path, Icon, badge]) => (
					<Link
						key={path}
						href={href(path)}
						className="group relative flex flex-col rounded-[28px] p-6 ring-1 ring-neutral-200 transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:ring-neutral-950 sm:p-8 dark:ring-neutral-800 dark:hover:ring-white"
					>
						<span className="grid h-12 w-12 place-items-center rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
							<Icon className="h-6 w-6" />
						</span>
						<ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-950 sm:right-8 sm:top-8 dark:group-hover:text-white" />
						<h2 className="mt-6 text-2xl font-bold tracking-tight">{title}</h2>
						<p className="mt-1.5 text-neutral-500">{text}</p>
						{badge && <span className="mt-5 inline-flex w-fit rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">{badge}</span>}
					</Link>
				))}
			</div>
		</div>
	)
}
