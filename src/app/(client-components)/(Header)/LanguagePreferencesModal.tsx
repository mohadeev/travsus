'use client'
import { FC, Fragment, useState, useEffect } from 'react'
import { Popover, Transition, Dialog } from '@headlessui/react'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
	className?: string
	variant?: 'nav' | 'footer'
}

const LanguagePreferencesModal: FC<Props> = ({
	className = '',
	variant = 'nav',
}) => {
	const [isLoading, setIsLoading] = useState(true)
	const [selectedLanguage, setSelectedLanguage] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const router = useRouter()
	const pathname = usePathname()

	const languages = [
		{ name: 'English (United States)', code: 'en-US' },
		{ name: 'Czech (Czech Republic)', code: 'cs-CZ' },
		{ name: 'Danish (Denmark)', code: 'da-DK' },
		{ name: 'German (Austria)', code: 'de-AT' },
		{ name: 'German (Switzerland)', code: 'de-CH' },
		{ name: 'German (Germany)', code: 'de-DE' },
		{ name: 'Greek (Greece)', code: 'el-GR' },
		{ name: 'English (Australia)', code: 'en-AU' },
		{ name: 'English (Canada)', code: 'en-CA' },
		{ name: 'English (United Kingdom)', code: 'en-GB' },
		{ name: 'English (Hong Kong)', code: 'en-HK' },
		{ name: 'English (Ireland)', code: 'en-IE' },
		{ name: 'English (India)', code: 'en-IN' },
		{ name: 'English (Malaysia)', code: 'en-MY' },
		{ name: 'English (New Zealand)', code: 'en-NZ' },
		{ name: 'English (Philippines)', code: 'en-PH' },
		{ name: 'English (Singapore)', code: 'en-SG' },
		{ name: 'Basque', code: 'eu' },
		{ name: 'English (South Africa)', code: 'en-ZA' },
		{ name: 'Spanish (Argentina)', code: 'es-AR' },
		{ name: 'Spanish (Chile)', code: 'es-CL' },
		{ name: 'Spanish (Colombia)', code: 'es-CO' },
		{ name: 'Spanish (Spain)', code: 'es-ES' },
		{ name: 'Spanish (Mexico)', code: 'es-MX' },
		{ name: 'Spanish (Peru)', code: 'es-PE' },
		{ name: 'Spanish (Venezuela)', code: 'es-VE' },
		{ name: 'Finnish (Finland)', code: 'fi-FI' },
		{ name: 'French (Belgium)', code: 'fr-BE' },
		{ name: 'French (Canada)', code: 'fr-CA' },
		{ name: 'French (Switzerland)', code: 'fr-CH' },
		{ name: 'French (France)', code: 'fr-FR' },
		{ name: 'Hungarian (Hungary)', code: 'hu-HU' },
		{ name: 'Indonesian (Indonesia)', code: 'id-ID' },
		{ name: 'Italian (Switzerland)', code: 'it-CH' },
		{ name: 'Italian (Italy)', code: 'it-IT' },
		{ name: 'Japanese (Japan)', code: 'ja-JP' },
		{ name: 'Korean (South Korea)', code: 'ko-KR' },
		{ name: 'Norwegian Bokmål (Norway)', code: 'nb-NO' },
		{ name: 'Dutch (Belgium)', code: 'nl-BE' },
		{ name: 'Dutch (Netherlands)', code: 'nl-NL' },
		{ name: 'Polish (Poland)', code: 'pl-PL' },
		{ name: 'Portuguese (Brazil)', code: 'pt-BR' },
		{ name: 'Portuguese (Portugal)', code: 'pt-PT' },
		{ name: 'Russian (Russia)', code: 'ru-RU' },
		{ name: 'Slovak (Slovakia)', code: 'sk-SK' },
		{ name: 'Serbian Latin (Serbia)', code: 'sr-Latn-RS' },
		{ name: 'Swedish (Sweden)', code: 'sv-SE' },
		{ name: 'Thai (Thailand)', code: 'th-TH' },
		{ name: 'Turkish (Turkey)', code: 'tr-TR' },
		{ name: 'Vietnamese (Vietnam)', code: 'vi-VN' },
		{ name: 'Chinese (Simplified, China)', code: 'zh-CN' },
		{ name: 'Chinese (Traditional, Hong Kong)', code: 'zh-Hant-HK' },
		{ name: 'Chinese (Traditional, Taiwan)', code: 'zh-TW' },
		{ name: 'English (Generic)', code: 'en' },
	]

	useEffect(() => {
		const currentLocale = pathname.split('/')[1] || 'en'
		const currentLanguage = languages.find(
			(lang) => lang.code === currentLocale,
		)
		setSelectedLanguage(currentLanguage?.name || 'English (Generic)')
	}, [pathname])

	const handleLanguageSelect = (language: { name: string; code: string }) => {
		setSelectedLanguage(language.name)
		localStorage.setItem('selectedLanguage', language.name)
		const segments = pathname.split('/').filter(Boolean)
		segments[0] = language.code
		const newPath = '/' + segments.join('/')
		router.push(newPath)
		setIsModalOpen(false)
	}

	const openModal = () => {
		setIsModalOpen(true)
		setIsLoading(true)
		setTimeout(() => setIsLoading(false), 300)
	}

	return (
		<>
			<Popover className={`relative flex ${className}`}>
				{({ open }) => (
					<>
						{variant === 'footer' ? (
							<button
								onClick={openModal}
								className="flex items-center justify-between rounded-xl border border-black px-2 py-1 text-sm font-medium focus:outline-none"
							>
								<span>{selectedLanguage}</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="ml-2 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
						) : (
							<Popover.Button
								className={`${open ? '' : 'text-opacity-90'} group relative inline-flex h-10 w-10 items-center justify-center self-center rounded-full text-base font-medium hover:bg-gray-100 hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:hover:bg-neutral-800 sm:h-12 sm:w-12`}
								onClick={openModal}
							>
								<GlobeAltIcon className="h-6 w-6" />
							</Popover.Button>
						)}
					</>
				)}
			</Popover>

			<Transition appear show={isModalOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-50"
					onClose={() => setIsModalOpen(false)}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-50" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
									<div className="relative max-h-[90vh] overflow-y-auto">
										<div className="p-7">
											{isLoading ? (
												<div className="space-y-6">
													<div className="h-8 w-48 animate-pulse rounded bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"></div>
													<div className="h-6 w-72 animate-pulse rounded bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"></div>
													<div className="h-6 w-48 animate-pulse rounded bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"></div>
													<div className="h-16 animate-pulse rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"></div>
													<div className="h-6 w-72 animate-pulse rounded bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"></div>
													<div className="grid grid-cols-2 gap-3">
														{[...Array(8)].map((_, i) => (
															<div
																key={i}
																className="h-16 animate-pulse rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"
															></div>
														))}
													</div>
												</div>
											) : (
												<div className="space-y-6">
													<Dialog.Title
														as="h3"
														className="text-xl font-semibold"
													>
														Language Preferences
													</Dialog.Title>

													<div className="space-y-4">
														<h4 className="text-base font-medium">
															Choose a language
														</h4>
														<div className="grid max-h-[60vh] grid-cols-1 gap-2 overflow-y-auto">
															{languages.map((language, index) => (
																<button
																	key={index}
																	className={`flex items-center justify-between rounded-lg p-3 text-left transition-all ${
																		selectedLanguage === language.name
																			? 'bg-black font-medium text-white'
																			: 'bg-gray-50 hover:bg-gray-100 dark:bg-neutral-700'
																	}`}
																	onClick={() => handleLanguageSelect(language)}
																>
																	<span>{language.name}</span>
																	<span className="text-sm opacity-70">
																		{language.code}
																	</span>
																</button>
															))}
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export default LanguagePreferencesModal
