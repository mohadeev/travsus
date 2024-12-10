'use client'

import BackgroundSection from '@/components/BackgroundSection'
import ListingImageGallery from '@/components/listing-image-gallery/ListingImageGallery'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import {
	notFound,
	usePathname,
	useRouter,
	useSearchParams,
} from 'next/navigation'
import { ReactNode, Suspense, useEffect } from 'react'
import MobileFooterSticky from './(components)/MobileFooterSticky'
// import { imageGallery as listingStayImageGallery } from './listing-stay-detail-1/constant'
// import { imageGallery as listingCarImageGallery } from './listing-car-detail-1/constant'
import { imageGallery as listingExperienceImageGallery } from './[listing-experiences-detail]/constant'
import { updateServiceState } from '../GlobalRedux/Features/creatingServiceSlice/creatingServiceSlice'
import { useDispatch } from 'react-redux'
import getFetchDataFromApi from '@/utils/getFetchDataFromApi'
import { Router } from 'lucide-react'
import { toggleOverlay } from '../GlobalRedux/Features/overlaySlice/overlaySlice'

const DetailtLayout = ({ children }: { children: ReactNode }) => {
	const dispatch = useDispatch()
	const thisPathname = usePathname()
	const searchParams = useSearchParams()
	const serviceId = searchParams.get('serviceId')
	const router = useRouter()
	const getImageGalleryListing = () => {
		// if (thisPathname?.includes('/listing-stay-detail')) {
		// 	return listingStayImageGallery
		// }
		// if (thisPathname?.includes('/listing-car-detail')) {
		// 	return listingCarImageGallery
		// }
		// if (thisPathname?.includes('/listing-experiences-detail')) {
		// 	return listingExperienceImageGallery
		// }
		return listingExperienceImageGallery
	}
	if (serviceId === null) {
		notFound()
	}
	useEffect(() => {
		;(async () => {
			try {
				dispatch(toggleOverlay({ isVisible: false }))
				const serviceData = await getFetchDataFromApi(
					'/api/listing/get/getTourData?',
					{
						id: serviceId,
					},
				)
				dispatch(updateServiceState({ path: 'service', value: serviceData }))
			} catch (error: any) {
				const { code } = error?.response.data.code || {}
				const status = error.status || {}
				if (code === 'P2023') {
					dispatch(
						toggleOverlay({
							type: 'oops',
							data: { name: 'err' },
							isVisible: true,
						}),
					)
				} else if (status >= 400) {
					// console.log('shoud make showOverlay here ')
					router.push('/not-found')
				}
			}
		})()
	}, [serviceId, dispatch]) // Dispatch included in the dependency array

	return (
		<div className="ListingDetailPage">
			<Suspense>
				<ListingImageGallery images={getImageGalleryListing()} />
			</Suspense>

			<div className="ListingDetailPage__content container">{children}</div>

			{/* OTHER SECTION */}
			{/* <div className="container py-24 lg:py-32">
				<div className="relative py-16">
					<BackgroundSection />
					<SectionSliderNewCategories
						heading="Explore by types of stays"
						subHeading="Explore houses based on 10 types of stays"
						categoryCardType="card5"
						itemPerRow={5}
						sliderStyle="style2"
					/>
				</div>
				<SectionSubscribe2 className="pt-24 lg:pt-32" />
			</div> */}

			{/* STICKY FOOTER MOBILE */}
			<MobileFooterSticky />
		</div>
	)
}

export default DetailtLayout
