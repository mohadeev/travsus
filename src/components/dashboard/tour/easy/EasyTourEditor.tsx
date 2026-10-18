'use client'
// The tour editor, made as simple as possible: one question per screen, big
// text and buttons, plain words with examples, − / + instead of typing
// numbers, Undo after every delete, and everything saves by itself.
// It edits the same tour fields as before (name, subtitle, overview,
// highlights, days, images, pricingTiers, accommodations).
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
	ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BedDouble, Check, Link2, CheckCircle2, CircleDashed, CloudOff, Euro, ExternalLink, FileText,
	ImagePlus, Images, ListOrdered, Loader2, Minus, PartyPopper, Plus, RotateCcw, Sparkles, Star, Trash2, type LucideIcon,
} from 'lucide-react'
import TourAccommodations from '../TourAccommodations'
import { stayOptions, transportTiers } from '@/lib/tourPricing'

type Day = { name: string; description: string; hidden?: boolean; [k: string]: any }
type Photo = { url: string; public_id?: string; [k: string]: any }
type Tier = { transportType: string; transportImage?: string; minSeats: number; maxSeats: number; pricing: { currency: string; totalPrice: number; pricePerDay?: number } }
type Tour = {
	id: string
	name: string
	subtitle: string
	overview: string
	/** What Google shows: title (~60 letters) and description (~155 letters) */
	seoTitle: string
	metaDescription: string
	highlights: { name: string }[]
	days: Day[]
	images: Photo[]
	pricingTiers: Tier[]
	accommodations: any[]
	/** Other versions of this trip: they share these prices (not saved from here) */
	linkedTours: { id: string; name: string }[]
}
type Field = keyof Omit<Tour, 'id' | 'linkedTours'>
type SaveState = 'saved' | 'waiting' | 'saving' | 'error'

// The vehicles a trip can be priced for (same list as before)
const VEHICLES = [
	{ name: 'SUV (prado)', image: 'https://res.cloudinary.com/travsus/image/upload/v1745698557/prado_nhgpvq.png', min: 1, max: 5, text: '4x4 for 1 to 5 people' },
	{ name: 'Mercedes Vito', image: 'https://res.cloudinary.com/travsus/image/upload/v1745698557/vito_et5qqd.png', min: 6, max: 8, text: 'Van for 6 to 8 people' },
	{ name: 'Mini Bus', image: 'https://res.cloudinary.com/travsus/image/upload/v1745698557/mini-bus_gwoprr.png', min: 9, max: 19, text: 'Minibus for 9 to 19 people' },
]

const input =
	'w-full rounded-2xl border-0 bg-neutral-100 px-5 text-lg text-neutral-950 ring-2 ring-transparent transition placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-neutral-950 dark:bg-neutral-900 dark:text-white dark:focus:bg-neutral-950 dark:focus:ring-white'
const bigButton = 'inline-flex h-14 items-center justify-center gap-2 rounded-full px-7 text-lg font-semibold transition active:scale-[0.98] disabled:opacity-40'

// ---- Saving ----------------------------------------------------------------

