'use client'
// "Start a discussion" button + composer. Guests are asked to sign in first.
import { Fragment, useState, type FormEvent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Loader2, PenLine, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createForumPost } from '@/app/actions/forum/createPost'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import { FORUM_CATEGORIES } from './categories'

const field =
	'w-full rounded-2xl border-0 bg-neutral-100 px-4 py-3 text-base text-neutral-950 ring-1 ring-transparent transition placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-neutral-950 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-900 dark:focus:ring-white'

export default function NewDiscussion({ category = '', dark = false }: { category?: string; dark?: boolean }) {
	const t = useTranslations('Forum')
	const tOld = useTranslations('Jan03_Forum_x8k2')
	const locale = useLocale()
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [sending, setSending] = useState(false)
	const [error, setError] = useState('')
	const start = useAuthAction(() => setOpen(true))

	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setSending(true)
		setError('')
		const result = await createForumPost(new FormData(e.currentTarget))
		if (result.success && result.id) {
			router.push(`/${locale}/forum/${result.id}` as any)
			setOpen(false)
		} else {
			setError(result.error === 'INVALID' ? t('error_invalid') : t('error_generic'))
		}
		setSending(false)
	}

	return (
		<>
			<button
				type="button"
				onClick={() => start(undefined)}
				className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition ${
					dark
						? 'bg-white text-neutral-950 hover:bg-neutral-200'
						: 'bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950'
				}`}
			>
				<PenLine className="h-4 w-4" />
				{t('start')}
			</button>

			<Transition show={open} as={Fragment}>
				<Dialog className="relative z-50" onClose={() => !sending && setOpen(false)}>
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
							<Dialog.Panel className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-neutral-950 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-8 dark:bg-neutral-900 dark:text-white">
								<div className="flex items-center justify-between gap-4">
									<Dialog.Title className="text-xl font-bold tracking-tight sm:text-2xl">{t('start')}</Dialog.Title>
									<button
										type="button"
										onClick={() => setOpen(false)}
										aria-label="Close"
										className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 transition hover:bg-neutral-200 dark:bg-neutral-800"
									>
										<X className="h-4 w-4" />
									</button>
								</div>

								<form onSubmit={submit} className="mt-6 space-y-4">
									<label className="block">
										<span className="mb-1.5 block text-sm font-medium">{tOld('Title_Label')}</span>
										<input name="title" required minLength={5} maxLength={140} placeholder={tOld('Title_Placeholder')} className={field} />
									</label>
									<label className="block">
										<span className="mb-1.5 block text-sm font-medium">{tOld('Category_Label')}</span>
										<select name="category" required defaultValue={category} className={field}>
											<option value="" disabled>
												{tOld('Select_Category')}
											</option>
											{FORUM_CATEGORIES.map((c) => (
												<option key={c.key} value={c.key}>
													{tOld(c.name)}
												</option>
											))}
										</select>
									</label>
									<label className="block">
										<span className="mb-1.5 block text-sm font-medium">{tOld('Content_Label')}</span>
										<textarea
											name="content"
											required
											minLength={10}
											maxLength={10000}
											rows={6}
											placeholder={tOld('Content_Placeholder')}
											className={`${field} resize-y`}
										/>
									</label>
									<label className="block">
										<span className="mb-1.5 block text-sm font-medium">{tOld('Tags_Label')}</span>
										<input name="tags" maxLength={200} placeholder={tOld('Tags_Placeholder')} className={field} />
									</label>

									{error && (
										<p role="alert" className="text-sm text-red-500">
											{error}
										</p>
									)}
									<div className="flex flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
										<p className="text-xs text-neutral-500">{t('guidelines')}</p>
										<button
											type="submit"
											disabled={sending}
											className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-70 dark:bg-white dark:text-neutral-950"
										>
											{sending && <Loader2 className="h-4 w-4 animate-spin" />}
											{t('publish')}
										</button>
									</div>
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}
