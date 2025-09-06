'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from '@/lib/i18n'
import { useSearchParams } from 'next/navigation'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'

export default function TravsusTravelPage() {
	const searchParams = useSearchParams()
	const query = searchParams.get('query') // ?query=Marrakech
	const start = searchParams.get('start') // ?query=Marrakech
	const end = searchParams.get('end') // ?query=Marrakech

	const t = useTranslations('TravsusTravelPage')
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState('all')
	const [priceRange, setPriceRange] = useState([0, 682])
	const [immediateConfirmation, setImmediateConfirmation] = useState(false)
	const [tours, setTours] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [sortBy, setSortBy] = useState('recommended')

	const dateOptions = [
		{ id: 'today', label: t('TravsusTravelPage_date_today') },
		{ id: 'tomorrow', label: t('TravsusTravelPage_date_tomorrow') },
		{ id: 'all', label: t('TravsusTravelPage_date_all_dates') },
	]

	const categories = [
		t('TravsusTravelPage_category_tours'),
		t('TravsusTravelPage_category_tickets'),
		t('TravsusTravelPage_category_transport'),
		t('TravsusTravelPage_category_hotels'),
	]

	const sortOptions = [
		{ value: 'recommended', label: t('TravsusTravelPage_sort_recommended') },
		{ value: 'price_low', label: t('TravsusTravelPage_sort_price_low') },
		{ value: 'price_high', label: t('TravsusTravelPage_sort_price_high') },
		{ value: 'best_rated', label: t('TravsusTravelPage_sort_best_rated') },
	]
	const params = new URLSearchParams()
	console.log('params-params-params-params:::', params)
	// Fetch tours from API
	useEffect(() => {
		const fetchTours = async () => {
			try {
				setLoading(true)
				// Build query parameters based on filters

				params.append('query', query)
				params.append('start', query)
				params.append('end', end)

				if (selectedDate !== 'all') {
					params.append('date', selectedDate)
				}

				params.append('minPrice', priceRange[0].toString())
				params.append('maxPrice', priceRange[1].toString())

				if (immediateConfirmation) {
					params.append('immediateConfirmation', 'true')
				}

				params.append('sortBy', sortBy)

				const response = await fetch(`/api/search?${params.toString()}`)

				if (!response.ok) {
					throw new Error(`Failed to fetch tours: ${response.status}`)
				}

				const data = await response.json()
				setTours(data.tours || [])
			} catch (err) {
				setError(err.message)
				console.error('Error fetching tours:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchTours()
	}, [
		selectedDate,
		priceRange,
		immediateConfirmation,
		sortBy,
		query,
		start,
		end,
	])

	// Handle sort change
	const handleSortChange = (e) => {
		setSortBy(e.target.value)
	}

	// Format price with currency
	const formatPrice = (price) => {
		return `€${parseFloat(price).toFixed(2)}`
	}

	// Calculate discount percentage
	const calculateDiscount = (originalPrice, discountedPrice) => {
		const discount = ((originalPrice - discountedPrice) / originalPrice) * 100
		return Math.round(discount)
	}

	const totlaPrice = (priceData: any) => {
		console.log('priceData:', priceData)
		let price = 0
		const { guests, lineItems, accommodation, transport, bookOwnHotels }: any =
			priceData || {}

		return price
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Mobile Header */}
			<div className="sticky top-0 z-30 border-b border-gray-200 bg-white p-4 lg:hidden">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-bold text-gray-900">Travsus</h1>
					<button
						onClick={() => setIsFilterOpen(true)}
						className="flex items-center space-x-1 rounded-lg bg-gray-100 px-3 py-2"
					>
						<svg
							className="h-5 w-5 text-gray-700"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
							/>
						</svg>
						<span className="text-gray-700">
							{t('TravsusTravelPage_filters')}
						</span>
					</button>
				</div>
			</div>

			{/* Mobile Filter Overlay */}
			{isFilterOpen && (
				<div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden">
					<div className="absolute right-0 top-0 h-full w-4/5 bg-white shadow-xl">
						<div className="flex h-full flex-col">
							{/* Filter Header */}
							<div className="flex items-center justify-between border-b border-gray-200 p-4">
								<h2 className="text-xl font-bold text-gray-900">
									{t('TravsusTravelPage_filters')}
								</h2>
								<button
									onClick={() => setIsFilterOpen(false)}
									className="rounded-lg p-1 hover:bg-gray-100"
								>
									<svg
										className="h-6 w-6 text-gray-700"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>

							{/* Filter Content */}
							<div className="flex-1 overflow-y-auto p-4">
								{/* Categories */}
								<div className="mb-6">
									<h3 className="mb-3 text-lg font-semibold text-gray-900">
										{t('TravsusTravelPage_categories')}
									</h3>
									<div className="space-y-2">
										{categories.map((category, index) => (
											<div key={index} className="flex items-center">
												<input
													type="checkbox"
													id={`mobile-cat-${index}`}
													className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-500"
												/>
												<label
													htmlFor={`mobile-cat-${index}`}
													className="ml-2 text-gray-700"
												>
													{category}
												</label>
											</div>
										))}
									</div>
								</div>

								{/* Dates */}
								<div className="mb-6">
									<h3 className="mb-3 text-lg font-semibold text-gray-900">
										{t('TravsusTravelPage_dates')}
									</h3>
									<div className="space-y-2">
										{dateOptions.map((option) => (
											<div key={option.id} className="flex items-center">
												<input
													type="radio"
													id={`mobile-${option.id}`}
													name="mobile-date"
													value={option.id}
													checked={selectedDate === option.id}
													onChange={() => setSelectedDate(option.id)}
													className="h-4 w-4 border-gray-300 text-gray-800 focus:ring-gray-500"
												/>
												<label
													htmlFor={`mobile-${option.id}`}
													className="ml-2 text-gray-700"
												>
													{option.label}
												</label>
											</div>
										))}
									</div>
								</div>

								{/* Price Range */}
								<div className="mb-6">
									<h3 className="mb-3 text-lg font-semibold text-gray-900">
										{t('TravsusTravelPage_price_range')}
									</h3>
									<div className="px-2">
										<input
											type="range"
											min="0"
											max="682"
											value={priceRange[1]}
											onChange={(e) =>
												setPriceRange([priceRange[0], parseInt(e.target.value)])
											}
											className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
										/>
										<div className="mt-2 flex justify-between text-sm text-gray-600">
											<span>€0</span>
											<span>€682</span>
										</div>
										<div className="mt-2 text-center text-sm text-gray-700">
											€0 - €{priceRange[1]}
										</div>
									</div>
								</div>

								{/* Other Filters */}
								<div className="mb-6">
									<h3 className="mb-3 text-lg font-semibold text-gray-900">
										{t('TravsusTravelPage_other')}
									</h3>
									<div className="space-y-2">
										<div className="flex items-center">
											<input
												type="checkbox"
												id="mobile-immediate-confirmation"
												checked={immediateConfirmation}
												onChange={() =>
													setImmediateConfirmation(!immediateConfirmation)
												}
												className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-500"
											/>
											<label
												htmlFor="mobile-immediate-confirmation"
												className="ml-2 text-gray-700"
											>
												{t('TravsusTravelPage_immediate_confirmation')}
											</label>
										</div>
									</div>
								</div>
							</div>

							{/* Filter Actions */}
							<div className="border-t border-gray-200 p-4">
								<div className="grid grid-cols-2 gap-3">
									<button
										onClick={() => {
											setSelectedDate('all')
											setPriceRange([0, 682])
											setImmediateConfirmation(false)
										}}
										className="rounded-lg border border-gray-300 py-2 text-gray-700 hover:bg-gray-50"
									>
										{t('TravsusTravelPage_clear')}
									</button>
									<button
										onClick={() => setIsFilterOpen(false)}
										className="rounded-lg bg-gray-900 py-2 text-white hover:bg-gray-800"
									>
										{t('TravsusTravelPage_apply_filters')}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="container mx-auto px-4 py-4 lg:py-8">
				<h1 className="mb-6 hidden text-2xl font-bold text-gray-900 lg:block">
					{t('TravsusTravelPage_results_for')}{' '}
					<span className="text-gray-700">{query}</span>
				</h1>

				<div className="flex flex-col gap-6 lg:flex-row">
					{/* Desktop Sidebar */}
					<div className="hidden w-full lg:block lg:w-1/4">
						<div className="sticky top-6 rounded-lg border border-gray-200 bg-white p-5">
							<div className="mb-6">
								<h2 className="mb-3 text-lg font-semibold text-gray-900">
									{t('TravsusTravelPage_categories')}
								</h2>
								<ul className="space-y-2">
									{categories.map((category, index) => (
										<li key={index} className="flex items-center">
											<input
												type="checkbox"
												id={`cat-${index}`}
												className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-500"
												defaultChecked={index === 0}
											/>
											<label
												htmlFor={`cat-${index}`}
												className="ml-2 text-gray-700"
											>
												{category}
											</label>
										</li>
									))}
								</ul>
							</div>

							<div className="mb-6">
								<h2 className="mb-3 text-lg font-semibold text-gray-900">
									{t('TravsusTravelPage_dates')}
								</h2>
								<div className="space-y-2">
									{dateOptions.map((option) => (
										<div key={option.id} className="flex items-center">
											<input
												type="radio"
												id={option.id}
												name="date"
												value={option.id}
												checked={selectedDate === option.id}
												onChange={() => setSelectedDate(option.id)}
												className="h-4 w-4 border-gray-300 text-gray-800 focus:ring-gray-500"
											/>
											<label htmlFor={option.id} className="ml-2 text-gray-700">
												{option.label}
											</label>
										</div>
									))}
								</div>
							</div>

							<div className="mb-6">
								<h2 className="mb-3 text-lg font-semibold text-gray-900">
									{t('TravsusTravelPage_price_range')}
								</h2>
								<input
									type="range"
									min="0"
									max="682"
									value={priceRange[1]}
									onChange={(e) =>
										setPriceRange([priceRange[0], parseInt(e.target.value)])
									}
									className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
								/>
								<div className="mt-2 flex justify-between text-sm text-gray-600">
									<span>€0</span>
									<span>€682</span>
								</div>
							</div>

							<div className="mb-6">
								<h2 className="mb-3 text-lg font-semibold text-gray-900">
									{t('TravsusTravelPage_other')}
								</h2>
								<div className="space-y-2">
									<div className="flex items-center">
										<input
											type="checkbox"
											id="immediate-confirmation"
											checked={immediateConfirmation}
											onChange={() =>
												setImmediateConfirmation(!immediateConfirmation)
											}
											className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-500"
										/>
										<label
											htmlFor="immediate-confirmation"
											className="ml-2 text-gray-700"
										>
											{t('TravsusTravelPage_immediate_confirmation')}
										</label>
									</div>
								</div>
							</div>

							<button className="w-full rounded-lg bg-gray-900 py-2 text-white transition-colors hover:bg-gray-800">
								{t('TravsusTravelPage_apply_filters')}
							</button>
						</div>
					</div>

					{/* Main Content */}
					<div className="w-full lg:w-3/4">
						{/* Results Header */}
						<div className="mb-6 flex flex-wrap items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
							<span className="font-medium text-gray-700">
								{loading
									? t('TravsusTravelPage_loading')
									: t('TravsusTravelPage_results_count', {
											count: tours.length,
										})}
							</span>
							<div className="mt-2 flex items-center space-x-4 lg:mt-0">
								<span className="hidden text-gray-600 lg:block">
									{t('TravsusTravelPage_sort_by')}:
								</span>
								<select
									value={sortBy}
									onChange={handleSortChange}
									className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 lg:text-base"
								>
									{sortOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Loading State */}
						{loading && (
							<div className="flex justify-center py-12">
								<div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900"></div>
							</div>
						)}

						{/* Error State */}
						{error && (
							<div className="rounded-lg bg-red-50 p-4">
								<div className="flex">
									<div className="flex-shrink-0">
										<svg
											className="h-5 w-5 text-red-400"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="ml-3">
										<h3 className="text-sm font-medium text-red-800">
											{t('TravsusTravelPage_error_loading')}
										</h3>
										<p className="mt-2 text-sm text-red-700">{error}</p>
									</div>
								</div>
							</div>
						)}

						{/* Tours List */}
						{!loading && !error && (
							<div className="space-y-6">
								{tours.length === 0 ? (
									<div className="rounded-lg bg-white p-8 text-center">
										<svg
											className="mx-auto h-12 w-12 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<h3 className="mt-2 text-sm font-medium text-gray-900">
											{t('TravsusTravelPage_no_tours_found')}
										</h3>
										<p className="mt-1 text-sm text-gray-500">
											{t('TravsusTravelPage_try_adjusting_filters')}
										</p>
									</div>
								) : (
									tours.map((tour) => (
										<div
											key={tour.id}
											className="overflow-hidden rounded-lg border border-gray-200 bg-white"
										>
											<div className="p-5">
												<div className="flex flex-col md:flex-row">
													<div className="mb-4 md:mb-0 md:w-1/3">
														<div className="flex h-40 items-center justify-center rounded-lg bg-gray-200">
															{tour.images && tour.images.length > 0 ? (
																<img
																	src={tour.images[0].url}
																	alt={tour.name}
																	className="h-full w-full rounded-lg object-cover"
																/>
															) : (
																<span className="text-gray-500">
																	{tour.name || 'Tour Image'}
																</span>
															)}
														</div>
													</div>

													<div className="md:w-2/3 md:pl-5">
														<div className="flex items-start justify-between">
															<div>
																<h3 className="mb-2 text-lg font-semibold text-gray-900">
																	{tour.name}
																</h3>
																{tour.subtitle && (
																	<p className="mb-2 text-sm text-gray-600">
																		{tour.subtitle}
																	</p>
																)}
																<div className="mb-2 flex items-center">
																	<div className="flex text-gray-800">
																		{[1, 2, 3, 4, 5].map((star) => (
																			<svg
																				key={star}
																				className={`h-4 w-4 fill-current ${star <= Math.floor(tour.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
																				viewBox="0 0 20 20"
																			>
																				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																			</svg>
																		))}
																	</div>
																	<span className="ml-2 text-sm text-gray-600">
																		{tour.averageRating
																			? tour.averageRating.toFixed(1)
																			: '0.0'}{' '}
																		({tour.reviewCount || 0})
																	</span>
																</div>
																<div className="mb-3 flex items-center text-sm text-gray-600">
																	<svg
																		className="mr-1 h-4 w-4 fill-current text-gray-700"
																		viewBox="0 0 20 20"
																	>
																		<path
																			fillRule="evenodd"
																			d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																			clipRule="evenodd"
																		/>
																	</svg>
																	{t(
																		'TravsusTravelPage_immediate_confirmation',
																	)}
																</div>
															</div>

															<div className="text-right">
																<div className="text-2xl font-bold text-gray-900">
																	{/* {formatPrice(
																		tour.discountedPrice || tour.price,
																	)} */}
																	{tour?.startPrice}
																</div>
																{tour.discountedPrice && tour.price && (
																	<>
																		<div className="text-sm text-gray-500 line-through">
																			{formatPrice(tour.price)}
																		</div>
																		<div className="mt-1 text-xs font-medium text-gray-700">
																			{t('TravsusTravelPage_save_percentage', {
																				percentage: calculateDiscount(
																					tour.price,
																					tour.discountedPrice,
																				),
																			})}
																		</div>
																	</>
																)}
															</div>
														</div>

														<div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
															<span className="text-sm text-gray-500">
																{tour.duration
																	? `${tour.duration} days`
																	: t('TravsusTravelPage_flexible_duration')}
															</span>
															<button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800">
																{t('TravsusTravelPage_book_now')}
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									))
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