/** Saves changed fields a moment after the last change; retries if it fails */
function useAutosave(tourId: string) {
	const [state, setState] = useState<SaveState>('saved')
	const pending = useRef<Partial<Tour>>({})
	const timer = useRef<ReturnType<typeof setTimeout>>()

	const flush = useCallback(async () => {
		clearTimeout(timer.current)
		const changes = pending.current
		if (!Object.keys(changes).length) return true
		pending.current = {}
		setState('saving')
		try {
			const res = await fetch(`/api/dashboard/tours/${tourId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(changes) })
			if (!res.ok) throw new Error()
			setState(Object.keys(pending.current).length ? 'waiting' : 'saved')
			return true
		} catch {
			// Put the changes back (newer ones win) and try again soon
			pending.current = { ...changes, ...pending.current }
			setState('error')
			timer.current = setTimeout(() => void flush(), 5000)
			return false
		}
	}, [tourId])

	const queue = useCallback(
		(changes: Partial<Tour>) => {
			pending.current = { ...pending.current, ...changes }
			setState('waiting')
			clearTimeout(timer.current)
			timer.current = setTimeout(() => void flush(), 1200)
		},
		[flush],
	)

	// Leaving with unsaved changes: save now, and warn just in case
	useEffect(() => {
		const warn = (e: BeforeUnloadEvent) => {
			if (!Object.keys(pending.current).length) return
			void flush()
			e.preventDefault()
			e.returnValue = ''
		}
		window.addEventListener('beforeunload', warn)
		return () => window.removeEventListener('beforeunload', warn)
	}, [flush])

	return { state, queue, flush }
}

function SaveBadge({ state }: { state: SaveState }) {
	const map: Record<SaveState, [ReactNode, string, string]> = {
		saved: [<Check key="i" className="h-5 w-5" strokeWidth={3} />, 'Saved', 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'],
		waiting: [<CircleDashed key="i" className="h-5 w-5" />, 'Saving soon…', 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300'],
		saving: [<Loader2 key="i" className="h-5 w-5 animate-spin" />, 'Saving…', 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300'],
		error: [<CloudOff key="i" className="h-5 w-5" />, 'Not saved yet, trying again', 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'],
	}
	const [icon, text, cls] = map[state]
	return (
		<span role="status" className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold ${cls}`}>
			{icon}
			{text}
		</span>
	)
}

// ---- Small building blocks ---------------------------------------------------

function Question({ title, help, children }: { title: string; help?: string; children: ReactNode }) {
	return (
		<div>
			<h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{title}</h2>
			{help && <p className="mt-3 max-w-2xl text-lg leading-relaxed text-neutral-500">{help}</p>}
			<div className="mt-8">{children}</div>
		</div>
	)
}

function Label({ children, hint }: { children: ReactNode; hint?: string }) {
	return (
		<span className="mb-2 block">
			<span className="text-lg font-semibold">{children}</span>
			{hint && <span className="mt-0.5 block text-base text-neutral-500">{hint}</span>}
		</span>
	)
}

/** − 4 + : changes a number without typing */
function Stepper({ value, onChange, min = 0, max = 99, label }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string }) {
	const btn = 'grid h-14 w-14 place-items-center rounded-full bg-neutral-100 text-neutral-950 transition hover:bg-neutral-200 active:scale-95 disabled:opacity-30 dark:bg-neutral-800 dark:text-white'
	return (
		<div className="flex items-center gap-3" role="group" aria-label={label}>
			<button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${label}: one less`}>
				<Minus className="h-6 w-6" />
			</button>
			<span className="w-12 text-center text-3xl font-bold tabular-nums">{value}</span>
			<button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label}: one more`}>
				<Plus className="h-6 w-6" />
			</button>
		</div>
	)
}

function IconButton({ onClick, label, children, danger = false, disabled = false }: { onClick: () => void; label: string; children: ReactNode; danger?: boolean; disabled?: boolean }) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`inline-flex h-12 items-center gap-2 rounded-full px-4 text-base font-semibold transition active:scale-95 disabled:opacity-30 ${
				danger ? 'text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40' : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700'
			}`}
		>
			{children}
			<span>{label}</span>
		</button>
	)
}

const move = <T,>(list: T[], from: number, to: number) => {
	const next = [...list]
	const [item] = next.splice(from, 1)
	next.splice(to, 0, item)
	return next
}

// ---- Photos ------------------------------------------------------------------

/** Sends one photo straight to Cloudinary (with a signature from our server) */
async function uploadPhoto(tourId: string, file: File, onProgress: (pct: number) => void): Promise<Photo> {
	const signRes = await fetch('/api/dashboard/uploads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tourId }) })
	const sign = await signRes.json()
	if (!signRes.ok) throw new Error(sign.error || 'Could not start the upload')
	const form = new FormData()
	form.append('file', file)
	form.append('api_key', sign.apiKey)
	form.append('timestamp', String(sign.timestamp))
	form.append('folder', sign.folder)
	form.append('signature', sign.signature)
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('POST', `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`)
		xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100))
		xhr.onload = () => {
			try {
				const body = JSON.parse(xhr.responseText)
				if (xhr.status >= 200 && xhr.status < 300 && body.secure_url) resolve({ url: body.secure_url, public_id: body.public_id })
				else reject(new Error(body.error?.message || 'Upload failed'))
			} catch {
				reject(new Error('Upload failed'))
			}
		}
		xhr.onerror = () => reject(new Error('No internet connection?'))
		xhr.send(form)
	})
}

