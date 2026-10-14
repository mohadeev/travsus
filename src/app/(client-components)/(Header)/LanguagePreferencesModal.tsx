'use client'
// Language picker: a globe button (header) or a pill (menus, footer) that opens
// a list of the site's languages. Phones get a bottom sheet, larger screens a
// small dialog. Picking a language opens the same page in that language.
import { Fragment, useEffect, useMemo, useState, useTransition, type FC } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Check, ChevronDown, Globe, Loader2, X } from 'lucide-react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { useTranslations } from '@/lib/i18n'

interface Props {
	className?: string
	/** 'nav': globe icon only. 'footer': globe, language name and arrow. */
	variant?: 'nav' | 'footer'
	/** The pill sits on a dark background */
	dark?: boolean
}

const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase() + text.slice(1)

/** "Deutsch" (the language in its own words). */
const nativeName = (code: string) =>
	capitalize(new Intl.DisplayNames([code], { type: 'language' }).of(code.split('-')[0]) ?? code)

/**
 * Address of the current page in `code`. Pages with their own address per
 * language (tours) list them as hreflang links; other pages just swap the
 * language at the start of the path.
 */
function pathIn(code: string, pathname: string) {
	const alternate = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${code}"]`)
	const path = alternate ? new URL(alternate.href).pathname : null
	if (path) return path + window.location.search
	const parts = pathname.split('/')
	if ((routing.locales as readonly string[]).includes(parts[1])) parts[1] = code
	else parts.splice(1, 0, code)
	return parts.join('/') + window.location.search
}

const LanguagePreferencesModal: FC<Props> = ({ className = '', variant = 'nav', dark = false }) => {
	const t = useTranslations('Jan03_LanguagePreferences_m7x4')
	const locale = useLocale()
	const pathname = usePathname()
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [picked, setPicked] = useState<string | null>(null)
	const [pending, startTransition] = useTransition()

	// Each language in its own words, with the region in the visitor's language
	const languages = useMemo(() => {
		const regions = new Intl.DisplayNames([locale], { type: 'region' })
		return routing.locales.map((code) => ({
			code,
			name: nativeName(code),
			region: regions.of(code.split('-')[1]) ?? '',
		}))
	}, [locale])
	// The new language has loaded: close
	useEffect(() => setOpen(false), [locale])

	const current = languages.find((l) => l.code === locale) ?? languages[0]

	const choose = (code: string) => {
		if (code === locale) return setOpen(false)
		setPicked(code)
		startTransition(() => router.push(pathIn(code, pathname) as any))
	}

	return (
		<>
			{variant === 'footer' ? (
				<button
					type="button"
					onClick={() => setOpen(true)}
					className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
						dark
							? 'border-white/25 text-white hover:border-white'
							: 'border-neutral-300 hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white'
					} ${className}`}
				>
					<Globe className="h-4 w-4" />
					{current.name}
					<ChevronDown className="h-4 w-4 opacity-60" />
				</button>
			) : (
				<button
					type="button"
					onClick={() => setOpen(true)}
					aria-label={t('Choose_Region_Language')}
					className={`grid h-10 w-10 place-items-center rounded-full transition hover:bg-neutral-100 dark:hover:bg-neutral-800 ${className}`}
				>
					<Globe className="h-5 w-5" />
				</button>
			)}

			<Transition show={open} as={Fragment} afterLeave={() => setPicked(null)}>
				<Dialog className="relative z-50" onClose={() => !pending && setOpen(false)}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-200"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-150"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black/40" />
					</Transition.Child>

					<div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-200"
							enterFrom="translate-y-full sm:translate-y-4 sm:opacity-0"
							enterTo="translate-y-0 sm:opacity-100"
							leave="ease-in duration-150"
							leaveFrom="translate-y-0 sm:opacity-100"
							leaveTo="translate-y-full sm:translate-y-4 sm:opacity-0"
						>
							<Dialog.Panel className="flex max-h-[85vh] w-full flex-col rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] text-neutral-950 shadow-2xl sm:max-w-lg sm:rounded-3xl dark:bg-neutral-900 dark:text-white">
								{/* Grab handle: shows it's a sheet on phones */}
								<div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-neutral-300 sm:hidden dark:bg-neutral-700" />

								<div className="flex items-center justify-between gap-4 px-5 pb-3 pt-3 sm:px-6 sm:pt-5">
									<Dialog.Title className="text-lg font-bold tracking-tight sm:text-xl">
										{t('Choose_Region_Language')}
									</Dialog.Title>
									<button
										type="button"
										onClick={() => setOpen(false)}
										aria-label="Close"
										className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-100 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
									>
										<X className="h-4 w-4" />
									</button>
								</div>

								<ul className="grid grid-cols-2 gap-1 overflow-y-auto px-3 pb-4 sm:gap-1.5 sm:px-4 sm:pb-5">
									{languages.map(({ code, name, region }) => {
										const selected = code === (picked ?? locale)
										return (
											<li key={code}>
												<button
													type="button"
													lang={code}
													onClick={() => choose(code)}
													disabled={pending}
													aria-current={code === locale ? 'true' : undefined}
													className={`flex w-full items-center gap-2 rounded-2xl px-3.5 py-3 text-left sm:gap-3 sm:px-4 transition disabled:cursor-wait ${
														selected
															? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
															: 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
													}`}
												>
													<span className="min-w-0 flex-1">
														<span className="block truncate font-semibold">{name}</span>
														<span className={`block truncate text-sm ${selected ? 'opacity-70' : 'text-neutral-500'}`}>
															{region}
														</span>
													</span>
													{selected &&
														(pending ? (
															<Loader2 className="h-5 w-5 shrink-0 animate-spin" />
														) : (
															<Check className="h-5 w-5 shrink-0" strokeWidth={2.5} />
														))}
												</button>
											</li>
										)
									})}
								</ul>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export default LanguagePreferencesModal
