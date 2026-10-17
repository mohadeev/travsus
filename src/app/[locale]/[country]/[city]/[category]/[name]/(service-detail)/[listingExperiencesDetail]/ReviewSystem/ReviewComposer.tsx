'use client'
// "Write a review" dialog: full screen on phones, a centered card on larger
// screens. One scrolling page of simple questions, a sticky footer that shows
// what is still missing, and a thank-you screen at the end.
import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { Briefcase, Camera, Check, Heart, Lightbulb, User, Users, UsersRound, X } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const TEXT_MAX = 1000
const TEXT_GOOD = 100 // enough words to help other travellers
const TITLE_MAX = 120
const PHOTOS_MAX = 8

const RATING_KEYS = ['', 'Rating_1', 'Rating_2', 'Rating_3', 'Rating_4', 'Rating_5']
const RATING_EMOJI = ['', '😞', '😕', '🙂', '😀', '🤩']

const WHO = [
	{ key: 'Couples', icon: Heart },
	{ key: 'Family', icon: UsersRound },
	{ key: 'Friends', icon: Users },
	{ key: 'Solo', icon: User },
	{ key: 'Business', icon: Briefcase },
] as const

type Props = {
	serviceId: string
	tourName: string
	tourImage?: string
	tourSubtitle?: string
	onClose: () => void
	onCreated: (review: any) => void
}

