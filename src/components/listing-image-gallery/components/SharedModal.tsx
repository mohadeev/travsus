'use client'

import { useTranslations } from '@/lib/i18n'
import {
	ArrowDownTrayIcon,
	ArrowTopRightOnSquareIcon,
	ArrowUturnLeftIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { DEMO_IMAGE } from '../ListingImageGallery'
import { variants } from '@/utils/animationVariants'
import downloadPhoto from '../utils/downloadPhoto'
import { range } from '../utils/range'
import type { ListingGalleryImage } from '../utils/types'
import Twitter from './Icons/Twitter'

interface SharedModalProps {
	index: number
	images?: ListingGalleryImage[]
	currentPhoto?: ListingGalleryImage
	changePhotoId: (newVal: number) => void
	closeModal: () => void
	navigation: boolean
	direction?: number
}

export default function SharedModal({
	index,
	images = DEMO_IMAGE,
	changePhotoId,
	closeModal,
	navigation,
	currentPhoto,
	direction,
}: SharedModalProps) {
	const t = useTranslations("components_listingimagegallery_components_SharedModal");
	const [loaded, setLoaded] = useState(false)

	let filteredImages = images?.filter((img: ListingGalleryImage) =>
		range(index - 15, index + 15).includes(img.id),
	)

	const handlers = useSwipeable({
		onSwipedLeft: () => {
			if (index < images?.length - 1) {
				changePhotoId(index + 1)
			}
		},
		onSwipedRight: () => {
			if (index > 0) {
				changePhotoId(index - 1)
			}
		},
		trackMouse: true,
	})

	let currentImage = images ? images[index] : currentPhoto

	return (
		<MotionConfig
			transition={{
				x: { type: 'spring', stiffness: 300, damping: 30 },
				opacity: { duration: 0.2 },
			}}
		>
			<div
				className={t('components_listingimagegallery_components_SharedModal_Container_Main_Classes')}
				{...handlers}
			>
				{/* Main image */}
				<div className={t('components_listingimagegallery_components_SharedModal_Image_Container_Classes')}>
					<div className={t('components_listingimagegallery_components_SharedModal_Image_Wrapper_Classes')}>
						<AnimatePresence initial={false} custom={direction}>
							<motion.div
								key={index}
								custom={direction}
								variants={variants()}
								initial="enter"
								animate="center"
								exit="exit"
								className="absolute"
							>
								<Image
									src={currentImage?.url || ''}
									width={navigation ? 1280 : 1920}
									height={navigation ? 853 : 1280}
									priority
									alt={t('components_listingimagegallery_components_SharedModal_Gallery_Alt_Text')}
									onLoad={() => setLoaded(true)}
									sizes="(max-width: 1025px) 100vw, 1280px"
								/>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>

				{/* Buttons + bottom nav bar */}
				<div className={t('components_listingimagegallery_components_SharedModal_Buttons_Container_Classes')}>
					{/* Buttons */}
					{loaded && (
						<div className={t('components_listingimagegallery_components_SharedModal_Image_Aspect_Classes')}>
							{navigation && (
								<>
									{index > 0 && (
										<button
											className={t('components_listingimagegallery_components_SharedModal_Left_Button_Classes')}
											style={{ transform: 'translate3d(0, 0, 0)' }}
											onClick={() => changePhotoId(index - 1)}
										>
											<ChevronLeftIcon className={t('components_listingimagegallery_components_SharedModal_Chevron_Icon_Classes')} />
										</button>
									)}
									{index + 1 < images?.length && (
										<button
											className={t('components_listingimagegallery_components_SharedModal_Right_Button_Classes')}
											style={{ transform: 'translate3d(0, 0, 0)' }}
											onClick={() => changePhotoId(index + 1)}
										>
											<ChevronRightIcon className={t('components_listingimagegallery_components_SharedModal_Chevron_Icon_Classes')} />
										</button>
									)}
								</>
							)}
							<div className={t('components_listingimagegallery_components_SharedModal_Top_Right_Container_Classes')}>
								{navigation ? (
									<a
										href={currentImage?.url}
										className={t('components_listingimagegallery_components_SharedModal_Action_Button_Classes')}
										target="_blank"
										title={t('components_listingimagegallery_components_SharedModal_Open_Fullsize_Title')}
										rel="noreferrer"
									>
										<ArrowTopRightOnSquareIcon className={t('components_listingimagegallery_components_SharedModal_Small_Icon_Classes')} />
									</a>
								) : (
									<a
										href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20pic%20from%20Travsus%20!%0A%0A${location.href}`}
										className={t('components_listingimagegallery_components_SharedModal_Action_Button_Classes')}
										target="_blank"
										title={t('components_listingimagegallery_components_SharedModal_Open_Fullsize_Title')}
										rel="noreferrer"
									>
										<Twitter className={t('components_listingimagegallery_components_SharedModal_Small_Icon_Classes')} />
									</a>
								)}
								<button
									onClick={() =>
										downloadPhoto(currentImage?.url || '', `${index}.jpg`)
									}
									className={t('components_listingimagegallery_components_SharedModal_Action_Button_Classes')}
									title={t('components_listingimagegallery_components_SharedModal_Download_Title')}
								>
									<ArrowDownTrayIcon className={t('components_listingimagegallery_components_SharedModal_Small_Icon_Classes')} />
								</button>
							</div>
							<div className={t('components_listingimagegallery_components_SharedModal_Top_Left_Container_Classes')}>
								<button
									onClick={() => closeModal()}
									className={t('components_listingimagegallery_components_SharedModal_Action_Button_Classes')}
								>
									{navigation ? (
										<XMarkIcon className={t('components_listingimagegallery_components_SharedModal_Small_Icon_Classes')} />
									) : (
										<ArrowUturnLeftIcon className={t('components_listingimagegallery_components_SharedModal_Small_Icon_Classes')} />
									)}
								</button>
							</div>
						</div>
					)}
					{/* Bottom Nav bar */}
					{navigation && (
						<div className={t('components_listingimagegallery_components_SharedModal_Bottom_Nav_Classes')}>
							<motion.div
								initial={false}
								className={t('components_listingimagegallery_components_SharedModal_Thumbnail_Container_Classes')}
							>
								<AnimatePresence initial={false}>
									{filteredImages?.map(({ id, url }) => (
										<motion.button
											initial={{
												width: '0%',
												x: `${Math.max((index - 1) * -100, 15 * -100)}%`,
											}}
											animate={{
												scale: id === index ? 1.25 : 1,
												width: '100%',
												x: `${Math.max(index * -100, 15 * -100)}%`,
											}}
											exit={{ width: '0%' }}
											onClick={() => changePhotoId(id)}
											key={id}
											className={`${
												id === index
													? 'z-20 rounded-md shadow shadow-black/50'
													: 'z-10'
											} ${id === 0 ? 'rounded-l-md' : ''} ${
												id === images?.length - 1 ? 'rounded-r-md' : ''
											} relative inline-block w-full shrink-0 transform-gpu overflow-hidden focus:outline-none`}
										>
											<Image
												alt={t('components_listingimagegallery_components_SharedModal_Thumbnail_Alt_Text')}
												width={180}
												height={120}
												className={`${
													id === index
														? 'brightness-110 hover:brightness-110'
														: 'brightness-50 contrast-125 hover:brightness-75'
												} h-full transform object-cover transition`}
												src={url || ''}
											/>
										</motion.button>
									))}
								</AnimatePresence>
							</motion.div>
						</div>
					)}
				</div>
			</div>
		</MotionConfig>
	)
}