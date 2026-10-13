'use client'
// Tour title block: breadcrumb, title, real rating, and Share / Review / Save.
import { useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Heart, PenLine, Share } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import addAndRemoveToWishList from '@/utils/api-utils/addAndRemoveToWishList'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectUser } from '@/store/slices/user'
import { selectTourLiked, setTourLiked } from '@/store/slices/tourPage'
import RatingBubbles from '@/app/[locale]/(home)/RatingBubbles'
import { useTourService } from '../TourServiceContext'

const actionClass =
	'inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 dark:border-neutral-800'

const TourHeader = () => {
	const t = useTranslations('Jan03_TourHeader_x9k2')
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

	return (
		<div className="pt-6">
			<nav aria-label="Breadcrumb">
				<ol className="flex flex-wrap items-center gap-1 text-sm text-neutral-500">
					{crumbs.map((crumb, index) => (
						<li key={crumb.href} className="flex items-center gap-1">
							{index > 0 && <ChevronRight aria-hidden className="h-3.5 w-3.5" />}
							<Link href={crumb.href as any} className="hover:text-brand-600 hover:underline">
								{crumb.label}
							</Link>
						</li>
					))}
				</ol>
			</nav>

			<div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div className="min-w-0">
					<h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{title}</h1>
					{reviews > 0 && (
						<button
							type="button"
							onClick={scrollToReviews}
							className="mt-3 inline-flex items-center gap-2 text-sm"
						>
							<span className="font-semibold">{rating.toFixed(1)}</span>
							<RatingBubbles rating={rating} size={13} tone="green" />
							<span className="text-neutral-500 underline underline-offset-4">
								{reviews.toLocaleString()} {t('Reviews')}
							</span>
						</button>
					)}
				</div>

				<div className="relative flex shrink-0 items-center gap-2">
					<button type="button" onClick={handleShare} className={actionClass}>
						<Share className="h-4 w-4" />
						{t('Share')}
					</button>
					<button type="button" onClick={scrollToReviews} className={actionClass}>
						<PenLine className="h-4 w-4" />
						{t('Review')}
					</button>
					<button type="button" onClick={() => handleSave(undefined)} aria-pressed={liked} className={actionClass}>
						<Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
						{liked ? t('Saved') : t('Save')}
					</button>
					{toast && (
						<p role="status" className="absolute right-0 top-full mt-2 rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-medium text-white">
							{toast}
						</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default TourHeader
