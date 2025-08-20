'use client'

import { type FC, Fragment, useState, useEffect } from 'react'
import { Popover, Transition, Dialog, Tab } from '@headlessui/react'
import { GlobeAltIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from '@/lib/i18n'

interface Props {
	className?: string
	variant?: 'nav' | 'footer'
}

const LanguagePreferencesModal: FC<Props> = ({
	className = '',
	variant = 'nav',
}) => {
	const t = useTranslations('Jan03_LanguagePreferences_m7x4')
	const [isBeforeLoading, setIsBeforeLoading] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [selectedLanguage, setSelectedLanguage] = useState('')
	const [selectedCurrency, setSelectedCurrency] = useState('USD')
	const [currentLanguageCode, setCurrentLanguageCode] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [languageSearchTerm, setLanguageSearchTerm] = useState('')
	const [currencySearchTerm, setCurrencySearchTerm] = useState('')
	const router = useRouter()
	const pathname = usePathname()

	const languages = [
		{
			name: t('English'),
			country: t('United_States'),
			code: 'en-US',
			supported: true,
		},
		{
			name: t('Czech'),
			country: t('Czech_Republic'),
			code: 'cs-CZ',
			supported: false,
		},
		{
			name: t('Danish'),
			country: t('Denmark'),
			code: 'da-DK',
			supported: false,
		},
		{
			name: t('German'),
			country: t('Austria'),
			code: 'de-AT',
			supported: false,
		},
		{
			name: t('German'),
			country: t('Switzerland'),
			code: 'de-CH',
			supported: false,
		},
		{
			name: t('German'),
			country: t('Germany'),
			code: 'de-DE',
			supported: true,
		},
		{ name: t('Greek'), country: t('Greece'), code: 'el-GR', supported: false },
		{
			name: t('English'),
			country: t('Australia'),
			code: 'en-AU',
			supported: false,
		},
		{
			name: t('English'),
			country: t('Canada'),
			code: 'en-CA',
			supported: false,
		},
		{
			name: t('English'),
			country: t('United_Kingdom'),
			code: 'en-GB',
			supported: false,
		},
		{
			name: t('English'),
			country: t('Hong_Kong'),
			code: 'en-HK',
			supported: false,
		},
		{
			name: t('English'),
			country: t('Ireland'),
			code: 'en-IE',
			supported: false,
		},
		{
			name: t('English'),
			country: t('India'),
			code: 'en-IN',
			supported: false,
		},
		{
			name: t('English'),
			country: t('Malaysia'),
			code: 'en-MY',
			supported: false,
		},
		{
			name: t('English'),
			country: t('New_Zealand'),
			code: 'en-NZ',
			supported: false,
		},
		{
			name: t('English'),
			country: t('Philippines'),
			code: 'en-PH',
			supported: false,
		},
		{
			name: t('English'),
			country: t('Singapore'),
			code: 'en-SG',
			supported: false,
		},
		{ name: t('Basque'), country: '', code: 'eu', supported: false },
		{
			name: t('English'),
			country: t('South_Africa'),
			code: 'en-ZA',
			supported: false,
		},
		{
			name: t('Spanish'),
			country: t('Argentina'),
			code: 'es-AR',
			supported: false,
		},
		{
			name: t('Spanish'),
			country: t('Chile'),
			code: 'es-CL',
			supported: false,
		},
		{
			name: t('Spanish'),
			country: t('Colombia'),
			code: 'es-CO',
			supported: false,
		},
		{ name: t('Spanish'), country: t('Spain'), code: 'es-ES', supported: true },
		{
			name: t('Spanish'),
			country: t('Mexico'),
			code: 'es-MX',
			supported: false,
		},
		{ name: t('Spanish'), country: t('Peru'), code: 'es-PE', supported: false },
		{
			name: t('Spanish'),
			country: t('Venezuela'),
			code: 'es-VE',
			supported: false,
		},
		{
			name: t('Finnish'),
			country: t('Finland'),
			code: 'fi-FI',
			supported: false,
		},
		{
			name: t('French'),
			country: t('Belgium'),
			code: 'fr-BE',
			supported: false,
		},
		{
			name: t('French'),
			country: t('Canada'),
			code: 'fr-CA',
			supported: false,
		},
		{
			name: t('French'),
			country: t('Switzerland'),
			code: 'fr-CH',
			supported: false,
		},
		{ name: t('French'), country: t('France'), code: 'fr-FR', supported: true },
		{
			name: t('Hungarian'),
			country: t('Hungary'),
			code: 'hu-HU',
			supported: false,
		},
		{
			name: t('Indonesian'),
			country: t('Indonesia'),
			code: 'id-ID',
			supported: false,
		},
		{
			name: t('Italian'),
			country: t('Switzerland'),
			code: 'it-CH',
			supported: false,
		},
		{ name: t('Italian'), country: t('Italy'), code: 'it-IT', supported: true },
		{
			name: t('Japanese'),
			country: t('Japan'),
			code: 'ja-JP',
			supported: true,
		},
		{
			name: t('Korean'),
			country: t('South_Korea'),
			code: 'ko-KR',
			supported: true,
		},
		{
			name: t('Norwegian_Bokmal'),
			country: t('Norway'),
			code: 'nb-NO',
			supported: false,
		},
		{
			name: t('Dutch'),
			country: t('Belgium'),
			code: 'nl-BE',
			supported: false,
		},
		{
			name: t('Dutch'),
			country: t('Netherlands'),
			code: 'nl-NL',
			supported: false,
		},
		{
			name: t('Polish'),
			country: t('Poland'),
			code: 'pl-PL',
			supported: false,
		},
		{
			name: t('Portuguese'),
			country: t('Brazil'),
			code: 'pt-BR',
			supported: false,
		},
		{
			name: t('Portuguese'),
			country: t('Portugal'),
			code: 'pt-PT',
			supported: true,
		},
		{
			name: t('Russian'),
			country: t('Russia'),
			code: 'ru-RU',
			supported: true,
		},
		{
			name: t('Slovak'),
			country: t('Slovakia'),
			code: 'sk-SK',
			supported: false,
		},
		{
			name: t('Serbian_Latin'),
			country: t('Serbia'),
			code: 'sr-Latn-RS',
			supported: false,
		},
		{
			name: t('Swedish'),
			country: t('Sweden'),
			code: 'sv-SE',
			supported: false,
		},
		{
			name: t('Thai'),
			country: t('Thailand'),
			code: 'th-TH',
			supported: false,
		},
		{
			name: t('Turkish'),
			country: t('Turkey'),
			code: 'tr-TR',
			supported: false,
		},
		{
			name: t('Vietnamese'),
			country: t('Vietnam'),
			code: 'vi-VN',
			supported: false,
		},
		{
			name: t('Chinese_Simplified'),
			country: t('China'),
			code: 'zh-CN',
			supported: true,
		},
		{
			name: t('Chinese_Traditional'),
			country: t('Hong_Kong'),
			code: 'zh-Hant-HK',
			supported: false,
		},
		{
			name: t('Chinese_Traditional'),
			country: t('Taiwan'),
			code: 'zh-TW',
			supported: false,
		},
		{ name: t('English'), country: t('Generic'), code: 'en', supported: false },
	]

	const currencies = [
		// { name: t('US_Dollars'), code: 'USD', supported: true },
		{ name: t('Euros'), code: 'EUR', supported: true },
		// { name: t('British_Pounds'), code: 'GBP', supported: true },
		// { name: t('Japanese_Yen'), code: 'JPY', supported: true },
		// { name: t('Chinese_Yuan'), code: 'CNY', supported: true },
		// { name: t('Korean_Won'), code: 'KRW', supported: true },
		// { name: t('Russian_Rubles'), code: 'RUB', supported: true },
		// { name: t('Canadian_Dollars'), code: 'CAD', supported: true },
		// { name: t('Australian_Dollars'), code: 'AUD', supported: true },
		// { name: t('Swiss_Francs'), code: 'CHF', supported: true },
		// { name: t('Afghan_Afghanis'), code: 'AFN', supported: false },
		// { name: t('Albanian_Lek'), code: 'ALL', supported: false },
		// { name: t('Algerian_Dinar'), code: 'DZD', supported: false },
		// { name: t('Angolan_Kwanza'), code: 'AOA', supported: false },
		// { name: t('Argentine_Peso'), code: 'ARS', supported: false },
		// { name: t('Armenian_Dram'), code: 'AMD', supported: false },
		// { name: t('Aruban_Guilders'), code: 'AWG', supported: false },
		// { name: t('Azerbaijanian_Manat'), code: 'AZN', supported: false },
		// { name: t('Bahamian_Dollars'), code: 'BSD', supported: false },
		// { name: t('Bahraini_Dinar'), code: 'BHD', supported: false },
		// { name: t('Bangladeshi_Taka'), code: 'BDT', supported: false },
		// { name: t('Barbados_Dollars'), code: 'BBD', supported: false },
		// { name: t('Belarussian_Rubles'), code: 'BYN', supported: false },
		// { name: t('Belize_Dollars'), code: 'BZD', supported: false },
		// { name: t('Bermudian_Dollars'), code: 'BMD', supported: false },
		// { name: t('Bhutanese_Ngultrum'), code: 'BTN', supported: false },
		// { name: t('Bolivian_Boliviano'), code: 'BOB', supported: false },
		// { name: t('Bosnia_Herzegovina_Marks'), code: 'BAM', supported: false },
		// { name: t('Botswana_Pula'), code: 'BWP', supported: false },
		// { name: t('Brazilian_Real'), code: 'BRL', supported: false },
		// { name: t('Brunei_Dollars'), code: 'BND', supported: false },
		// { name: t('Bulgarian_Lev'), code: 'BGN', supported: false },
		// { name: t('Burmese_Kyat'), code: 'MMK', supported: false },
		// { name: t('Burundi_Francs'), code: 'BIF', supported: false },
		// { name: t('Cambodian_Riel'), code: 'KHR', supported: false },
		// { name: t('Cape_Verde_Escudo'), code: 'CVE', supported: false },
		// { name: t('Cayman_Islands_Dollars'), code: 'KYD', supported: false },
		// { name: t('CFA_Francs_BCEAO'), code: 'XOF', supported: false },
		// { name: t('CFA_Francs_BEAC'), code: 'XAF', supported: false },
		// { name: t('CFP_Francs'), code: 'XPF', supported: false },
		// { name: t('Chilean_Peso'), code: 'CLP', supported: false },
		// { name: t('Colombian_Peso'), code: 'COP', supported: false },
		// { name: t('Comoro_Francs'), code: 'KMF', supported: false },
		// { name: t('Congolese_Francs'), code: 'CDF', supported: false },
		// { name: t('Costa_Rican_Colon'), code: 'CRC', supported: false },
		// { name: t('Croatian_Kuna'), code: 'HRK', supported: false },
		// { name: t('Czech_Koruna'), code: 'CZK', supported: false },
		// { name: t('Danish_Krone'), code: 'DKK', supported: false },
		// { name: t('Djibouti_Francs'), code: 'DJF', supported: false },
		// { name: t('Dominican_Peso'), code: 'DOP', supported: false },
		// { name: t('East_Caribbean_Dollars'), code: 'XCD', supported: false },
		// { name: t('Egyptian_Pounds'), code: 'EGP', supported: false },
		// { name: t('Eritrean_Nakfa'), code: 'ERN', supported: false },
		// { name: t('Ethiopian_Birr'), code: 'ETB', supported: false },
		// { name: t('Falkland_Islands_Pounds'), code: 'FKP', supported: false },
		// { name: t('Fiji_Dollars'), code: 'FJD', supported: false },
		// { name: t('Gambian_Dalasi'), code: 'GMD', supported: false },
		// { name: t('Georgian_Lari'), code: 'GEL', supported: false },
		// { name: t('Ghanan_Cedi'), code: 'GHS', supported: false },
		// { name: t('Gibraltar_Pounds'), code: 'GIP', supported: false },
		// { name: t('Guatemalan_Quetzal'), code: 'GTQ', supported: false },
		// { name: t('Guinea_Francs'), code: 'GNF', supported: false },
		// { name: t('Guyana_Dollars'), code: 'GYD', supported: false },
		// { name: t('Haitian_Gourdes'), code: 'HTG', supported: false },
		// { name: t('Honduran_Lempiras'), code: 'HNL', supported: false },
		// { name: t('Hong_Kong_Dollars'), code: 'HKD', supported: false },
		// { name: t('Hungarian_Forint'), code: 'HUF', supported: false },
		// { name: t('Icelandic_Kronur'), code: 'ISK', supported: false },
		// { name: t('Indian_Rupees'), code: 'INR', supported: false },
		// { name: t('Indonesian_Rupiah'), code: 'IDR', supported: false },
		// { name: t('Iranian_Rial'), code: 'IRR', supported: false },
		// { name: t('Iraqi_Dinar'), code: 'IQD', supported: false },
		// { name: t('Jamaican_Dollars'), code: 'JMD', supported: false },
		// { name: t('Jordanian_Dinar'), code: 'JOD', supported: false },
		// { name: t('Kazakhstani_Tenge'), code: 'KZT', supported: false },
		// { name: t('Kenyan_Shilling'), code: 'KES', supported: false },
		// { name: t('Kuwaiti_Dinar'), code: 'KWD', supported: false },
		// { name: t('Kyrgyzstani_Som'), code: 'KGS', supported: false },
		// { name: t('Lao_Kip'), code: 'LAK', supported: false },
		// { name: t('Lebanese_Pounds'), code: 'LBP', supported: false },
		// { name: t('Liberian_Dollars'), code: 'LRD', supported: false },
		// { name: t('Libyan_Dinar'), code: 'LYD', supported: false },
		// { name: t('Macanese_Pataca'), code: 'MOP', supported: false },
		// { name: t('Macedonian_Denar'), code: 'MKD', supported: false },
		// { name: t('Malagasy_Ariary'), code: 'MGA', supported: false },
		// { name: t('Malawian_Kwacha'), code: 'MWK', supported: false },
		// { name: t('Malaysian_Ringgit'), code: 'MYR', supported: false },
		// { name: t('Maldivian_Rufiyaa'), code: 'MVR', supported: false },
		// { name: t('Mauritius_Rupees'), code: 'MUR', supported: false },
		// { name: t('Mexican_Peso'), code: 'MXN', supported: false },
		// { name: t('Moldovan_Leu'), code: 'MDL', supported: false },
		// { name: t('Mongolian_Tugrik'), code: 'MNT', supported: false },
		// { name: t('Moroccan_Dirham'), code: 'MAD', supported: false },
		// { name: t('Mozambican_Metical'), code: 'MZN', supported: false },
		// { name: t('Namibian_Dollars'), code: 'NAD', supported: false },
		// { name: t('Nepalese_Rupees'), code: 'NPR', supported: false },
		// {
		// 	name: t('Netherlands_Antillian_Guilders'),
		// 	code: 'ANG',
		// 	supported: false,
		// },
		// { name: t('New_Israeli_Sheqel'), code: 'ILS', supported: false },
		// { name: t('New_Taiwan_Dollars'), code: 'TWD', supported: false },
		// { name: t('New_Zealand_Dollars'), code: 'NZD', supported: false },
		// { name: t('Nicaraguan_Cordoba_Oro'), code: 'NIO', supported: false },
		// { name: t('Nigerian_Naira'), code: 'NGN', supported: false },
		// { name: t('North_Korean_Won'), code: 'KPW', supported: false },
		// { name: t('Norwegian_Krone'), code: 'NOK', supported: false },
		// { name: t('Pakistan_Rupees'), code: 'PKR', supported: false },
		// { name: t('Panamanian_Balboa'), code: 'PAB', supported: false },
		// { name: t('Papua_New_Guinean_Kina'), code: 'PGK', supported: false },
		// { name: t('Paraguayan_Guarani'), code: 'PYG', supported: false },
		// { name: t('Peruvian_Nuevos_Soles'), code: 'PEN', supported: false },
		// { name: t('Philippine_Peso'), code: 'PHP', supported: false },
		// { name: t('Polish_Zloty'), code: 'PLN', supported: false },
		// { name: t('Qatari_Rial'), code: 'QAR', supported: false },
		// { name: t('Rial_Omani'), code: 'OMR', supported: false },
		// { name: t('Romanian_New_Leu'), code: 'RON', supported: false },
		// { name: t('Rwandan_Francs'), code: 'RWF', supported: false },
		// { name: t('Saint_Helena_Pounds'), code: 'SHP', supported: false },
		// { name: t('Samoan_Tala'), code: 'WST', supported: false },
		// { name: t('Sao_Tome_Principe_Dobra'), code: 'STD', supported: false },
		// { name: t('Saudi_Riyal'), code: 'SAR', supported: false },
		// { name: t('Serbian_Dinar'), code: 'RSD', supported: false },
		// { name: t('Seychelles_Rupees'), code: 'SCR', supported: false },
		// { name: t('Sierra_Leonean_Leone'), code: 'SLL', supported: false },
		// { name: t('Singapore_Dollars'), code: 'SGD', supported: false },
		// { name: t('Solomon_Islands_Dollars'), code: 'SBD', supported: false },
		// { name: t('Somali_Shilling'), code: 'SOS', supported: false },
		// { name: t('South_African_Rand'), code: 'ZAR', supported: false },
		// { name: t('Sri_Lanka_Rupees'), code: 'LKR', supported: false },
		// { name: t('Sudanese_Pound'), code: 'SDG', supported: false },
		// { name: t('Surinam_Dollars'), code: 'SRD', supported: false },
		// { name: t('Swedish_Krona'), code: 'SEK', supported: false },
		// { name: t('Syrian_Pound'), code: 'SYP', supported: false },
		// { name: t('Tajikistani_Somoni'), code: 'TJS', supported: false },
		// { name: t('Tanzanian_Shilling'), code: 'TZS', supported: false },
		// { name: t('Thai_Baht'), code: 'THB', supported: false },
		// { name: t('Tongan_Paanga'), code: 'TOP', supported: false },
		// { name: t('Trinidad_Tobago_Dollars'), code: 'TTD', supported: false },
		// { name: t('Tunisian_Dinar'), code: 'TND', supported: false },
		// { name: t('Turkish_Lira'), code: 'TRY', supported: false },
		// { name: t('Turkmenistan_Manat'), code: 'TMT', supported: false },
		// { name: t('UAE_Dirham'), code: 'AED', supported: false },
		// { name: t('Uganda_Shilling'), code: 'UGX', supported: false },
		// { name: t('Ukrainian_Hryvnia'), code: 'UAH', supported: false },
		// { name: t('Uruguayan_Peso'), code: 'UYU', supported: false },
		// { name: t('Uzbekistan_Sum'), code: 'UZS', supported: false },
		// { name: t('Vanuatu_Vatu'), code: 'VUV', supported: false },
		// { name: t('Vietnamese_Dong'), code: 'VND', supported: false },
		// { name: t('Yemeni_Rial'), code: 'YER', supported: false },
	]

	const supportedLanguages = languages.filter((lang) => lang.supported === true)
	const supportedCurrencies = currencies.filter(
		(curr) => curr.supported === true,
	)

	const filteredLanguages = supportedLanguages.filter((lang) =>
		lang.name.toLowerCase().includes(languageSearchTerm.toLowerCase()),
	)

	const filteredCurrencies = supportedCurrencies.filter(
		(curr) =>
			curr.name.toLowerCase().includes(currencySearchTerm.toLowerCase()) ||
			curr.code.toLowerCase().includes(currencySearchTerm.toLowerCase()),
	)

	useEffect(() => {
		const currentLocale = pathname.split('/')[1] || 'en-US'
		setCurrentLanguageCode(currentLocale)
		const currentLanguage = supportedLanguages.find(
			(lang) => lang.code === currentLocale,
		)
		setSelectedLanguage(
			currentLanguage
				? `${currentLanguage.name} (${currentLanguage.country})`
				: 'English (United States)',
		)
		// Load saved currency or default to USD
		const savedCurrency = localStorage.getItem('selectedCurrency') || 'USD'
		setSelectedCurrency(savedCurrency)
	}, [pathname])

	const handleLanguageSelect = (language: {
		name: string
		country: string
		code: string
	}) => {
		const displayName = `${language.name} (${language.country})`
		setSelectedLanguage(displayName)
		setCurrentLanguageCode(language.code)
		localStorage.setItem('selectedLanguage', displayName)
		// Get current URL parts
		const currentUrl = new URL(window.location.href)
		const pathSegments = currentUrl.pathname.split('/').filter(Boolean)
		// Replace only the first segment (locale) with the new language code
		if (pathSegments.length > 0) {
			pathSegments[0] = language.code
		} else {
			pathSegments.unshift(language.code)
		}
		// Reconstruct the path
		const newPath = '/' + pathSegments.join('/')
		// Create new URL with same search params
		const newUrl = newPath + currentUrl.search
		router.push(newUrl)
		setIsModalOpen(false)
	}

	const handleCurrencySelect = (currency: { name: string; code: string }) => {
		setSelectedCurrency(currency.code)
		localStorage.setItem('selectedCurrency', currency.code)
		setIsModalOpen(false)
	}

	const openModal = () => {
		setIsModalOpen(true)
		setIsBeforeLoading(true)
		setIsLoading(false)
		setLanguageSearchTerm('')
		setCurrencySearchTerm('')
		// First show before loading for 100ms
		setTimeout(() => {
			setIsBeforeLoading(false)
			setIsLoading(true)
			// Then show loading for 300ms
			setTimeout(() => {
				setIsLoading(false)
			}, 300)
		}, 100)
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

					<div className="fixed inset-0 overflow-y-auto overflow-x-hidden">
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
								<Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
									<div className="relative overflow-hidden">
										{/* Header */}
										<div className="flex items-center justify-between border-b border-gray-200 p-4">
											<Dialog.Title
												as="h2"
												className="text-xl font-bold text-gray-900"
											>
												{t('Preferences_Title')}
											</Dialog.Title>
											<button
												onClick={() => setIsModalOpen(false)}
												className="rounded-full p-1 hover:bg-gray-100 focus:outline-none"
											>
												<XMarkIcon className="h-5 w-5 text-gray-500" />
											</button>
										</div>

										{/* Content */}
										<div className="overflow-hidden p-4">
											{isBeforeLoading ? (
												<div className="flex items-center justify-center py-16">
													<div className="flex flex-col items-center space-y-4">
														<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
														<p className="text-sm text-gray-600">
															{t('Opening_Preferences')}
														</p>
													</div>
												</div>
											) : isLoading ? (
												<div className="space-y-3">
													<div className="h-5 w-40 animate-pulse rounded bg-gray-200"></div>
													<div className="h-8 animate-pulse rounded-lg bg-gray-200"></div>
													<div className="grid grid-cols-4 gap-2">
														{[...Array(8)].map((_, i) => (
															<div
																key={i}
																className="h-16 animate-pulse rounded-lg bg-gray-200"
															></div>
														))}
													</div>
												</div>
											) : (
												<Tab.Group>
													<Tab.List className="mb-4 flex space-x-1 rounded-xl bg-gray-100 p-1">
														<Tab
															className={({ selected }) =>
																`w-full rounded-lg py-2 text-sm font-medium leading-5 transition-all ${
																	selected
																		? 'bg-white text-black shadow'
																		: 'text-gray-600 hover:bg-white/[0.12] hover:text-black'
																}`
															}
														>
															{t('Region_And_Language_Tab')}
														</Tab>
														<Tab
															className={({ selected }) =>
																`w-full rounded-lg py-2 text-sm font-medium leading-5 transition-all ${
																	selected
																		? 'bg-white text-black shadow'
																		: 'text-gray-600 hover:bg-white/[0.12] hover:text-black'
																}`
															}
														>
															{t('Currency_Tab')}
														</Tab>
													</Tab.List>

													<Tab.Panels className="overflow-hidden">
														{/* Language Panel */}
														<Tab.Panel className="overflow-hidden">
															<div className="space-y-4">
																<div>
																	<h3 className="mb-3 text-base font-semibold text-gray-900">
																		{t('Choose_Region_Language')}
																	</h3>
																	<input
																		type="text"
																		placeholder={t(
																			'Search_Languages_Placeholder',
																		)}
																		value={languageSearchTerm}
																		onChange={(e) =>
																			setLanguageSearchTerm(e.target.value)
																		}
																		className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
																	/>
																</div>
																<div className="max-h-64 overflow-y-auto overflow-x-hidden">
																	<div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
																		{filteredLanguages.map(
																			(language, index) => {
																				const isCurrent =
																					language.code === currentLanguageCode
																				return (
																					<button
																						key={index}
																						className={`relative min-w-0 rounded-lg border-2 p-3 text-left transition-all ${
																							isCurrent
																								? 'border-black bg-black text-white'
																								: 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50'
																						}`}
																						onClick={() =>
																							handleLanguageSelect(language)
																						}
																					>
																						<div className="flex min-w-0 flex-col space-y-1">
																							<span className="truncate text-xs font-semibold">
																								{language.country}
																							</span>
																							<span
																								className={`truncate text-xs ${
																									isCurrent
																										? 'text-gray-200'
																										: 'text-gray-600'
																								}`}
																							>
																								{language.name}
																							</span>
																						</div>
																						{isCurrent && (
																							<div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-green-500"></div>
																						)}
																					</button>
																				)
																			},
																		)}
																	</div>
																</div>
															</div>
														</Tab.Panel>

														{/* Currency Panel */}
														<Tab.Panel className="overflow-hidden">
															<div className="space-y-4">
																<div>
																	<h3 className="mb-3 text-base font-semibold text-gray-900">
																		{t('Choose_Currency')}
																	</h3>
																	<input
																		type="text"
																		placeholder={t(
																			'Search_Currencies_Placeholder',
																		)}
																		value={currencySearchTerm}
																		onChange={(e) =>
																			setCurrencySearchTerm(e.target.value)
																		}
																		className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
																	/>
																</div>
																<div className="max-h-64 overflow-y-auto overflow-x-hidden">
																	<div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
																		{filteredCurrencies.map(
																			(currency, index) => {
																				const isCurrent =
																					currency.code === selectedCurrency
																				return (
																					<button
																						key={index}
																						className={`relative min-w-0 rounded-lg border-2 p-3 text-left transition-all ${
																							isCurrent
																								? 'border-black bg-black text-white'
																								: 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50'
																						}`}
																						onClick={() =>
																							handleCurrencySelect(currency)
																						}
																					>
																						<div className="flex min-w-0 flex-col space-y-1">
																							<span className="truncate text-xs font-semibold">
																								{currency.name}
																							</span>
																							<span
																								className={`font-mono truncate text-xs ${
																									isCurrent
																										? 'text-gray-200'
																										: 'text-gray-600'
																								}`}
																							>
																								{currency.code}
																							</span>
																						</div>
																						{isCurrent && (
																							<div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-green-500"></div>
																						)}
																					</button>
																				)
																			},
																		)}
																	</div>
																</div>
															</div>
														</Tab.Panel>
													</Tab.Panels>
												</Tab.Group>
											)}
										</div>

										{/* Footer */}
										<div className="border-t border-gray-200 px-4 py-3">
											<p className="text-center text-xs text-gray-600">
												{t('Preferences_Footer_Text')}
											</p>
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
