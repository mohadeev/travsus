'use client'
// Tour title block, laid out as on TripAdvisor's tour pages: a top row with the
// breadcrumb (one line) and plain Share / Save icons, then the title over the
// full width (24/28px on phones), the real rating with green bubbles, and the
// tour's length and starting city.
import { useRef, useState } from 'react'
import Link from 'next/link'
import { Heart, Share } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import addAndRemoveToWishList from '@/utils/api-utils/addAndRemoveToWishList'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectUser } from '@/store/slices/user'
import { selectTourLiked, setTourLiked } from '@/store/slices/tourPage'
import { useTranslations as useIntlTranslations } from 'next-intl'
import { useTourService } from '../TourServiceContext'
import RatingBubbles from '@/app/[locale]/(home)/RatingBubbles'

// Plain icons (no circle), as on TripAdvisor; the round hover keeps a 40px tap target
const iconClass =
	'grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800'

const TourHeader = () => {
	const t = useTranslations('Jan03_TourHeader_x9k2')
	const tHome = useIntlTranslations('Home')
	const dispatch = useAppDispatch()
	const service: any = useTourService()
	const [toast, setToast] = useState('')
	const toastTimer = useRef<NodeJS.Timeout | null>(null)

	// Saved state: a toggle made on this visit wins, otherwise the user's list
	const savedList: string[] | undefined = useAppSelector(selectUser).savedList
	const likedNow = useAppSelector(selectTourLiked(service.id))
	const liked = likedNow ?? !!savedList?.includes(service.id)

	const title = service.name
	const country = service.days?.[0]?.country || service.startAddress?.country
	const city = service.days?.[0]?.city || service.startAddress?.city
	// Real numbers only: nothing is shown until the tour has reviews
	const reviews = service.reviewsCount || 0
	const rating = reviews > 0 ? Number(service.averageRating) : 0
	const recommended: number | null = reviews > 0 ? service.recommendedPercent ?? null : null

	const showToast = (text: string) => {
		setToast(text)
		if (toastTimer.current) clearTimeout(toastTimer.current)
		toastTimer.current = setTimeout(() => setToast(''), 2000)
	}

	// Phone share sheet when available, otherwise copy the link
	const handleShare = async () => {
		const url = window.location.href
		if (navigator.share) {
			await navigator.share({ title, url }).catch(() => {})
			return
		}
		try {
			await navigator.clipboard.writeText(url)
			showToast(t('Tour_Link_Copied'))
		} catch {
			showToast(t('Copy_Failed'))
		}
	}

	const scrollToReviews = () =>
		document.getElementById('experience_reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

	const handleSave = useAuthAction(async () => {
		const setLiked = (value: boolean) => dispatch(setTourLiked({ id: service.id, liked: value }))
		setLiked(!liked) // show it right away
		await addAndRemoveToWishList({ serviceId: service.id })
			.then((res: any) => {
				if (typeof res?.added === 'boolean') setLiked(res.added)
			})
			.catch(() => setLiked(liked)) // undo
	})

	const crumbs = [
		{ label: 'TRAVSUS', href: '/' },
		country && { label: country, href: `/search?query=${encodeURIComponent(country)}` },
		city && { label: city, href: `/search?query=${encodeURIComponent(city)}` },
	].filter(Boolean) as { label: string; href: string }[]
	const days = Array.isArray(service.days) ? service.days.length : 0

	return (
		<div className="pt-3">
			{/* Top row: breadcrumb on one line, Share and Save on the right */}
			<div className="flex items-center justify-between gap-3">
				<nav aria-label="Breadcrumb" className="min-w-0">
					<ol className="flex items-center gap-x-2 overflow-hidden whitespace-nowrap text-sm text-ink-soft dark:text-neutral-300">
						{crumbs.map((crumb) => (
							<li key={crumb.href} className="flex shrink-0 items-center gap-2">
								<Link href={crumb.href as any} className="underline underline-offset-2 hover:text-ink dark:hover:text-white">
									{crumb.label}
								</Link>
								<span aria-hidden className="text-neutral-400">›</span>
							</li>
						))}
						{/* The tour's name is the title just below: shown here from tablets only */}
						<li aria-current="page" className="hidden min-w-0 truncate sm:block">{title}</li>
					</ol>
				</nav>
				<div className="relative -mr-2 flex shrink-0 items-center">
					<button type="button" onClick={handleShare} aria-label={t('Share')} title={t('Share')} className={iconClass}>
						<Share className="h-[22px] w-[22px]" strokeWidth={1.8} />
					</button>
					<button
						type="button"
						onClick={() => handleSave(undefined)}
						aria-pressed={liked}
						aria-label={liked ? t('Saved') : t('Save')}
						title={liked ? t('Saved') : t('Save')}
						className={iconClass}
					>
						<Heart className={`h-[22px] w-[22px] ${liked ? 'fill-ink dark:fill-white' : ''}`} strokeWidth={1.8} />
					</button>
					{toast && (
						<p role="status" className="absolute right-0 top-full z-10 mt-2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white">
							{toast}
						</p>
					)}
				</div>
			</div>

			{/* Title over the full width: 24/28px on phones, as on TripAdvisor */}
			<h1 className="headline mt-3 text-2xl !leading-7 sm:text-[32px] sm:!leading-[38px] lg:text-[36px] lg:!leading-[42px]">{title}</h1>

			{/* Rating · recommended, then length · starting city (real numbers only) */}
			{reviews > 0 && (
				<p className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-base leading-6">
					<button type="button" onClick={scrollToReviews} className="inline-flex items-center gap-1.5 tabular-nums">
						<span>{rating.toFixed(1)}</span>
						<RatingBubbles rating={rating} size={16} tone="green" />
						<span className="underline underline-offset-4">
							{reviews.toLocaleString()} {t('Reviews')}
						</span>
					</button>
					{recommended !== null && recommended > 0 && (
						<>
							<Dot />
							<span>{t('Recommended_By_Percentage', { percentage: recommended })}</span>
						</>
					)}
				</p>
			)}
			{(days > 0 || city) && (
				<p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-base leading-6 text-ink-soft dark:text-neutral-300">
					{days > 0 && <span>{tHome('days_count', { count: days })}</span>}
					{days > 0 && city && <Dot />}
					{city && <span>{city}</span>}
				</p>
			)}
		</div>
	)
}

const Dot = () => <span aria-hidden className="h-1 w-1 rounded-full bg-neutral-400" />

export default TourHeader
