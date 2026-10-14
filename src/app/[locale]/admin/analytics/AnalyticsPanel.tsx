'use client'
// Analytics panel: live visitors (every 5 s), then reports for a time range,
// and any visit opened step by step.
import { Fragment, useCallback, useEffect, useState, type ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { AlertTriangle, ArrowRight, Eye, Globe2, Laptop, MousePointerClick, RefreshCw, Search, Smartphone, Tablet, UserPlus, X } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const RANGES = [
	[1, 'Today'],
	[7, '7 days'],
	[30, '30 days'],
	[90, '90 days'],
] as const

const flag = (code?: string | null) =>
	code && /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...Array.from(code).map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : '🌍'
const countryName = (code?: string | null) => {
	try {
		return code ? new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code : 'Unknown'
	} catch {
		return code ?? 'Unknown'
	}
}
const duration = (s: number) => {
	s = Math.round(s)
	if (s < 60) return `${s}s`
	if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`
	return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`
}
const pct = (x: number) => `${Math.round(x * 100)}%`
const time = (iso: string) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const clock = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const stripLocale = (p?: string | null) => (p ?? '').replace(/^\/[a-z]{2}-[A-Z]{2}(?=\/|$)/, '') || '/'
const DeviceIcon = ({ device }: { device?: string }) =>
	device === 'mobile' ? <Smartphone className="h-4 w-4" /> : device === 'tablet' ? <Tablet className="h-4 w-4" /> : <Laptop className="h-4 w-4" />

async function load(url: string) {
	const res = await fetch(url, { cache: 'no-store' })
	if (!res.ok) throw new Error(String(res.status))
	return res.json()
}

export default function AnalyticsPanel() {
	const [days, setDays] = useState(7)
	const [live, setLive] = useState<any[] | null>(null)
	const [data, setData] = useState<any | null>(null)
	const [error, setError] = useState('')
	const [visitId, setVisitId] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const refreshReport = useCallback(() => {
		setLoading(true)
		load(`/api/analytics?view=report&days=${days}`)
			.then((d) => {
				setData(d)
				setError('')
			})
			.catch(() => setError('Could not load the report.'))
			.finally(() => setLoading(false))
	}, [days])

	useEffect(() => {
		refreshReport()
		const timer = setInterval(refreshReport, 60_000)
		return () => clearInterval(timer)
	}, [refreshReport])

	useEffect(() => {
		const tick = () => load('/api/analytics?view=live').then(setLive).catch(() => {})
		tick()
		const timer = setInterval(tick, 5_000)
		return () => clearInterval(timer)
	}, [])

	const k = data?.kpis

	return (
		<div className="mx-auto max-w-7xl px-5 pb-24 pt-8 text-neutral-950 sm:pt-12 dark:text-white">
			<header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">TRAVSUS</p>
					<h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Analytics</h1>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex rounded-full bg-neutral-100 p-1 dark:bg-neutral-900">
						{RANGES.map(([value, label]) => (
							<button
								key={value}
								type="button"
								onClick={() => setDays(value)}
								className={`rounded-full px-4 py-2 text-sm font-semibold transition ${days === value ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400'}`}
							>
								{label}
							</button>
						))}
					</div>
					<button type="button" onClick={refreshReport} aria-label="Refresh" className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 dark:bg-neutral-900">
						<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
					</button>
				</div>
			</header>

			{/* Live */}
			<section className="mt-10 rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8">
				<div className="flex items-center justify-between gap-4">
					<h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
						<span className="relative flex h-3 w-3">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
							<span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
						</span>
						{live ? `${live.length} online now` : 'Live'}
					</h2>
					<p className="text-sm text-white/50">Updates every 5 seconds</p>
				</div>
				{live && live.length > 0 ? (
					<div className="mt-6 overflow-x-auto">
						<table className="w-full min-w-[760px] text-left text-sm">
							<thead className="text-white/50">
								<tr>
									<th className="pb-3 font-medium">Where</th>
									<th className="pb-3 font-medium">Page now</th>
									<th className="pb-3 font-medium">Scroll</th>
									<th className="pb-3 font-medium">On site</th>
									<th className="pb-3 font-medium">Pages</th>
									<th className="pb-3 font-medium">Came from</th>
									<th className="pb-3 font-medium">Device</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/10">
								{live.map((v) => (
									<tr key={v.id} onClick={() => setVisitId(v.id)} className="cursor-pointer hover:bg-white/5">
										<td className="py-3 pr-4">
											<span className="mr-2">{flag(v.country)}</span>
											{v.city ? `${v.city}, ` : ''}
											{countryName(v.country)}
											{v.email && <span className="block text-xs text-emerald-300">{v.email}</span>}
										</td>
										<td className="max-w-[260px] py-3 pr-4">
											<span className="block truncate font-medium">{v.current_title || stripLocale(v.current_path)}</span>
											<span className="block truncate text-xs text-white/50">{stripLocale(v.current_path)}</span>
										</td>
										<td className="py-3 pr-4">
											<div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/15">
												<div className="h-full rounded-full bg-emerald-400" style={{ width: `${v.current_scroll ?? 0}%` }} />
											</div>
											<span className="text-xs text-white/50">{v.current_scroll ?? 0}%</span>
										</td>
										<td className="py-3 pr-4 tabular-nums">{duration(v.on_site_seconds)}</td>
										<td className="py-3 pr-4 tabular-nums">
											{v.pageviews}
											{v.errors > 0 && <span className="ml-2 text-amber-300">⚠ {v.errors}</span>}
										</td>
										<td className="py-3 pr-4">{v.source ?? 'direct'}</td>
										<td className="py-3 pr-4">
											<span className="inline-flex items-center gap-1.5">
												<DeviceIcon device={v.device} />
												{v.browser}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="mt-6 text-white/50">{live ? 'Nobody on the site right now.' : 'Loading…'}</p>
				)}
			</section>

			{error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-red-700">{error}</p>}

			{k && (
				<>
					{/* Key numbers */}
					<section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
						{[
							['Visits', k.visits.toLocaleString()],
							['Visitors', k.visitors.toLocaleString()],
							['Page views', k.pageviews.toLocaleString()],
							['Pages / visit', k.pagesPerVisit.toFixed(1)],
							['Avg. visit', duration(k.avgVisitSeconds)],
							['Bounce rate', pct(k.bounceRate)],
							['Avg. scroll', `${Math.round(k.avgScroll)}%`],
							['New accounts', k.newAccounts.toLocaleString()],
							['Errors', k.errors.toLocaleString()],
							['Visits with errors', k.visitsWithErrors.toLocaleString()],
							['Consent given', pct(k.consentRate)],
						].map(([label, value]) => (
							<div key={label} className="rounded-3xl bg-neutral-100 p-5 dark:bg-neutral-900">
								<p className="text-xs font-medium text-neutral-500">{label}</p>
								<p className="mt-2 text-2xl font-bold tabular-nums tracking-tight">{value}</p>
							</div>
						))}
					</section>

					{/* Visits over time */}
					<Card title="Visits over time" className="mt-4">
						<div className="h-72">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={data.timeline} margin={{ left: -20, right: 8, top: 8 }}>
									<defs>
										<linearGradient id="visits" x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stopColor="#0a0a0a" stopOpacity={0.25} />
											<stop offset="100%" stopColor="#0a0a0a" stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
									<XAxis dataKey="time" tickFormatter={(t: string) => (days <= 1 ? t.slice(11, 16) : t.slice(5))} fontSize={12} tickLine={false} axisLine={false} minTickGap={24} />
									<YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
									<Tooltip />
									<Area type="monotone" dataKey="pageviews" name="Page views" stroke="#a3a3a3" fill="transparent" strokeWidth={2} />
									<Area type="monotone" dataKey="visits" name="Visits" stroke="#0a0a0a" fill="url(#visits)" strokeWidth={2.5} />
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</Card>

					<div className="mt-4 grid gap-4 lg:grid-cols-3">
						<Card title="Countries" icon={<Globe2 className="h-4 w-4" />}>
							<Bars rows={data.countries.map((r: any) => ({ ...r, label: `${flag(r.name)} ${countryName(r.name === 'Unknown' ? null : r.name)}` }))} />
						</Card>
						<Card title="Sources">
							<Bars rows={data.sources} />
						</Card>
						<Card title="Cities">
							<Bars rows={data.cities} />
						</Card>
						<Card title="Devices">
							<Bars rows={data.devices} />
						</Card>
						<Card title="Browsers">
							<Bars rows={data.browsers} />
						</Card>
						<Card title="Systems">
							<Bars rows={data.systems} />
						</Card>
					</div>

					{/* Funnel */}
					<Card title="Booking funnel" className="mt-4">
						<div className="grid gap-3 sm:grid-cols-4">
							{data.funnel.map((step: any, i: number) => (
								<div key={step.step} className="rounded-2xl bg-neutral-100 p-5 dark:bg-neutral-900">
									<p className="text-xs font-medium text-neutral-500">{step.step}</p>
									<p className="mt-2 text-3xl font-bold tabular-nums">{step.count.toLocaleString()}</p>
									{i > 0 && <p className="mt-1 text-xs text-neutral-500">{data.funnel[0].count ? pct(step.count / data.funnel[0].count) : '0%'} of visits</p>}
								</div>
							))}
						</div>
					</Card>

					{/* Pages */}
					<Card title="Pages" icon={<Eye className="h-4 w-4" />} className="mt-4">
						<Table
							head={['Page', 'Views', 'Avg. time', 'Avg. scroll']}
							rows={data.pages.map((p: any) => [<span key="p" className="block max-w-[420px] truncate">{p.path}</span>, p.views, duration(p.avgSeconds), `${Math.round(p.avgScroll)}%`])}
						/>
					</Card>

					<div className="mt-4 grid gap-4 lg:grid-cols-2">
						<Card title="Entry pages">
							<Bars rows={data.entryPages} />
						</Card>
						<Card title="Campaigns (utm_campaign)">
							<Bars rows={data.campaigns} empty="No campaign links used." />
						</Card>
						<Card title="Searches" icon={<Search className="h-4 w-4" />}>
							<Bars rows={data.searches} empty="No searches." />
						</Card>
						<Card title="Most clicked" icon={<MousePointerClick className="h-4 w-4" />}>
							<Bars rows={data.clicks} empty="No clicks yet." />
						</Card>
					</div>

					{/* Problems */}
					<Card title="Problems visitors hit" icon={<AlertTriangle className="h-4 w-4" />} className="mt-4">
						<Table
							head={['Error', 'Times', 'Visits', 'Last page', 'Last seen']}
							rows={data.errors.map((e: any) => [<span key="m" className="block max-w-[420px] truncate font-mono text-xs">{e.message}</span>, e.count, e.visits, e.lastPath, time(e.last)])}
							empty="No errors. 🎉"
						/>
					</Card>

					{/* Sign-ups */}
					<Card title="New accounts" icon={<UserPlus className="h-4 w-4" />} className="mt-4">
						<Table
							head={['Email', 'Created', 'Country', 'Came from', 'Visits before', 'First page']}
							rows={data.signups.map((s: any) => [s.email, time(s.createdAt), s.country ? `${flag(s.country)} ${countryName(s.country)}` : '—', s.source ?? '—', s.visitsBefore || '—', s.landing ? stripLocale(s.landing) : '—'])}
							empty="No new accounts in this period."
						/>
						<p className="mt-3 text-xs text-neutral-500">Country and source are known only when the person accepted measurement cookies.</p>
					</Card>

					{/* Recent visits */}
					<Card title="Recent visits" className="mt-4">
						<ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
							{data.recent.map((v: any) => (
								<li key={v.id}>
									<button type="button" onClick={() => setVisitId(v.id)} className="flex w-full flex-col gap-1 py-4 text-left transition hover:bg-neutral-50 sm:flex-row sm:items-center sm:gap-4 dark:hover:bg-neutral-900">
										<span className="w-40 shrink-0 text-sm text-neutral-500">{time(v.started_at)}</span>
										<span className="w-48 shrink-0 text-sm">
											{flag(v.country)} {v.city ?? countryName(v.country)}
											{v.email && <span className="block truncate text-xs text-emerald-600">{v.email}</span>}
											{v.returning && <span className="block text-xs text-neutral-500">Returning visitor</span>}
										</span>
										<span className="min-w-0 flex-1 truncate text-sm">{v.pages.length ? v.pages.join('  →  ') : v.landing}</span>
										<span className="flex shrink-0 items-center gap-3 text-sm text-neutral-500">
											{v.errors > 0 && <span className="text-amber-600">⚠ {v.errors}</span>}
											<DeviceIcon device={v.device} />
											{v.source}
											<span className="tabular-nums">{duration(v.duration)}</span>
											<ArrowRight className="h-4 w-4" />
										</span>
									</button>
								</li>
							))}
							{data.recent.length === 0 && <li className="py-6 text-neutral-500">No visits yet in this period.</li>}
						</ul>
					</Card>
				</>
			)}

			<VisitDrawer id={visitId} onClose={() => setVisitId(null)} />
		</div>
	)
}

function Card({ title, icon, className = '', children }: { title: string; icon?: ReactNode; className?: string; children: ReactNode }) {
	return (
		<section className={`rounded-[28px] p-6 ring-1 ring-neutral-200 dark:ring-neutral-800 ${className}`}>
			<h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
				{icon}
				{title}
			</h2>
			<div className="mt-5">{children}</div>
		</section>
	)
}

function Bars({ rows, empty = 'No data yet.' }: { rows: { name: string; label?: string; count: number }[]; empty?: string }) {
	if (!rows?.length) return <p className="text-sm text-neutral-500">{empty}</p>
	const max = Math.max(...rows.map((r) => r.count))
	return (
		<ul className="space-y-2.5">
			{rows.slice(0, 10).map((r) => (
				<li key={r.name}>
					<div className="flex items-center justify-between gap-3 text-sm">
						<span className="min-w-0 truncate">{r.label ?? r.name}</span>
						<span className="shrink-0 font-semibold tabular-nums">{r.count.toLocaleString()}</span>
					</div>
					<div className="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
						<div className="h-full rounded-full bg-neutral-950 dark:bg-white" style={{ width: `${(r.count / max) * 100}%` }} />
					</div>
				</li>
			))}
		</ul>
	)
}

function Table({ head, rows, empty = 'No data yet.' }: { head: string[]; rows: ReactNode[][]; empty?: string }) {
	if (!rows.length) return <p className="text-sm text-neutral-500">{empty}</p>
	return (
		<div className="overflow-x-auto">
			<table className="w-full min-w-[640px] text-left text-sm">
				<thead className="text-neutral-500">
					<tr>
						{head.map((h) => (
							<th key={h} className="pb-3 pr-4 font-medium">
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
					{rows.map((row, i) => (
						<tr key={i}>
							{row.map((cell, j) => (
								<td key={j} className="py-2.5 pr-4 tabular-nums">
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

/** One visit: who, from where, and every step with time spent and scroll. */
function VisitDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
	const [visit, setVisit] = useState<any | null>(null)
	useEffect(() => {
		setVisit(null)
		if (id) load(`/api/analytics?view=visit&id=${encodeURIComponent(id)}`).then(setVisit).catch(() => setVisit({ error: true }))
	}, [id])
	const s = visit?.session

	return (
		<Transition show={!!id} as={Fragment}>
			<Dialog className="relative z-50" onClose={onClose}>
				<Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
					<div className="fixed inset-0 bg-black/40" />
				</Transition.Child>
				<div className="fixed inset-0 flex justify-end">
					<Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="translate-x-full" enterTo="translate-x-0" leave="ease-in duration-150" leaveFrom="translate-x-0" leaveTo="translate-x-full">
						<Dialog.Panel className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 text-neutral-950 shadow-2xl sm:p-8 dark:bg-neutral-950 dark:text-white">
							<div className="flex items-center justify-between">
								<Dialog.Title className="text-2xl font-bold tracking-tight">Visit</Dialog.Title>
								<button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 dark:bg-neutral-900">
									<X className="h-4 w-4" />
								</button>
							</div>
							{!visit ? (
								<p className="mt-6 text-neutral-500">Loading…</p>
							) : visit.error ? (
								<p className="mt-6 text-red-600">Could not load this visit.</p>
							) : (
								<>
									<dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
										{[
											['Where', `${flag(s.country)} ${[s.city, s.region, countryName(s.country)].filter(Boolean).join(', ')}`],
											['Account', s.email ?? (s.consent ? 'Not signed in' : 'Anonymous (no consent)')],
											['Account created', s.accountCreated ? time(s.accountCreated) : '—'],
											['Visits by this person', visit.visits ?? '—'],
											['Came from', `${s.source ?? 'direct'} / ${s.medium ?? 'none'}${s.campaign ? ` · ${s.campaign}` : ''}`],
											['Referrer', s.referrer || '—'],
											['Device', `${s.device} · ${s.browser} · ${s.os}`],
											['Screen / language', `${s.screen ?? '—'} · ${s.locale ?? '—'}`],
											['Started', time(s.started_at)],
											['Last seen', time(s.last_seen_at)],
										].map(([label, value]) => (
											<div key={label as string} className="rounded-2xl bg-neutral-100 p-3 dark:bg-neutral-900">
												<dt className="text-xs text-neutral-500">{label}</dt>
												<dd className="mt-0.5 break-words font-medium">{value}</dd>
											</div>
										))}
									</dl>
									<h3 className="mt-8 font-bold">Step by step</h3>
									<ol className="mt-4 space-y-3 border-l-2 border-neutral-200 pl-5 dark:border-neutral-800">
										{visit.events.map((e: any, i: number) => (
											<li key={i} className="relative text-sm">
												<span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ${e.type === 'error' ? 'bg-amber-500' : e.type === 'pageview' ? 'bg-neutral-950 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
												<span className="text-xs text-neutral-500">{clock(e.created_at)}</span>
												{e.type === 'pageview' && <p className="font-semibold">Opened {stripLocale(e.path)}</p>}
												{e.type === 'leave' && (
													<p className="text-neutral-600 dark:text-neutral-400">
														Left after {duration((e.duration_ms ?? 0) / 1000)}, scrolled {e.scroll ?? 0}%
													</p>
												)}
												{e.type === 'click' && <p>Clicked “{e.data?.text || e.data?.href}”</p>}
												{e.type === 'search' && <p>Searched “{e.data?.q}”</p>}
												{e.type === 'error' && (
													<p className="text-amber-700 dark:text-amber-400">
														Error: <span className="font-mono text-xs">{e.data?.message}</span>
													</p>
												)}
											</li>
										))}
									</ol>
								</>
							)}
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	)
}
