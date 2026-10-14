'use client'
// One saved tour. When its heart is turned off the card folds into a small
// "Removed · Undo" note, so a mis-tap is easy to take back.
import { useState, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import addAndRemoveToWishList from '@/utils/api-utils/addAndRemoveToWishList'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectTourLiked, setTourLiked } from '@/store/slices/tourPage'

export default function SavedItem({ id, name, children }: { id: string; name: string; children: ReactNode }) {
	const t = useTranslations('Account')
	const dispatch = useAppDispatch()
	const liked = useAppSelector(selectTourLiked(id))
	const [busy, setBusy] = useState(false)

	if (liked !== false) return <>{children}</>

	const undo = async () => {
		setBusy(true)
		dispatch(setTourLiked({ id, liked: true }))
		const res: any = await addAndRemoveToWishList({ serviceId: id }).catch(() => null)
		if (typeof res?.added === 'boolean') dispatch(setTourLiked({ id, liked: res.added }))
		setBusy(false)
	}

	return (
		<div className="flex h-full min-h-[120px] flex-col justify-center rounded-2xl border border-dashed border-neutral-300 p-5 text-sm dark:border-neutral-700">
			<p className="line-clamp-2 text-neutral-500">{t('saved_removed', { name })}</p>
			<button type="button" onClick={undo} disabled={busy} className="mt-2 self-start font-semibold underline underline-offset-4 disabled:opacity-50">
				{t('undo')}
			</button>
		</div>
	)
}