export default function ReviewComposer({ serviceId, tourName, tourImage, tourSubtitle, onClose, onCreated }: Props) {
	const t = useTranslations('experience_reviews')
	const locale = useLocale()

	const [rating, setRating] = useState(0)
	const [hover, setHover] = useState(0)
	const [month, setMonth] = useState<string>('') // ISO date of the month's first day
	const [who, setWho] = useState('')
	const [text, setText] = useState('')
	const [title, setTitle] = useState('')
	const [files, setFiles] = useState<File[]>([])
	const [agreed, setAgreed] = useState(false)
	const [showTerms, setShowTerms] = useState(false)
	const [dragging, setDragging] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [done, setDone] = useState(false)
	const [tried, setTried] = useState(false)
	const fileInput = useRef<HTMLInputElement>(null)

	// Last 12 months, newest first
	const months = useMemo(
		() =>
			Array.from({ length: 12 }, (_, i) => {
				const d = new Date()
				d.setDate(1)
				d.setMonth(d.getMonth() - i)
				return {
					value: new Date(Date.UTC(d.getFullYear(), d.getMonth(), 1)).toISOString(),
					label: d.toLocaleDateString(locale, { month: 'short', year: 'numeric' }),
				}
			}),
		[locale],
	)

	const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files])
	useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews])

	// Esc closes, and the page behind doesn't scroll
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !submitting && onClose()
		document.addEventListener('keydown', onKey)
		const previous = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.removeEventListener('keydown', onKey)
			document.body.style.overflow = previous
		}
	}, [onClose, submitting])

	const addFiles = (list: FileList | null) => {
		if (!list) return
		const images = Array.from(list).filter((f) => f.type.startsWith('image/'))
		setFiles((prev) => [...prev, ...images].slice(0, PHOTOS_MAX))
	}

	const missing = [
		!rating && t('Need_Rating'),
		!month && t('Need_Date'),
		!who && t('Need_Who'),
		!text.trim() && t('Need_Text'),
		!title.trim() && t('Need_Title'),
		!agreed && t('Need_Agree'),
	].filter(Boolean) as string[]
	const steps = 6
	const progress = Math.round(((steps - missing.length) / steps) * 100)
	const shown = hover || rating

	const submit = async () => {
		setTried(true)
		if (missing.length) return
		setSubmitting(true)
		setError('')
		try {
			const form = new FormData()
			form.append('serviceId', serviceId)
			form.append('rating', String(rating))
			form.append('travelDate1', month)
			form.append('travelType', who)
			form.append('reviewText', text.trim())
			form.append('reviewTitle', title.trim())
			form.append('isAgreed', 'true')
			files.forEach((f) => form.append('images', f))
			const res = await fetch('/api/reviews', { method: 'POST', body: form })
			const data = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(data.error || t('Failed_Submit'))
			onCreated(data.review)
			setDone(true)
		} catch (e: any) {
			setError(e?.message || t('Failed_Submit'))
		} finally {
			setSubmitting(false)
		}
	}

	const chip = (selected: boolean) =>
		`inline-flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition duration-200 active:scale-95 ${
			selected
				? 'border-neutral-950 bg-neutral-950 text-white shadow-md dark:border-white dark:bg-white dark:text-neutral-950'
				: 'border-neutral-200 bg-white text-neutral-800 hover:-translate-y-0.5 hover:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-white'
		}`
	const flag = (bad: boolean) => (tried && bad ? 'ring-2 ring-red-400 ring-offset-4 rounded-2xl dark:ring-offset-neutral-950' : '')

	return (
		<>
		<style dangerouslySetInnerHTML={{ __html: REVIEW_ANIMATIONS }} />
		<div className="rv-fade fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-md sm:items-center sm:p-6" onClick={() => !submitting && onClose()}>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={t('Write_Review')}
				onClick={(e) => e.stopPropagation()}
				className="rv-in flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 sm:h-auto sm:max-h-[92vh] sm:max-w-2xl sm:rounded-[28px] dark:bg-neutral-950 dark:ring-white/10"
			>
				{/* Header: which tour this is about */}
				<header className="flex items-center gap-3 bg-neutral-950 px-5 py-4 text-white">
					<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-800 ring-2 ring-white/20">
						{tourImage && <Image src={tourImage} alt="" fill sizes="48px" className="object-cover" />}
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00D084]">{t('Write_Review')}</p>
						<p className="truncate font-semibold">{tourName}</p>
						{tourSubtitle && <p className="truncate text-xs text-neutral-400">{tourSubtitle}</p>}
					</div>
					<button
						type="button"
						onClick={onClose}
						disabled={submitting}
						aria-label={t('Cancel')}
						className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 transition duration-200 hover:rotate-90 hover:bg-white/20"
					>
						<X className="h-5 w-5" />
					</button>
				</header>

				{done ? (
					<div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
						<div className="rv-pop relative mb-6 grid h-24 w-24 place-items-center rounded-full bg-neutral-950 text-[#00D084] shadow-2xl dark:bg-white">
							<span className="rv-ring absolute inset-0 rounded-full border-2 border-[#00AA6C]" />
							<Check className="rv-check h-11 w-11" strokeWidth={3} />
						</div>
						<h3 className="rv-up mb-2 text-3xl font-bold tracking-tight" style={{ animationDelay: '200ms' }}>{t('Thanks_Title')}</h3>
						<p className="rv-up mb-8 max-w-sm text-neutral-500" style={{ animationDelay: '300ms' }}>{t('Thanks_Text')}</p>
						<button type="button" onClick={onClose} className="rv-up rounded-full bg-neutral-950 px-10 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95 dark:bg-white dark:text-neutral-950" style={{ animationDelay: '400ms' }}>
							{t('Done')}
						</button>
					</div>
				) : (
					<>
						<div className="rv-body flex-1 space-y-9 overflow-y-auto px-5 py-7 sm:px-8">
							{/* 1. Rating */}
							<section className={flag(!rating)}>
								<h3 className="mb-1 text-2xl font-bold tracking-tight">{t('Tell_Us_Visit')}</h3>
								<p className="mb-5 text-neutral-500">{t('Rate_Experience')}</p>
								<div className="flex items-center gap-2 sm:gap-3" role="radiogroup" aria-label={t('Rate_Experience')} onMouseLeave={() => setHover(0)}>
									{[1, 2, 3, 4, 5].map((n) => (
										<button
											key={`${n}-${rating}`}
											type="button"
											role="radio"
											aria-checked={rating === n}
											aria-label={`${n}/5 – ${t(RATING_KEYS[n])}`}
											onClick={() => setRating(n)}
											onMouseEnter={() => setHover(n)}
											className={`grid h-12 w-12 place-items-center rounded-full border-2 transition duration-150 sm:h-14 sm:w-14 ${
												shown >= n
													? `scale-105 border-[#00AA6C] bg-[#00AA6C] shadow-lg shadow-[#00AA6C]/30 ${rating >= n ? 'rv-pop' : ''}`
													: 'border-neutral-300 hover:scale-110 hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white'
											}`}
										>
											<span className={`h-3 w-3 rounded-full ${shown >= n ? 'bg-white' : 'bg-transparent'}`} />
										</button>
									))}
								</div>
								<p key={shown} className="rv-up mt-3 h-7 text-lg font-semibold" aria-live="polite">
									{shown ? (
										<>
											<span className="mr-2">{RATING_EMOJI[shown]}</span>
											{t(RATING_KEYS[shown])}
										</>
									) : (
										<span className="text-base font-normal text-neutral-400">{t('Tap_To_Rate')}</span>
									)}
								</p>
							</section>

							{/* 2. When */}
							<section className={flag(!month)}>
								<h4 className="mb-3 text-lg font-bold">{t('When_Go')}</h4>
								<div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 [scrollbar-width:none]">
									{months.map((m) => (
										<button key={m.value} type="button" onClick={() => setMonth(m.value)} className={chip(month === m.value)} aria-pressed={month === m.value}>
											{m.label}
										</button>
									))}
								</div>
							</section>

							{/* 3. Who with */}
							<section className={flag(!who)}>
								<h4 className="mb-3 text-lg font-bold">{t('Who_Go_With')}</h4>
								<div className="flex flex-wrap gap-2">
									{WHO.map(({ key, icon: Icon }) => (
										<button key={key} type="button" onClick={() => setWho(key)} className={chip(who === key)} aria-pressed={who === key}>
											<Icon className="h-4 w-4" />
											{t(key)}
										</button>
									))}
								</div>
							</section>

							{/* 4. The review */}
							<section className={flag(!text.trim())}>
								<h4 className="mb-3 text-lg font-bold">{t('Write_Your_Review')}</h4>
								<div className="mb-3 flex gap-3 rounded-2xl bg-neutral-100 p-4 text-sm text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
									<Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-neutral-950 dark:text-white" />
									<div>
										<p className="mb-1 font-semibold">{t('Tips_Title')}</p>
										<p>{t('Tips_Text')}</p>
									</div>
								</div>
								<textarea
									value={text}
									onChange={(e) => setText(e.target.value.slice(0, TEXT_MAX))}
									placeholder={t('Share_Experience')}
									rows={6}
									className="block w-full resize-y rounded-2xl border-2 border-neutral-200 bg-white p-4 text-base leading-relaxed placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-4 focus:ring-neutral-950/5 transition dark:focus:border-white dark:focus:ring-white/10 dark:border-neutral-700 dark:bg-neutral-900"
								/>
								<div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
									<div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 sm:w-auto sm:flex-1 dark:bg-neutral-800">
										<div
											className={`h-full rounded-full transition-all ${text.length >= TEXT_GOOD ? 'bg-[#00AA6C]' : 'bg-neutral-950 dark:bg-white'}`}
											style={{ width: `${Math.min(100, (text.length / TEXT_GOOD) * 100)}%` }}
										/>
									</div>
									<span className={text.length >= TEXT_GOOD ? 'font-medium text-[#00AA6C]' : 'text-neutral-500'}>
										{text.length >= TEXT_GOOD ? t('Great_Detail') : t('More_Chars', { count: TEXT_GOOD - text.length })}
									</span>
									<span className="ml-auto tabular-nums text-neutral-400">
										{text.length}/{TEXT_MAX}
									</span>
								</div>
							</section>

							{/* 5. Title */}
							<section className={flag(!title.trim())}>
								<h4 className="mb-3 text-lg font-bold">{t('Title_Your_Review')}</h4>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
									placeholder={t('Summarize_Experience')}
									className="block w-full rounded-2xl border-2 border-neutral-200 bg-white px-4 py-3.5 text-base placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-4 focus:ring-neutral-950/5 transition dark:focus:border-white dark:focus:ring-white/10 dark:border-neutral-700 dark:bg-neutral-900"
								/>
								<p className="mt-2 text-right text-sm tabular-nums text-neutral-400">
									{title.length}/{TITLE_MAX}
								</p>
							</section>

							{/* 6. Photos */}
							<section>
								<h4 className="mb-1 text-lg font-bold">
									{t('Add_Photos')} <span className="text-sm font-normal text-neutral-400">· {t('Optional')}</span>
								</h4>
								<p className="mb-3 text-sm text-neutral-500">{t('Photos_Hint')}</p>
								<div
									onDragOver={(e) => {
										e.preventDefault()
										setDragging(true)
									}}
									onDragLeave={() => setDragging(false)}
									onDrop={(e) => {
										e.preventDefault()
										setDragging(false)
										addFiles(e.dataTransfer.files)
									}}
									className={`grid grid-cols-3 gap-2 rounded-2xl border-2 border-dashed p-3 transition duration-200 sm:grid-cols-4 ${
										dragging ? 'scale-[1.01] border-neutral-950 bg-neutral-50 dark:border-white dark:bg-neutral-900' : 'border-neutral-300 dark:border-neutral-700'
									}`}
								>
									{previews.map((url, i) => (
										<div key={url} className="rv-pop group relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
											<Image src={url} alt="" fill sizes="160px" className="object-cover" unoptimized />
											<button
												type="button"
												onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
												aria-label={t('Remove_Photo')}
												className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white transition hover:bg-black"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									))}
									{files.length < PHOTOS_MAX && (
										<button
											type="button"
											onClick={() => fileInput.current?.click()}
											className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl bg-neutral-50 text-center text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 ${
												files.length ? '' : 'col-span-3 aspect-auto py-8 sm:col-span-4'
											}`}
										>
											<Camera className="h-7 w-7" />
											<span className="text-sm font-semibold">{t('Click_Add_Photos')}</span>
											{!files.length && <span className="text-xs">{t('Drag_Drop')}</span>}
										</button>
									)}
								</div>
								<input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
							</section>

							{/* 7. Honesty */}
							<section className={flag(!agreed)}>
								<label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-neutral-200 p-4 dark:border-neutral-800">
									<input
										type="checkbox"
										checked={agreed}
										onChange={(e) => setAgreed(e.target.checked)}
										className="mt-0.5 h-5 w-5 shrink-0 rounded border-neutral-300"
										style={{ accentColor: '#00AA6C' }}
									/>
									<span className="text-sm text-neutral-700 dark:text-neutral-300">
										<span className="font-semibold">{t('Certify_Short')}</span>{' '}
										<button
											type="button"
											onClick={(e) => {
												e.preventDefault()
												setShowTerms((v) => !v)
											}}
											className="font-semibold text-neutral-950 underline underline-offset-2 dark:text-white"
										>
											{t('Read_More')}
										</button>
										{showTerms && <span className="mt-2 block text-neutral-500">{t('Certify_Review')}</span>}
									</span>
								</label>
							</section>
						</div>

						{/* Footer: progress, what's missing, submit */}
						<footer className="border-t border-neutral-100 bg-white px-5 py-4 sm:px-8 dark:border-neutral-900 dark:bg-neutral-950">
							<div className="mb-3 h-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
								<div className="h-full rounded-full bg-[#00AA6C] transition-all duration-300" style={{ width: `${progress}%` }} />
							</div>
							{error && (
								<p role="alert" className="mb-2 text-sm font-medium text-red-600">
									{error}
								</p>
							)}
							{tried && missing.length > 0 && (
								<p role="alert" className="mb-2 text-sm text-red-600">
									{t('Still_Needed')} {missing.join(' · ')}
								</p>
							)}
							<div className="flex items-center justify-between gap-3">
								<button type="button" onClick={onClose} disabled={submitting} className="rounded-full px-5 py-3 font-semibold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900">
									{t('Cancel')}
								</button>
								<button
									type="button"
									onClick={submit}
									disabled={submitting}
									className={`rounded-full px-8 py-3 font-bold text-white shadow-lg transition ${
										missing.length ? 'bg-neutral-300 shadow-none dark:bg-neutral-700' : 'rv-ready bg-neutral-950 shadow-neutral-950/30 hover:-translate-y-0.5 active:scale-95 dark:bg-white dark:text-neutral-950'
									} disabled:opacity-60`}
								>
									{submitting ? t('Submitting') : t('Submit')}
								</button>
							</div>
						</footer>
					</>
				)}
			</div>
		</div>
		</>
	)
}

