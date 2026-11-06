'use client'
// Tour title block: breadcrumb, title with round Share / Save buttons, the real
// rating, and the tour's length and starting city.
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
import Stars from './ReviewSystem/Stars'

const iconClass =
	'grid h-11 w-11 place-items-center rounded-full border border-neutral-200 bg-white text-black transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800'

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
		<div className="pt-4">
			{/* Breadcrumb: underlined links, › between, the tour's name last */}
			<nav aria-label="Breadcrumb">
				<ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-700 dark:text-neutral-300">
					{crumbs.map((crumb) => (
						<li key={crumb.href} className="flex items-center gap-2">
							<Link href={crumb.href as any} className="underline underline-offset-2 hover:text-black dark:hover:text-white">
								{crumb.label}
							</Link>
							<span aria-hidden className="text-neutral-400">›</span>
						</li>
					))}
					<li aria-current="page" className="min-w-0 truncate">{title}</li>
				</ol>
			</nav>

			{/* Title with round Share and Save buttons on the right */}
			<div className="mt-3.5 flex items-start justify-between gap-4">
				<h1 className="headline min-w-0 text-[28px] !leading-[1.12] sm:text-[36px] lg:text-[40px]">{title}</h1>
				<div className="relative flex shrink-0 items-center gap-2">
					<button type="button" onClick={handleShare} aria-label={t('Share')} title={t('Share')} className={iconClass}>
						<Share className="h-5 w-5" strokeWidth={2} />
					</button>
					<button
						type="button"
						onClick={() => handleSave(undefined)}
						aria-pressed={liked}
						aria-label={liked ? t('Saved') : t('Save')}
						title={liked ? t('Saved') : t('Save')}
						className={iconClass}
					>
						<Heart className={`h-5 w-5 ${liked ? 'fill-black dark:fill-white' : ''}`} strokeWidth={2} />
					</button>
					{toast && (
						<p role="status" className="absolute right-0 top-full z-10 mt-2 whitespace-nowrap rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-medium text-white">
							{toast}
						</p>
					)}
				</div>
			</div>

			{/* Rating · recommended, then length · starting city (real numbers only) */}
			{reviews > 0 && (
				<p className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[15px]">
					<button type="button" onClick={scrollToReviews} className="inline-flex items-center gap-2 tabular-nums">
						<b className="font-extrabold">{rating.toFixed(1)}</b>
						<Stars rating={rating} />
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
				<p className="mt-1.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[15px] text-neutral-700 dark:text-neutral-300">
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
