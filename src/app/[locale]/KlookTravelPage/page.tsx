'use client'
import { useState } from 'react'
import { useTranslations } from '@/lib/i18n'

export default function TravsusTravelPage() {
	const t = useTranslations('TravsusTravelPage')
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState('all')
	const [priceRange, setPriceRange] = useState([0, 682])
	const [immediateConfirmation, setImmediateConfirmation] = useState(false)

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
		t('TravsusTravelPage_sort_recommended'),
		t('TravsusTravelPage_sort_price_low'),
		t('TravsusTravelPage_sort_price_high'),
		t('TravsusTravelPage_sort_best_rated'),
	]

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Mobile Header */}
			<div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 lg:hidden">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-bold text-gray-900">Travsus</h1>
					<button
						onClick={() => setIsFilterOpen(!isFilterOpen)}
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

			<div className="container mx-auto px-4 py-4 lg:py-8">
				<h1 className="mb-6 hidden text-2xl font-bold text-gray-900 lg:block">
					{t('TravsusTravelPage_results_for')}{' '}
					<span className="text-gray-700">"universal studios japan"</span>
				</h1>

				<div className="flex flex-col gap-6 lg:flex-row">
					{/* Mobile Filter Overlay */}
					{isFilterOpen && (
						<div
							className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
							onClick={() => setIsFilterOpen(false)}
						>
							<div
								className="absolute right-0 top-0 h-full w-4/5 overflow-y-auto bg-white"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="p-5">
									<div className="mb-6 flex items-center justify-between">
										<h2 className="text-xl font-bold text-gray-900">
											{t('TravsusTravelPage_filters')}
										</h2>
										<button onClick={() => setIsFilterOpen(false)}>
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

									<div className="mb-6">
										<h2 className="mb-3 text-lg font-semibold text-gray-900">
											{t('TravsusTravelPage_main_category')}
										</h2>
										<div className="grid grid-cols-2 gap-2">
											{categories.map((category, index) => (
												<button
													key={index}
													className="rounded-lg border border-gray-300 px-3 py-2 text-center text-sm text-gray-700 hover:bg-gray-50"
												>
													{category}
												</button>
											))}
										</div>
									</div>

									<div className="mb-6">
										<h2 className="mb-3 text-lg font-semibold text-gray-900">
											{t('TravsusTravelPage_price_range')}
										</h2>
										<div className="px-2">
											<input
												type="range"
												min="0"
												max="682"
												value={priceRange[1]}
												onChange={(e) =>
													setPriceRange([
														priceRange[0],
														parseInt(e.target.value),
													])
												}
												className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
											/>
											<div className="mt-2 flex justify-between text-sm text-gray-600">
												<span>€0</span>
												<span>€682</span>
											</div>
											<div className="mt-2 text-center text-gray-700">
												€0 - €{priceRange[1]}
											</div>
										</div>
									</div>

									<div className="mb-6">
										<h2 className="mb-3 text-lg font-semibold text-gray-900">
											{t('TravsusTravelPage_location')}
										</h2>
										<div className="flex items-center">
											<input
												type="checkbox"
												id="location-filter"
												className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-500"
											/>
											<label
												htmlFor="location-filter"
												className="ml-2 text-gray-700"
											>
												{t('TravsusTravelPage_location_filter')}
											</label>
										</div>
										<button className="mt-2 flex items-center text-sm text-gray-700">
											<span>{t('TravsusTravelPage_view_all')}</span>
											<svg
												className="ml-1 h-4 w-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>
									</div>

									<div className="mb-6">
										<h2 className="mb-3 text-lg font-semibold text-gray-900">
											{t('TravsusTravelPage_other')}
										</h2>
										<div className="flex items-center">
											<input
												type="checkbox"
												id="immediate-confirmation-mobile"
												checked={immediateConfirmation}
												onChange={() =>
													setImmediateConfirmation(!immediateConfirmation)
												}
												className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-500"
											/>
											<label
												htmlFor="immediate-confirmation-mobile"
												className="ml-2 text-gray-700"
											>
												{t('TravsusTravelPage_immediate_confirmation')}
											</label>
										</div>
									</div>

									<div className="mt-8 flex space-x-3">
										<button className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700">
											{t('TravsusTravelPage_clear')}
										</button>
										<button
											className="flex-1 rounded-lg bg-gray-900 py-2 text-white"
											onClick={() => setIsFilterOpen(false)}
										>
											{t('TravsusTravelPage_apply')}
										</button>
									</div>
								</div>
							</div>
						</div>
					)}

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
								{t('TravsusTravelPage_results_count', { count: 38 })}
							</span>
							<div className="mt-2 flex items-center space-x-4 lg:mt-0">
								<span className="hidden text-gray-600 lg:block">
									{t('TravsusTravelPage_sort_by')}:
								</span>
								<select className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 lg:text-base">
									{sortOptions.map((option, index) => (
										<option key={index}>{option}</option>
									))}
								</select>
							</div>
						</div>

						{/* Product Cards */}
						<div className="space-y-6">
							{/* Product Card 1 */}
							<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
								<div className="p-5">
									<div className="flex flex-col md:flex-row">
										<div className="mb-4 md:mb-0 md:w-1/3">
											<div className="flex h-40 items-center justify-center rounded-lg bg-gray-200">
												<span className="text-gray-500">
													UNIVERSAL STUDIOS JAPAN
												</span>
											</div>
										</div>

										<div className="md:w-2/3 md:pl-5">
											<div className="flex items-start justify-between">
												<div>
													<h3 className="mb-2 text-lg font-semibold text-gray-900">
														{t('TravsusTravelPage_product1_title')}
													</h3>
													<div className="mb-2 flex items-center">
														<div className="flex text-gray-800">
															{[1, 2, 3, 4].map((star) => (
																<svg
																	key={star}
																	className="h-4 w-4 fill-current"
																	viewBox="0 0 20 20"
																>
																	<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																</svg>
															))}
															<svg
																className="h-4 w-4 fill-current text-gray-300"
																viewBox="0 0 20 20"
															>
																<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
															</svg>
														</div>
														<span className="ml-2 text-sm text-gray-600">
															4.5 (12,494)
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
														{t('TravsusTravelPage_immediate_confirmation')}
													</div>
												</div>

												<div className="text-right">
													<div className="text-2xl font-bold text-gray-900">
														€62.30
													</div>
													<div className="text-sm text-gray-500 line-through">
														€68.90
													</div>
													<div className="mt-1 text-xs font-medium text-gray-700">
														{t('TravsusTravelPage_save_percentage', {
															percentage: 10,
														})}
													</div>
												</div>
											</div>

											<div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
												<span className="text-sm text-gray-500">
													{t('TravsusTravelPage_product1_duration')}
												</span>
												<button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800">
													{t('TravsusTravelPage_book_now')}
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Product Card 2 */}
							<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
								<div className="p-5">
									<div className="flex flex-col md:flex-row">
										<div className="mb-4 md:mb-0 md:w-1/3">
											<div className="flex h-40 items-center justify-center rounded-lg bg-gray-200">
												<span className="text-gray-500">EXPRESS PASS</span>
											</div>
										</div>

										<div className="md:w-2/3 md:pl-5">
											<div className="flex items-start justify-between">
												<div>
													<span className="mb-2 inline-block rounded-full border border-gray-300 bg-gray-100 px-2 py-1 text-xs text-gray-800">
														{t('TravsusTravelPage_fast_access')}
													</span>
													<h3 className="mb-2 text-lg font-semibold text-gray-900">
														{t('TravsusTravelPage_product2_title')}
													</h3>
													<div className="mb-2 flex items-center">
														<div className="flex text-gray-800">
															{[1, 2, 3, 4].map((star) => (
																<svg
																	key={star}
																	className="h-4 w-4 fill-current"
																	viewBox="0 0 20 20"
																>
																	<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																</svg>
															))}
															<svg
																className="h-4 w-4 fill-current text-gray-300"
																viewBox="0 0 20 20"
															>
																<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
															</svg>
														</div>
														<span className="ml-2 text-sm text-gray-600">
															4.7 (8,342)
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
														{t('TravsusTravelPage_immediate_confirmation')}
													</div>
												</div>

												<div className="text-right">
													<div className="text-2xl font-bold text-gray-900">
														€89.90
													</div>
													<div className="text-sm text-gray-500 line-through">
														€99.90
													</div>
													<div className="mt-1 text-xs font-medium text-gray-700">
														{t('TravsusTravelPage_save_percentage', {
															percentage: 10,
														})}
													</div>
												</div>
											</div>

											<div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
												<span className="text-sm text-gray-500">
													{t('TravsusTravelPage_product2_access')}
												</span>
												<button className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-800">
													{t('TravsusTravelPage_book_now')}
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
