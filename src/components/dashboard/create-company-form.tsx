'use client'
// Create a company: what kind of business, then its details. On success the
// dashboard opens with the new company.
import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Building2, Check, FileText, Globe, Hotel, Loader2, Mail, MapPin, Phone, Plane, User } from 'lucide-react'

const TYPES = [
	['TRAVEL_AGENCY', Plane, 'Tour operator / travel agency', 'You run tours, day trips or multi-day itineraries.'],
	['STAY', Hotel, 'Hotel / stay', 'You offer rooms, riads, camps or other places to stay.'],
] as const

/** Every country name in English, A–Z (from the browser's own list). */
function useCountries() {
	return useMemo(() => {
		const names = new Intl.DisplayNames(['en'], { type: 'region' })
		const list: string[] = []
		for (let a = 65; a <= 90; a++)
			for (let b = 65; b <= 90; b++) {
				const code = String.fromCharCode(a, b)
				const name = names.of(code)
				if (name && name !== code && !/Unknown|Pseudo|Outlying|European Union|Eurozone|United Nations/.test(name)) list.push(name)
			}
		return Array.from(new Set(list)).sort((x, y) => x.localeCompare(y))
	}, [])
}

const input =
	'h-12 w-full rounded-2xl border-0 bg-neutral-100 pl-11 pr-4 text-base ring-1 ring-transparent transition placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:bg-neutral-950 dark:focus:ring-white'

function Field({ label, icon: Icon, hint, children }: { label: string; icon: typeof Mail; hint?: string; children: ReactNode }) {
	return (
		<label className="block">
			<span className="mb-1.5 block text-sm font-medium">{label}</span>
			<span className="relative block">
				<Icon className="pointer-events-none absolute left-4 top-[15px] h-[18px] w-[18px] text-neutral-400" />
				{children}
			</span>
			{hint && <span className="mt-1.5 block text-xs text-neutral-500">{hint}</span>}
		</label>
	)
}

export function CreateCompanyForm() {
	const router = useRouter()
	const locale = useLocale()
	const countries = useCountries()
	const [type, setType] = useState<string>('TRAVEL_AGENCY')
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')

	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const form = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
		setBusy(true)
		setError('')
		const res = await fetch('/api/dashboard/company/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...form, type }),
		}).catch(() => null)
		const data = await res?.json().catch(() => null)
		if (res?.ok) {
			router.push(`/${locale}/dashboard` as any)
			router.refresh()
			return
		}
		setError(data?.message || 'Something went wrong. Please try again.')
		setBusy(false)
	}

	return (
		<form onSubmit={submit} className="space-y-10">
			{/* Kind of business */}
			<section>
				<h2 className="text-lg font-bold tracking-tight">What kind of business is it?</h2>
				<div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Company type">
					{TYPES.map(([value, Icon, title, text]) => {
						const selected = type === value
						return (
							<button
								key={value}
								type="button"
								role="radio"
								aria-checked={selected}
								onClick={() => setType(value)}
								className={`relative flex items-start gap-4 rounded-3xl p-5 text-left transition ${selected ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800'}`}
							>
								<span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${selected ? 'bg-white/15 dark:bg-neutral-950/10' : 'bg-white dark:bg-neutral-950'}`}>
									<Icon className="h-6 w-6" />
								</span>
								<span className="min-w-0 pr-6">
									<span className="block font-semibold">{title}</span>
									<span className={`mt-1 block text-sm ${selected ? 'opacity-70' : 'text-neutral-500'}`}>{text}</span>
								</span>
								{selected && (
									<span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white">
										<Check className="h-4 w-4" strokeWidth={3} />
									</span>
								)}
							</button>
						)
					})}
				</div>
			</section>

			{/* Company */}
			<section className="space-y-5">
				<h2 className="text-lg font-bold tracking-tight">Company</h2>
				<Field label="Company name" icon={Building2}>
					<input name="name" required minLength={2} maxLength={120} autoComplete="organization" placeholder="e.g. Sahara Trails" className={input} />
				</Field>
				<div className="grid gap-5 sm:grid-cols-2">
					<Field label="Country" icon={Globe}>
						<input name="country" list="company-countries" maxLength={80} autoComplete="country-name" placeholder="Start typing…" className={input} />
						<datalist id="company-countries">
							{countries.map((c) => (
								<option key={c} value={c} />
							))}
						</datalist>
					</Field>
					<Field label="Registration number" icon={FileText} hint="Optional. Shown on invoices.">
						<input name="registrationNumber" maxLength={60} placeholder="Company registration no." className={input} />
					</Field>
				</div>
				<Field label="Address" icon={MapPin}>
					<input name="address" maxLength={300} autoComplete="street-address" placeholder="Street, city, postcode" className={input} />
				</Field>
			</section>

			{/* Contact */}
			<section className="space-y-5">
				<h2 className="text-lg font-bold tracking-tight">Contact</h2>
				<Field label="Contact person" icon={User}>
					<input name="adminName" maxLength={120} autoComplete="name" placeholder="Who we talk to" className={input} />
				</Field>
				<div className="grid gap-5 sm:grid-cols-2">
					<Field label="Business email" icon={Mail} hint="For booking notifications.">
						<input name="email" type="email" required maxLength={160} autoComplete="email" placeholder="bookings@company.com" className={input} />
					</Field>
					<Field label="Phone" icon={Phone}>
						<input name="phoneNumber" type="tel" maxLength={40} autoComplete="tel" placeholder="+212 600 000 000" className={input} />
					</Field>
				</div>
			</section>

			{error && (
				<p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
					{error}
				</p>
			)}

			<div className="flex flex-col-reverse gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:justify-end dark:border-neutral-800">
				<button
					type="button"
					onClick={() => router.back()}
					disabled={busy}
					className="h-12 rounded-full border border-neutral-300 px-7 text-sm font-semibold transition hover:border-neutral-950 disabled:opacity-50 dark:border-neutral-700 dark:hover:border-white"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={busy}
					className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-neutral-950 px-8 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-white dark:text-neutral-950"
				>
					{busy && <Loader2 className="h-4 w-4 animate-spin" />}
					Create company
				</button>
			</div>
		</form>
	)
}
