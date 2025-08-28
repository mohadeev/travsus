import React, { FC, Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import RenderSidebar from '../[listing-experiences-detail]/RenderSidebar'

interface ModalReserveMobileProps {
	renderChildren?: (p: { openModal: () => void }) => React.ReactNode
}

const ModalReserveMobile: FC<ModalReserveMobileProps> = ({
	renderChildren,
}) => {
	const [showModal, setShowModal] = useState(false)

	//
	function closeModal() {
		setShowModal(false)
	}

	function openModal() {
		setShowModal(true)
	}

	const renderButtonOpenModal = () => {
		return renderChildren ? (
			renderChildren({ openModal })
		) : (
			<button onClick={openModal}>Select Date</button>
		)
	}

	return (
		<>
			{renderButtonOpenModal()}
			<Transition appear show={showModal} as={Fragment}>
				<Dialog
					as="div"
					className="HeroSearchFormMobile__Dialog z-100 relative"
					onClose={closeModal}
				>
					<div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
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
										<div className="absolute left-4 top-4">
											<button
												className="focus:outline-none focus:ring-0"
												onClick={closeModal}
											>
												<XMarkIcon className="h-5 w-5 text-black dark:text-white" />
											</button>
										</div>

										<div className="flex w-full items-center justify-center bg-white py-1 pt-12">
											<div className="w-full max-w-md bg-white dark:bg-neutral-900">
												<RenderSidebar />
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

export default ModalReserveMobile
