import React, { FC, Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useDispatch, useSelector } from 'react-redux'
import TourHeader from '@/app/[locale]/[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/TourHeader'
import ListingExperiencesDetailsImages from '@/app/[locale]/[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/ListingExperiencesDetailsImages'
import ListingExperiencesDetailPage from '@/app/[locale]/[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/page'
import SiteHeader from '@/app/(client-components)/(Header)/SiteHeader'

interface ListingBeforLoadingProps {
	renderChildren?: (p: { openModal: () => void }) => React.ReactNode
	isOpen?: boolean
}

const ListingBeforLoading: FC<ListingBeforLoadingProps> = ({
	renderChildren,
	isOpen,
}) => {
	const [showModal, setShowModal] = useState(true)

	//
	function closeModal() {
		setShowModal(false)
	}

	function openModal() {
		setShowModal(true)
	}

	const dispatch = useDispatch()
	const haneleClose = (closeModal: any) => {
		closeModal()
		// dispatch(mobileFooterStickyToggleHanlder({ value: false }))
	}
	const service: any = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)
	return (
		<>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog
					as="div"
					className="HeroSearchFormMobile__Dialog z-max fixed bg-black p-10"
					onClose={() => haneleClose(closeModal)}
				>
					<div className="fixed inset-0 bg-white dark:bg-neutral-900">
						<div className="flex h-full">
							<Transition.Child
								as={Fragment}
								enter="ease-out transition-transform"
								enterFrom="opacity-0 translate-y-52"
								enterTo="opacity-100 translate-y-0"
								leave="ease-in transition-transform"
								leaveFrom="opacity-100 translate-y-0"
								leaveTo="opacity-0 translate-y-52"
							>
								<Dialog.Panel className="relative flex h-full flex-1 flex-col justify-between overflow-auto">
									<>
										<div className="flex w-full items-center justify-center bg-white py-1 pt-12">
											<div className="w-full bg-white dark:bg-neutral-900">
												<SiteHeader />
												<ListingExperiencesDetailPage serviceData={service} />
											</div>
										</div>
									</>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export default ListingBeforLoading