// Entrance, stagger, pop and success animations (calm when the visitor asks for less motion)
const REVIEW_ANIMATIONS = `
@keyframes rv-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes rv-in { from { opacity: 0; transform: translateY(40px) scale(.97) } to { opacity: 1; transform: none } }
@keyframes rv-up { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes rv-pop { 0% { transform: scale(.6) } 60% { transform: scale(1.15) } 100% { transform: scale(1.05) } }
@keyframes rv-ring { from { transform: scale(1); opacity: .9 } to { transform: scale(1.7); opacity: 0 } }
@keyframes rv-check { from { stroke-dasharray: 30; stroke-dashoffset: 30 } to { stroke-dasharray: 30; stroke-dashoffset: 0 } }
@keyframes rv-shine { from { background-position: -200% 0 } to { background-position: 200% 0 } }
.rv-fade { animation: rv-fade .25s ease-out both }
.rv-in { animation: rv-in .45s cubic-bezier(.16,1,.3,1) both }
.rv-up { animation: rv-up .45s cubic-bezier(.16,1,.3,1) both }
.rv-pop { animation: rv-pop .35s cubic-bezier(.34,1.56,.64,1) both }
.rv-ring { animation: rv-ring 1.2s ease-out .3s infinite }
.rv-check path, .rv-check polyline { animation: rv-check .5s ease-out .25s both }
.rv-body > section { animation: rv-up .5s cubic-bezier(.16,1,.3,1) both }
.rv-body > section:nth-child(2) { animation-delay: 60ms }
.rv-body > section:nth-child(3) { animation-delay: 120ms }
.rv-body > section:nth-child(4) { animation-delay: 180ms }
.rv-body > section:nth-child(5) { animation-delay: 240ms }
.rv-body > section:nth-child(6) { animation-delay: 300ms }
.rv-body > section:nth-child(7) { animation-delay: 360ms }
.rv-ready { background-image: linear-gradient(110deg, transparent 35%, rgba(255,255,255,.18) 50%, transparent 65%); background-size: 200% 100%; animation: rv-shine 2.2s linear infinite }
@media (prefers-reduced-motion: reduce) {
  .rv-fade, .rv-in, .rv-up, .rv-pop, .rv-ring, .rv-ready, .rv-body > section, .rv-check path, .rv-check polyline { animation: none !important }
}
`
