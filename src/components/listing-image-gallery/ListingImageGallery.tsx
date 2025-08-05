'use client'

import './styles/index.css'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type FC, Fragment, Suspense, useEffect, useRef } from 'react'
import Modal from './components/Modal'
import type { ListingGalleryImage } from './utils/types'
import { useLastViewedPhoto } from './utils/useLastViewedPhoto'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import LikeSaveBtns from '../LikeSaveBtns'
import type { Route } from 'next'
import { useSelector } from 'react-redux'
import { useTranslations } from '@/lib/i18n'

const PHOTOS: string[] = [
	// 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
	// 'https://images.pexels.com/photos/7163619/pexels-photo-7163619.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	// 'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	// 'https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	// 'https://images.pexels.com/photos/6438752/pexels-photo-6438752.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	// 'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	// 'https://images.pexels.com/photos/261394/pexels-photo-261394.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
	// 'https://images.pexels.com/photos/2861361/pexels-photo-2861361.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
]

export const DEMO_IMAGE: ListingGalleryImage[] = [...PHOTOS].map(
	(item, index): ListingGalleryImage => {
		return {
			id: index,
			url: item,
		}
	},
)

export const getNewParam = ({
	paramName = 'photoId',
	value,
}: {
	paramName?: string
	value: string | number
}) => {
	const params = new URLSearchParams(document.location.search)
	params.set(paramName, String(value))
	return params.toString()
}

interface Props {
	images?: ListingGalleryImage[]
}

const ListingImageGallery: FC<Props> = ({ images }) => {
	const t = useTranslations("components_listingimagegallery_ListingImageGallery");
	const searchParams = useSearchParams()
	const photoId = searchParams?.get('photoId')
	const modal = searchParams?.get('modal')
	const isShowModal =
		(searchParams?.get('photoId') !== null &&
			!isNaN(Number(searchParams.get('photoId'))) &&
			Number(searchParams.get('photoId')) >= 0) ||
		modal === 'PHOTO_TOUR_SCROLLABLE'
	const router = useRouter()
	const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()
	const {
		name: title,
		region,
		start,
		images: serviceImages,
		overview,
		reviews,
		days,
		liked,
	}: any = useSelector((state: any) => state.creatingServiceSlice.service)

	const lastViewedPhotoRef = useRef<HTMLDivElement>(null)
	const thisPathname = usePathname()

	useEffect(() => {
		// This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
		if (lastViewedPhoto && !photoId) {
			lastViewedPhotoRef.current?.scrollIntoView({ block: 'center' })
			setLastViewedPhoto(null)
		}
	}, [photoId, lastViewedPhoto, setLastViewedPhoto])

	const handleClose = () => {
		const params = new URLSearchParams(document.location.search)
		params.delete('modal')
		router.push(`${thisPathname}/?${params.toString()}` as Route)
	}

	const renderContent = () => {
		return (
			<div className={t('components_listingimagegallery_ListingImageGallery_Container_Wrapper_Classes')}>
				{photoId && (
					<Suspense
						fallback={
							<div className={t('components_listingimagegallery_ListingImageGallery_Loading_Container_Classes')}>
								Loading...
							</div>
						}
					>
						<Modal
							images={serviceImages}
							onClose={() => {
								// @ts-ignore
								setLastViewedPhoto(photoId)
								const params = new URLSearchParams(document.location.search)
								params.delete('photoId')
								router.push(`${thisPathname}/?${params.toString()}` as Route)
							}}
						/>
					</Suspense>
				)}

				<div className={t('components_listingimagegallery_ListingImageGallery_Gallery_Grid_Classes')}>
					{serviceImages?.map(({ id, url }: any) => (
						<div
							key={id}
							onClick={() => {
								const newPathname = getNewParam({ value: id })
								router.push(`${thisPathname}/?${newPathname}` as Route)
							}}
							ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
							className={t('components_listingimagegallery_ListingImageGallery_Gallery_Item_Classes')}
						>
							<div className={t('components_listingimagegallery_ListingImageGallery_Image_Container_Classes')}>
								<Image
									alt={t('components_listingimagegallery_ListingImageGallery_Image_Alt_Text')}
									className={t('components_listingimagegallery_ListingImageGallery_Image_Classes')}
									style={{
										transform: 'translate3d(0, 0, 0)',
									}}
									src={url || '/placeholder.svg'}
									width={720}
									height={480}
									sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 350px"
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<>
			<Transition appear show={isShowModal} as={Fragment}>
				<Dialog as="div" className={t('components_listingimagegallery_ListingImageGallery_Dialog_Classes')} onClose={handleClose}>
					<TransitionChild
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className={t('components_listingimagegallery_ListingImageGallery_Backdrop_Classes')} />
					</TransitionChild>

					<div className={t('components_listingimagegallery_ListingImageGallery_Overlay_Classes')}>
						<div className={t('components_listingimagegallery_ListingImageGallery_Header_Classes')}>
							<button
								className={t('components_listingimagegallery_ListingImageGallery_Close_Button_Classes')}
								onClick={handleClose}
							>
								<ArrowLeftIcon className={t('components_listingimagegallery_ListingImageGallery_Icon_Classes')} />
							</button>
							<LikeSaveBtns />
						</div>

						<div className={t('components_listingimagegallery_ListingImageGallery_Content_Container_Classes')}>
							<TransitionChild
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-5"
								enterTo="opacity-100 translate-y-0"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0"
								leaveTo="opacity-0 translate-y-5"
							>
								<DialogPanel className={t('components_listingimagegallery_ListingImageGallery_Dialog_Panel_Classes')}>
									{renderContent()}
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export default ListingImageGallery