function PhotosStep({ tour, set, onRemoved }: { tour: Tour; set: (f: Field, v: any) => void; onRemoved: (label: string, undo: () => void) => void }) {
	const [uploads, setUploads] = useState<{ name: string; pct: number; error?: string }[]>([])
	const [dragging, setDragging] = useState(false)
	const fileInput = useRef<HTMLInputElement>(null)
	const photos = tour.images
	const latest = useRef(photos)
	latest.current = photos

	async function addFiles(files: FileList | null) {
		const list = Array.from(files ?? []).filter((f) => f.type.startsWith('image/'))
		if (!list.length) return
		setUploads(list.map((f) => ({ name: f.name, pct: 0 })))
		for (let i = 0; i < list.length; i++) {
			const file = list[i]
			if (file.size > 20 * 1024 * 1024) {
				setUploads((u) => u.map((x, j) => (j === i ? { ...x, error: 'Too big (max 20 MB)' } : x)))
				continue
			}
			try {
				const photo = await uploadPhoto(tour.id, file, (pct) => setUploads((u) => u.map((x, j) => (j === i ? { ...x, pct } : x))))
				latest.current = [...latest.current, photo]
				set('images', latest.current)
				setUploads((u) => u.map((x, j) => (j === i ? { ...x, pct: 100 } : x)))
			} catch (e: any) {
				setUploads((u) => u.map((x, j) => (j === i ? { ...x, error: e.message } : x)))
			}
		}
		setTimeout(() => setUploads((u) => u.filter((x) => x.error)), 1500)
	}

	return (
		<Question title="Add your best photos" help="Travellers look at the photos first. Add at least 4 bright photos. The first one is the cover.">
			<button
				type="button"
				onClick={() => fileInput.current?.click()}
				onDragOver={(e) => {
					e.preventDefault()
					setDragging(true)
				}}
				onDragLeave={() => setDragging(false)}
				onDrop={(e) => {
					e.preventDefault()
					setDragging(false)
					void addFiles(e.dataTransfer.files)
				}}
				className={`flex w-full flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed px-6 py-12 text-center transition ${
					dragging ? 'border-neutral-950 bg-neutral-100 dark:border-white dark:bg-neutral-900' : 'border-neutral-300 hover:border-neutral-950 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:border-white dark:hover:bg-neutral-900'
				}`}
			>
				<span className="grid h-16 w-16 place-items-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
					<ImagePlus className="h-8 w-8" />
				</span>
				<span className="text-xl font-bold">Choose photos</span>
				<span className="text-base text-neutral-500">or drag them here · you can pick several at once</span>
			</button>
			<input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => (void addFiles(e.target.files), (e.target.value = ''))} />

			{uploads.length > 0 && (
				<ul className="mt-4 space-y-2">
					{uploads.map((u, i) => (
						<li key={i} className={`rounded-2xl px-4 py-3 text-base ${u.error ? 'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300' : 'bg-neutral-100 dark:bg-neutral-900'}`}>
							<div className="flex justify-between gap-3">
								<span className="truncate">{u.name}</span>
								<span className="shrink-0 font-semibold">{u.error ?? (u.pct === 100 ? 'Done ✓' : `${u.pct}%`)}</span>
							</div>
							{!u.error && (
								<div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
									<div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${u.pct}%` }} />
								</div>
							)}
						</li>
					))}
				</ul>
			)}

			{photos.length > 0 && (
				<ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{photos.map((photo, i) => (
						<li key={photo.public_id ?? photo.url} className="overflow-hidden rounded-[24px] bg-neutral-100 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
							<div className="relative aspect-[4/3]">
								{/* eslint-disable-next-line @next/next/no-img-element -- any uploaded host */}
								<img src={photo.url.replace('/upload/', '/upload/c_fill,w_600,h_450,q_auto/')} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
								<span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-sm font-bold ${i === 0 ? 'bg-amber-400 text-neutral-950' : 'bg-white/90 text-neutral-900'}`}>
									{i === 0 ? '★ Cover photo' : `Photo ${i + 1}`}
								</span>
							</div>
							<div className="flex flex-wrap gap-2 p-3">
								{i > 0 && (
									<IconButton label="Make cover" onClick={() => set('images', move(photos, i, 0))}>
										<Star className="h-5 w-5" />
									</IconButton>
								)}
								<IconButton label="Earlier" onClick={() => set('images', move(photos, i, i - 1))} disabled={i === 0}>
									<ArrowLeft className="h-5 w-5" />
								</IconButton>
								<IconButton label="Later" onClick={() => set('images', move(photos, i, i + 1))} disabled={i === photos.length - 1}>
									<ArrowRight className="h-5 w-5" />
								</IconButton>
								<IconButton
									danger
									label="Remove"
									onClick={() => {
										const before = photos
										set('images', photos.filter((_, j) => j !== i))
										onRemoved('Photo removed', () => set('images', before))
									}}
								>
									<Trash2 className="h-5 w-5" />
								</IconButton>
							</div>
						</li>
					))}
				</ul>
			)}
		</Question>
	)
}

