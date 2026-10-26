'use client'
// Heart on a tour card: saves the tour to the wishlist (asks to sign in first).
import { Heart } from 'lucide-react'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import addAndRemoveToWishList from '@/utils/api-utils/addAndRemoveToWishList'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectUser } from '@/store/slices/user'
import { selectTourLiked, setTourLiked } from '@/store/slices/tourPage'

export default function SaveButton({ tourId, label }: { tourId: string; label: string }) {
	const dispatch = useAppDispatch()
	const savedList: string[] | undefined = useAppSelector(selectUser).savedList
	const likedNow = useAppSelector(selectTourLiked(tourId))
	const liked = likedNow ?? !!savedList?.includes(tourId)

	const toggle = useAuthAction(async () => {
		const setLiked = (value: boolean) =>
			dispatch(setTourLiked({ id: tourId, liked: value }))
		setLiked(!liked)
		await addAndRemoveToWishList({ serviceId: tourId })
			.then((res: any) => {
				if (typeof res?.added === 'boolean') setLiked(res.added)
			})
			.catch(() => setLiked(liked))
	})

	return (
		<button
			type="button"
			aria-label={label}
			aria-pressed={liked}
			onClick={(e) => {
				e.preventDefault() // the card itself is a link
				toggle(undefined)
			}}
			className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-black shadow-md backdrop-blur sm:h-9 sm:w-9 transition hover:scale-105"
		>
			<Heart
				className={`h-4 w-4 sm:h-5 sm:w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`}
				strokeWidth={2}
			/>
		</button>
	)
}
