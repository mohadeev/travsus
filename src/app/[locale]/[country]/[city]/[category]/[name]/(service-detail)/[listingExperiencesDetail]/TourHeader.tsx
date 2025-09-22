'use client'

import { useTranslations } from '@/lib/i18n'
import { updateServiceState } from '@/app/[locale]/GlobalRedux/Features/creatingServiceSlice/creatingServiceSlice'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import addAndRemoveToWishList from '@/utils/api-utils/addAndRemoveToWishList'
import {
	ChevronRight,
	ChevronLeft,
	Shield,
	Heart,
	ArrowLeft,
	Share,
	Edit,
	BadgeCheck,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { Motion, spring } from 'react-motion'
import TourHeaderSkeleton from './TourHeaderSkeleton'

const TourHeader = () => {
	const t = useTranslations('Jan03_TourHeader_x9k2')
	const dispatch = useDispatch()
	const searchParams = useSearchParams()
	const serviceId = searchParams.get('serviceId')

	// Share dropdown state
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [copySuccess, setCopySuccess] = useState('')
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const service: any = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)
	const {
		days,
		liked,
		rating,
		reviewsCount,
		recommendationPercentage,
		loading,
	} = service
	const title = service.title
	const day = days?.[0]
	// Safely extract city name - handle both string and object cases
	const city = day?.city
	const continent = day?.continent
	// Safely extract region name - handle both string and object cases
	const regionName = day?.state
	const countryName = day?.country

	// Share functionality
	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen)
	}

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href)
			setCopySuccess(t('Tour_Link_Copied'))
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
			timeoutRef.current = setTimeout(() => setCopySuccess(''), 2000)
		} catch (err) {
			setCopySuccess(t('Copy_Failed'))
		}
		setIsDropdownOpen(false)
	}

	const handleEmail = () => {
		const subject = encodeURIComponent(t('Email_Subject'))
		const body = encodeURIComponent(
			t('Email_Body', { url: window.location.href }),
		)
		window.location.href = `mailto:?subject=${subject}&body=${body}`
		setIsDropdownOpen(false)
	}

	// Wishlist functionality
	const handleAddToWishList = useAuthAction(async () => {
		dispatch(updateServiceState({ path: 'service.liked', value: !liked }))
		await addAndRemoveToWishList({ serviceId })
			.then((res: any) => {
				if (res?.added === false || res?.added === true) {
					dispatch(
						updateServiceState({ path: 'service.liked', value: res?.added }),
					)
				}
			})
			.catch(() => {
				dispatch(updateServiceState({ path: 'service.liked', value: !liked }))
			})
	})

	// Click outside handler for dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	// Show skeleton while loading or if essential data is missing
	if (loading || !title || !city) {
		return <TourHeaderSkeleton />
	}

	const links = [
		{ value: continent, href: '#' },
		{ value: countryName, href: '#' },
		{
			value: regionName,
			href: `#`,
		},
		{ value: city, href: '#' },
		{
			value: t('things_to_do'),
			href: `#`,
		},
		{ value: t('tours'), href: `#` },
	]

	// Tour data with fallbacks
	const tourRating = rating || 5.0
	const totalReviews = reviewsCount || 0
	const recommendedBy = recommendationPercentage || 100

	const renderStars = (rating: number) => {
		const stars = []
		const fullStars = Math.floor(rating)
		for (let i = 0; i < 5; i++) {
			if (i < fullStars) {
				stars.push(
					<div key={i} className="h-4 w-4 rounded-full bg-green-600" />,
				)
			} else {
				stars.push(<div key={i} className="h-4 w-4 rounded-full bg-gray-300" />)
			}
		}
		return stars
	}
	const handleScroll = () => {
		const el = document.getElementById('experience_reviews')
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	return (
		<div className="nc-ListingExperiencesDetailPage mb-6">
			{/* Mobile Header - Only visible on mobile */}
			<div className="block md:hidden">
				{/* Mobile Top Navigation */}
				<div className="flex items-center justify-between border-b border-gray-200 py-4">
					{/* Back Button */}
					<Link href={`/`} className="-ml-2 p-2">
						<ArrowLeft className="h-6 w-6 text-black" strokeWidth={2} />
					</Link>

					{/* Action Icons */}
					<div className="flex items-center gap-4">
						{/* Share Button */}
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={toggleDropdown}
								className="p-2"
								aria-haspopup="true"
								aria-expanded={isDropdownOpen}
							>
								<Share className="h-6 w-6 text-black" strokeWidth={2} />
							</button>

							{/* Share Dropdown */}
							<Motion
								style={{
									opacity: spring(isDropdownOpen ? 1 : 0),
									scale: spring(isDropdownOpen ? 1 : 0.95),
								}}
							>
								{(interpolatedStyle) =>
									isDropdownOpen && (
										<div
											className="absolute right-0 z-10 mt-2 w-48 rounded-xl border-2 border-black bg-white p-2 shadow-2xl"
											style={{
												opacity: interpolatedStyle.opacity,
												transform: `scale(${interpolatedStyle.scale})`,
												transformOrigin: 'top right',
											}}
										>
											<div
												className="py-1"
												role="menu"
												aria-orientation="vertical"
											>
												<button
													onClick={handleCopyLink}
													className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-black transition-colors duration-200 hover:bg-black hover:text-white"
													role="menuitem"
												>
													{t('Copy_Tour_Link')}
												</button>
												<button
													onClick={handleEmail}
													className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-black transition-colors duration-200 hover:bg-black hover:text-white"
													role="menuitem"
												>
													{t('Email_Tour')}
												</button>
											</div>
										</div>
									)
								}
							</Motion>

							{/* Copy Success Message */}
							{copySuccess && (
								<div className="absolute right-0 z-20 mt-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white shadow-lg">
									{copySuccess}
								</div>
							)}
						</div>

						{/* Review Button */}
						<button onClick={handleScroll} className="p-2">
							<Edit className="h-6 w-6 text-black" strokeWidth={2} />
						</button>

						{/* Save Button */}
						<button onClick={handleAddToWishList} className="p-2">
							{liked ? (
								<Heart
									className="h-6 w-6 fill-current text-red-500"
									strokeWidth={2}
								/>
							) : (
								<Heart className="h-6 w-6 text-black" strokeWidth={2} />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Content */}
				<div className="space-y-4 py-4">
					{/* Title */}
					<h1 className="text-2xl font-extrabold leading-tight text-black">
						{String(title)}
					</h1>

					{/* Rating Section */}
					<div className="space-y-3">
						{/* Star Rating - Mobile uses star icons */}
						<div className="flex items-center gap-2">
							<span className="text-lg font-bold text-black">{tourRating}</span>
							<div className="flex items-center gap-0.5">
								{renderStars(tourRating)}
							</div>
							<Link
								href="#reviews"
								className="font-medium text-black underline"
							>
								({totalReviews.toLocaleString()} {t('Reviews')})
							</Link>
						</div>

						{/* Recommendation Badge */}
						<div className="flex items-center gap-2">
							{/* <Shield
								className="h-4 w-4 fill-current text-red-500"
								strokeWidth={2}
							/> */}
							<BadgeCheck
								className="h-4 w-4 fill-current text-red-500"
								strokeWidth={2}
							/>

							<span className="text-sm font-medium text-black/80">
								{t('Recommended_By_Percentage', { percentage: recommendedBy })}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Desktop Header - Hidden on mobile */}
			<div className="hidden md:block">
				{/* Breadcrumb Navigation */}
				<nav className="mb-3" aria-label="Breadcrumb">
					<div className="flex items-center space-x-1 text-sm text-black/70">
						{links.map(({ value, href }, index) => (
							<div key={index} className="flex items-center">
								{index > 0 && (
									<ChevronRight className="mx-1 h-3 w-3 flex-shrink-0 text-black/50" />
								)}
								<Link
									href={href}
									className="font-medium transition-colors duration-200 hover:text-black hover:underline"
								>
									{String(value)}
								</Link>
							</div>
						))}
					</div>
				</nav>

				{/* Back Button */}
				<div className="mb-4">
					<Link
						href={`/destinations/${city?.toLowerCase()}/attractions`}
						className="inline-flex items-center text-black/70 transition-colors duration-200 hover:text-black"
					>
						<ChevronLeft className="mr-1 h-4 w-4 text-black" />
						<span className="text-sm font-medium underline">
							{t('Discover_All_Things', { city: String(city) })}
						</span>
					</Link>
				</div>

				{/* Main Header Content */}
				<div className="space-y-4">
					{/* Title and Action Buttons */}
					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						{/* Title */}
						<div className="min-w-0 flex-1">
							<h1 className="text-2xl font-extrabold leading-tight text-black sm:text-3xl lg:text-4xl lg:leading-tight">
								{String(title)}
							</h1>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-shrink-0 items-center gap-3 px-4">
							{/* Share Button with Dropdown */}
							<div className="relative" ref={dropdownRef}>
								<button
									onClick={toggleDropdown}
									className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-semibold text-black transition-all duration-200 hover:bg-black hover:text-white"
									aria-haspopup="true"
									aria-expanded={isDropdownOpen}
								>
									<Share className="h-4 w-4" strokeWidth={2} />
									<span className="hidden sm:inline">{t('Share')}</span>
								</button>

								{/* Share Dropdown */}
								<Motion
									style={{
										opacity: spring(isDropdownOpen ? 1 : 0),
										scale: spring(isDropdownOpen ? 1 : 0.95),
									}}
								>
									{(interpolatedStyle) =>
										isDropdownOpen && (
											<div
												className="absolute right-0 z-10 mt-2 w-48 rounded-xl border-2 border-black bg-white p-2 shadow-2xl"
												style={{
													opacity: interpolatedStyle.opacity,
													transform: `scale(${interpolatedStyle.scale})`,
													transformOrigin: 'top right',
												}}
											>
												<div
													className="py-1"
													role="menu"
													aria-orientation="vertical"
												>
													<button
														onClick={handleCopyLink}
														className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-black transition-colors duration-200 hover:bg-black hover:text-white"
														role="menuitem"
													>
														{t('Copy_Tour_Link')}
													</button>
													<button
														onClick={handleEmail}
														className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-black transition-colors duration-200 hover:bg-black hover:text-white"
														role="menuitem"
													>
														{t('Email_Tour')}
													</button>
												</div>
											</div>
										)
									}
								</Motion>

								{/* Copy Success Message */}
								{copySuccess && (
									<div className="absolute right-0 z-20 mt-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white shadow-lg">
										{copySuccess}
									</div>
								)}
							</div>

							{/* Review Button */}
							<button
								onClick={handleScroll}
								className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-semibold text-black transition-all duration-200 hover:bg-black hover:text-white"
							>
								<Edit className="h-4 w-4" strokeWidth={2} />
								<span className="hidden sm:inline">{t('Review')}</span>
							</button>

							{/* Save Button */}
							<button
								onClick={handleAddToWishList}
								className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-semibold text-black transition-all duration-200 hover:bg-black hover:text-white"
							>
								{liked ? (
									<Heart
										className="h-4 w-4 fill-current text-red-500"
										strokeWidth={2}
									/>
								) : (
									<Heart className="h-4 w-4" strokeWidth={2} />
								)}
								<span className="hidden sm:inline">
									{liked ? t('Saved') : t('Save')}
								</span>
							</button>
						</div>
					</div>

					{/* Rating and Reviews Section - Desktop uses yellow stars */}
					<div className="flex flex-wrap items-center gap-4 text-sm">
						{/* Star Rating */}
						<div className="flex items-center gap-2">
							<span className="text-lg font-bold text-black">{tourRating}</span>
							<div className="flex items-center gap-0.5">
								{renderStars(tourRating)}
							</div>
							<Link
								href="#reviews"
								className="font-medium text-black/70 underline transition-colors duration-200 hover:text-black"
							>
								({totalReviews.toLocaleString()} {t('Reviews')})
							</Link>
						</div>

						{/* Recommendation Badge */}
						<div className="flex items-center gap-2 text-black/70">
							<BadgeCheck fill className="h-6 w-6 fill-blue-500 text-white" />
							<span className="font-medium">
								{t('Recommended_By_Percentage', { percentage: recommendedBy })}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TourHeader