// ---- Steps -------------------------------------------------------------------

type StepProps = { tour: Tour; set: (f: Field, v: any) => void; onRemoved: (label: string, undo: () => void) => void }

function NameStep({ tour, set }: StepProps) {
	return (
		<Question title="What is your trip called?" help="Say where it goes and how long it lasts. Short and clear works best.">
			<label className="block">
				<Label>Name of the trip</Label>
				<input className={`${input} h-16 text-xl font-semibold`} value={tour.name} onChange={(e) => set('name', e.target.value)} placeholder="Example: 3 days from Marrakech to the Sahara desert" maxLength={140} />
			</label>
			<label className="mt-8 block">
				<Label hint="One sentence that makes people want to go.">Short sentence</Label>
				<textarea className={`${input} py-4`} rows={2} value={tour.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="Example: Sleep under the stars in a desert camp and ride camels at sunset." maxLength={240} />
			</label>
			<label className="mt-8 block">
				<Label hint={`${tour.seoTitle.length}/60 letters · empty = the trip name`}>Title on Google</Label>
				<input className={`${input} h-14`} value={tour.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} placeholder="Example: 3-Day Marrakech to Merzouga Desert Tour" maxLength={70} />
			</label>
			<label className="mt-8 block">
				<Label hint={`${tour.metaDescription.length}/155 letters · empty = the short sentence`}>Description on Google</Label>
				<textarea className={`${input} py-4`} rows={3} value={tour.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} placeholder="What people see under the title in Google results." maxLength={170} />
			</label>
		</Question>
	)
}

function AboutStep({ tour, set, onRemoved }: StepProps) {
	const highlights = tour.highlights
	return (
		<Question title="Tell travellers about this trip" help="Write like you're telling a friend. What will they see, do and feel?">
			<label className="block">
				<Label hint={`${tour.overview.length} letters · aim for at least 300`}>About the trip</Label>
				<textarea
					className={`${input} py-4 leading-relaxed`}
					rows={9}
					value={tour.overview}
					onChange={(e) => set('overview', e.target.value)}
					placeholder="Example: We leave Marrakech in the morning and cross the High Atlas mountains by the famous Tizi n'Tichka pass…"
				/>
			</label>

			<div className="mt-10">
				<Label hint="Short points, one per line. 4 to 6 is perfect.">What will they love?</Label>
				<ul className="space-y-3">
					{highlights.map((h, i) => (
						<li key={i} className="flex items-center gap-2">
							<span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
								<Check className="h-5 w-5" strokeWidth={3} />
							</span>
							<input
								className={`${input} h-14`}
								value={h.name}
								onChange={(e) => set('highlights', highlights.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
								placeholder="Example: A night in a desert camp"
								aria-label={`Point ${i + 1}`}
							/>
							<button
								type="button"
								onClick={() => {
									const before = highlights
									set('highlights', highlights.filter((_, j) => j !== i))
									onRemoved('Point removed', () => set('highlights', before))
								}}
								className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
								aria-label={`Remove point ${i + 1}`}
							>
								<Trash2 className="h-6 w-6" />
							</button>
						</li>
					))}
				</ul>
				<button type="button" onClick={() => set('highlights', [...highlights, { name: '' }])} className={`${bigButton} mt-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800`}>
					<Plus className="h-6 w-6" />
					Add a point
				</button>
			</div>
		</Question>
	)
}

function DaysStep({ tour, set, onRemoved }: StepProps) {
	const days = tour.days
	const update = (i: number, changes: Partial<Day>) => set('days', days.map((d, j) => (j === i ? { ...d, ...changes } : d)))
	return (
		<Question title="What happens each day?" help="One box per day. Give each day a title, then say what travellers do.">
			<ol className="space-y-6">
				{days.map((day, i) => (
					<li key={i} className="rounded-[28px] p-5 ring-2 ring-neutral-200 sm:p-7 dark:ring-neutral-800">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<span className="rounded-full bg-neutral-950 px-4 py-2 text-lg font-bold text-white dark:bg-white dark:text-neutral-950">Day {i + 1}</span>
							<div className="flex flex-wrap gap-2">
								<IconButton label="Up" onClick={() => set('days', move(days, i, i - 1))} disabled={i === 0}>
									<ArrowUp className="h-5 w-5" />
								</IconButton>
								<IconButton label="Down" onClick={() => set('days', move(days, i, i + 1))} disabled={i === days.length - 1}>
									<ArrowDown className="h-5 w-5" />
								</IconButton>
								<IconButton
									danger
									label="Remove"
									onClick={() => {
										const before = days
										set('days', days.filter((_, j) => j !== i))
										onRemoved(`Day ${i + 1} removed`, () => set('days', before))
									}}
								>
									<Trash2 className="h-5 w-5" />
								</IconButton>
							</div>
						</div>
						<label className="mt-5 block">
							<Label>Title of the day</Label>
							<input className={`${input} h-14`} value={day.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Example: Marrakech to the Dades Valley" />
						</label>
						<label className="mt-5 block">
							<Label>What travellers do</Label>
							<textarea className={`${input} py-4 leading-relaxed`} rows={5} value={day.description} onChange={(e) => update(i, { description: e.target.value })} placeholder="Example: After breakfast we drive over the mountains, stop for lunch in a Berber village…" />
						</label>
					</li>
				))}
			</ol>
			<button
				type="button"
				onClick={() => set('days', [...days, { name: `Day ${days.length + 1}`, description: '', hidden: false }])}
				className={`${bigButton} mt-6 w-full bg-neutral-950 text-white hover:bg-neutral-800 sm:w-auto dark:bg-white dark:text-neutral-950`}
			>
				<Plus className="h-6 w-6" />
				Add a day
			</button>
		</Question>
	)
}

/** Tells the editor that prices here also change the linked versions of the trip. */
function LinkedNote({ tours }: { tours: { id: string; name: string }[] }) {
	return (
		<div className="mb-5 flex gap-3 rounded-2xl bg-neutral-100 p-4 text-base dark:bg-neutral-900">
			<Link2 className="mt-0.5 h-5 w-5 shrink-0" />
			<div>
				<p className="font-semibold">
					These prices and hotels are shared with {tours.length} other version{tours.length > 1 ? 's' : ''} of this trip
				</p>
				<p className="mt-1 text-sm text-neutral-500">Change them here and they change there too:</p>
				<ul className="mt-2 space-y-1 text-sm">
					{tours.map((t) => (
						<li key={t.id}>
							<Link href={`../${t.id}/edit` as any} className="underline underline-offset-2 hover:text-neutral-500">
								{t.name}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

function PricesStep({ tour, set }: StepProps) {
	const tiers = tour.pricingTiers
	const days = Math.max(1, tour.days.length)
	const tierOf = (name: string) => tiers.find((t) => t.transportType === name)
	const save = (name: string, changes: Partial<Tier> | null) => {
		if (changes === null) return set('pricingTiers', tiers.filter((t) => t.transportType !== name))
		const v = VEHICLES.find((x) => x.name === name)!
		const current = tierOf(name) ?? { transportType: name, transportImage: v.image, minSeats: v.min, maxSeats: v.max, pricing: { currency: 'EUR', totalPrice: 0 } }
		const next = { ...current, ...changes }
		next.pricing = { ...next.pricing, currency: 'EUR', pricePerDay: Math.round((next.pricing.totalPrice / days) * 100) / 100 }
		set('pricingTiers', tierOf(name) ? tiers.map((t) => (t.transportType === name ? next : t)) : [...tiers, next])
	}
	return (
		<Question title="How much does the trip cost?" help="Turn on each vehicle you offer, then write the price for the whole trip, for the whole group in that vehicle.">
			{tour.linkedTours.length > 0 && <LinkedNote tours={tour.linkedTours} />}
			<button
				type="button"
				onClick={() => set('pricingTiers', transportTiers(days))}
				className={`${bigButton} mb-5 w-full bg-neutral-950 text-white hover:bg-neutral-800 sm:w-auto dark:bg-white dark:text-neutral-950`}
			>
				<Euro className="h-5 w-5" />
				Use Travsus prices ({days === 1 ? '150 € a day' : days <= 3 ? '170 € a day' : '120 € a day, minibus 150 €'})
			</button>
			<ul className="space-y-5">
				{VEHICLES.map((v) => {
					const tier = tierOf(v.name)
					const on = !!tier
					return (
						<li key={v.name} className={`rounded-[28px] p-5 transition sm:p-6 ${on ? 'ring-2 ring-neutral-950 dark:ring-white' : 'bg-neutral-50 ring-1 ring-neutral-200 dark:bg-neutral-900/50 dark:ring-neutral-800'}`}>
							<div className="flex items-center gap-4">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={v.image} alt="" className="h-14 w-24 shrink-0 object-contain" />
								<div className="min-w-0 flex-1">
									<p className="text-xl font-bold">{v.name}</p>
									<p className="text-base text-neutral-500">{v.text}</p>
								</div>
								<button
									type="button"
									role="switch"
									aria-checked={on}
									aria-label={`We offer the ${v.name}`}
									onClick={() => save(v.name, on ? null : {})}
									className={`relative h-10 w-[72px] shrink-0 rounded-full transition ${on ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'}`}
								>
									<span className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow transition-all ${on ? 'left-[36px]' : 'left-1'}`} />
								</button>
							</div>
							{tier && (
								<div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
									<div>
										<Label>From (people)</Label>
										<Stepper label="Fewest people" value={tier.minSeats} min={1} max={tier.maxSeats} onChange={(n) => save(v.name, { minSeats: n })} />
									</div>
									<div>
										<Label>Up to (people)</Label>
										<Stepper label="Most people" value={tier.maxSeats} min={tier.minSeats} max={60} onChange={(n) => save(v.name, { maxSeats: n })} />
									</div>
									<label className="block">
										<Label>Price for the whole trip</Label>
										<span className="relative block">
											<span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-neutral-400">€</span>
											<input
												type="number"
												inputMode="decimal"
												min={0}
												className={`${input} h-14 pl-12 text-2xl font-bold tabular-nums`}
												value={tier.pricing.totalPrice || ''}
												placeholder="0"
												onChange={(e) => save(v.name, { pricing: { ...tier.pricing, totalPrice: Math.max(0, Number(e.target.value) || 0) } })}
											/>
										</span>
									</label>
								</div>
							)}
						</li>
					)
				})}
			</ul>
		</Question>
	)
}

function StaysStep({ tour, set, onRemoved }: StepProps) {
	// The stay editor fills in example hotels when it opens, so it only opens
	// once the trip is said to have nights
	const [editing, setEditing] = useState(tour.accommodations.length > 0)
	return (
		<Question title="Where do travellers sleep?" help="Only for trips with nights. Skip this if the trip is one day, or if travellers book their own hotel.">
			{!editing ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<button
						type="button"
						onClick={() => {
							// Standard 50 € and Luxury 90 € per person per night
							if (!tour.accommodations.length) set('accommodations', stayOptions(Math.max(1, tour.days.length - 1)))
							setEditing(true)
						}}
						className="rounded-[28px] p-6 text-left ring-2 ring-neutral-950 transition hover:bg-neutral-50 dark:ring-white dark:hover:bg-neutral-900">
						<BedDouble className="h-8 w-8" />
						<p className="mt-4 text-xl font-bold">Yes, it has nights</p>
						<p className="mt-1 text-base text-neutral-500">Add the hotels or camps and their prices.</p>
					</button>
					<div className="rounded-[28px] bg-neutral-50 p-6 ring-1 ring-neutral-200 dark:bg-neutral-900/50 dark:ring-neutral-800">
						<Check className="h-8 w-8 text-emerald-500" />
						<p className="mt-4 text-xl font-bold">No nights</p>
						<p className="mt-1 text-base text-neutral-500">Nothing to do: just press Skip below.</p>
					</div>
				</div>
			) : (
				<>
					<div className="rounded-[28px] p-4 ring-1 ring-neutral-200 sm:p-6 dark:ring-neutral-800">
						<TourAccommodations tourData={tour} updateTourData={(d: any) => d.accommodations && set('accommodations', d.accommodations)} />
					</div>
					<button
						type="button"
						onClick={() => {
							const before = tour.accommodations
							set('accommodations', [])
							setEditing(false)
							onRemoved('Stays removed', () => {
								set('accommodations', before)
								setEditing(true)
							})
						}}
						className={`${bigButton} mt-6 text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40`}
					>
						<Trash2 className="h-5 w-5" />
						This trip has no nights: remove all stays
					</button>
				</>
			)}
		</Question>
	)
}

// ---- The editor ----------------------------------------------------------------

type Step = { id: string; label: string; icon: LucideIcon; done: (t: Tour) => boolean; optional?: boolean; render: (p: StepProps) => ReactNode }
const STEPS: Step[] = [
	{ id: 'name', label: 'Name', icon: FileText, done: (t) => t.name.trim().length > 4, render: (p) => <NameStep {...p} /> },
	{ id: 'photos', label: 'Photos', icon: Images, done: (t) => t.images.length >= 4, render: (p) => <PhotosStep {...p} /> },
	{ id: 'about', label: 'About', icon: Sparkles, done: (t) => t.overview.trim().length >= 150, render: (p) => <AboutStep {...p} /> },
	{ id: 'days', label: 'Days', icon: ListOrdered, done: (t) => t.days.length > 0 && t.days.every((d) => d.name.trim() && d.description.trim()), render: (p) => <DaysStep {...p} /> },
	{ id: 'prices', label: 'Prices', icon: Euro, done: (t) => t.pricingTiers.some((x) => x.pricing?.totalPrice > 0), render: (p) => <PricesStep {...p} /> },
	{ id: 'stays', label: 'Stays', icon: BedDouble, optional: true, done: (t) => (t.accommodations ?? []).length > 0, render: (p) => <StaysStep {...p} /> },
]
const TODO: Record<string, string> = {
	name: 'Give the trip a name',
	photos: 'Add at least 4 photos',
	about: 'Write a few lines about the trip',
	days: 'Give every day a title and a text',
	prices: 'Set a price for at least one vehicle',
	stays: 'Add where travellers sleep (optional)',
}

export default function EasyTourEditor({ initial, previewHref, backHref }: { initial: any; previewHref: string | null; backHref: string }) {
	const [tour, setTour] = useState<Tour>(() => ({
		id: initial.id,
		name: initial.name ?? '',
		subtitle: initial.subtitle ?? '',
		overview: initial.overview ?? '',
		seoTitle: initial.seoTitle ?? '',
		metaDescription: initial.metaDescription ?? '',
		highlights: Array.isArray(initial.highlights) ? initial.highlights.map((h: any) => ({ ...h, name: typeof h === 'string' ? h : h?.name ?? '' })) : [],
		days: Array.isArray(initial.days) ? initial.days.map((d: any) => ({ ...d, name: d?.name ?? '', description: d?.description ?? '' })) : [],
		images: Array.isArray(initial.images) ? initial.images.filter((p: any) => p?.url) : [],
		pricingTiers: Array.isArray(initial.pricingTiers) ? initial.pricingTiers : [],
		accommodations: Array.isArray(initial.accommodations) ? initial.accommodations : [],
		linkedTours: Array.isArray(initial.linkedTours) ? initial.linkedTours : [],
	}))
	const [step, setStep] = useState(0)
	const [undo, setUndo] = useState<{ label: string; run: () => void } | null>(null)
	const undoTimer = useRef<ReturnType<typeof setTimeout>>()
	const top = useRef<HTMLDivElement>(null)
	const { state, queue, flush } = useAutosave(tour.id)

	const set = useCallback(
		(field: Field, value: any) => {
			setTour((t) => ({ ...t, [field]: value }))
			queue({ [field]: value } as Partial<Tour>)
		},
		[queue],
	)
	const onRemoved = useCallback((label: string, run: () => void) => {
		clearTimeout(undoTimer.current)
		setUndo({ label, run })
		undoTimer.current = setTimeout(() => setUndo(null), 8000)
	}, [])

	const finished = step === STEPS.length
	const go = (i: number) => {
		void flush()
		setStep(i)
		top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}
	const doneCount = STEPS.filter((s) => !s.optional && s.done(tour)).length
	const required = STEPS.filter((s) => !s.optional).length

	return (
		<div ref={top} className="scroll-mt-24 text-neutral-950 dark:text-white">
			{/* Progress + steps */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="text-lg font-semibold text-neutral-500">{finished ? 'All steps' : `Step ${step + 1} of ${STEPS.length}`}</p>
				<SaveBadge state={state} />
			</div>
			<div className="mt-3 h-3 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900" aria-hidden>
				<div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${(doneCount / required) * 100}%` }} />
			</div>
			<nav aria-label="Steps" className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
				{STEPS.map((s, i) => {
					const Icon = s.icon
					const done = s.done(tour)
					const active = i === step
					return (
						<button
							key={s.id}
							type="button"
							onClick={() => go(i)}
							aria-current={active ? 'step' : undefined}
							className={`inline-flex h-12 shrink-0 items-center gap-2 rounded-full pl-2 pr-5 text-base font-semibold transition ${
								active ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800'
							}`}
						>
							<span className={`grid h-8 w-8 place-items-center rounded-full ${done ? 'bg-emerald-500 text-white' : active ? 'bg-white/15' : 'bg-white dark:bg-neutral-950'}`}>
								{done ? <Check className="h-5 w-5" strokeWidth={3} /> : <Icon className="h-4 w-4" />}
							</span>
							{s.label}
						</button>
					)
				})}
			</nav>

			{/* The current question */}
			<section className="mt-8 rounded-[32px] bg-white p-6 ring-1 ring-neutral-200 sm:p-10 dark:bg-neutral-950 dark:ring-neutral-800">
				{finished ? (
					<div>
						<span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white">
							<PartyPopper className="h-8 w-8" />
						</span>
						<h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{doneCount === required ? 'Your trip is ready!' : 'Almost there!'}</h2>
						<p className="mt-3 text-lg text-neutral-500">Everything is saved. {doneCount === required ? 'You can look at it like a traveller would.' : 'Just a few things left:'}</p>
						<ul className="mt-6 space-y-3">
							{STEPS.map((s, i) => {
								const done = s.done(tour)
								return (
									<li key={s.id}>
										<button type="button" onClick={() => go(i)} className="flex w-full items-center gap-4 rounded-2xl bg-neutral-50 p-4 text-left text-lg transition hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800">
											{done ? <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-500" /> : <CircleDashed className="h-7 w-7 shrink-0 text-amber-500" />}
											<span className={`flex-1 ${done ? 'text-neutral-500 line-through decoration-neutral-300' : 'font-semibold'}`}>{TODO[s.id]}</span>
											{!done && <ArrowRight className="h-5 w-5 shrink-0" />}
										</button>
									</li>
								)
							})}
						</ul>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							{previewHref && (
								<a href={previewHref} target="_blank" rel="noreferrer" className={`${bigButton} bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950`}>
									<ExternalLink className="h-5 w-5" />
									See my trip
								</a>
							)}
							<Link href={backHref as any} className={`${bigButton} bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800`}>
								Back to my trips
							</Link>
						</div>
					</div>
				) : (
					STEPS[step].render({ tour, set, onRemoved })
				)}
			</section>

			{/* Back / Next, always in reach */}
			<div className="sticky bottom-20 z-30 mt-6 flex items-center gap-3 rounded-full bg-white/90 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.15)] ring-1 ring-neutral-200 backdrop-blur-xl sm:bottom-6 dark:bg-neutral-950/90 dark:ring-neutral-800">
				<button type="button" onClick={() => go(Math.max(0, step - 1))} disabled={step === 0} className={`${bigButton} px-5 hover:bg-neutral-100 dark:hover:bg-neutral-900`}>
					<ArrowLeft className="h-6 w-6" />
					<span className="hidden sm:inline">Back</span>
				</button>
				{previewHref && !finished && (
					<a href={previewHref} target="_blank" rel="noreferrer" className="hidden items-center gap-2 text-base font-semibold text-neutral-500 underline-offset-4 hover:underline sm:inline-flex">
						<ExternalLink className="h-4 w-4" />
						See my trip
					</a>
				)}
				{!finished && (
					<button type="button" onClick={() => go(step + 1)} className={`${bigButton} ml-auto bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950`}>
						{step === STEPS.length - 1 ? 'Finish' : STEPS[step].optional && !STEPS[step].done(tour) ? 'Skip' : 'Next'}
						<ArrowRight className="h-6 w-6" />
					</button>
				)}
			</div>

			{/* Undo after a delete */}
			{undo && (
				<div role="status" className="fixed inset-x-0 bottom-40 z-[70] flex justify-center px-4 sm:bottom-28">
					<div className="flex items-center gap-4 rounded-full bg-neutral-950 py-2 pl-6 pr-2 text-lg text-white shadow-2xl dark:bg-white dark:text-neutral-950">
						<span>{undo.label}</span>
						<button
							type="button"
							onClick={() => {
								undo.run()
								setUndo(null)
							}}
							className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 font-semibold text-neutral-950 dark:bg-neutral-950 dark:text-white"
						>
							<RotateCcw className="h-5 w-5" />
							Undo
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
