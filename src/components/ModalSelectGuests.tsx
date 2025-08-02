'use client'

import React, { FC, Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useTranslations } from '@/lib/i18n'

interface ModalSelectGuestsProps {
	renderChildren?: (p: { openModal: () => void }) => React.ReactNode
	AcommodationAndTransport: React.ReactNode
}

const ModalSelectGuests: FC<ModalSelectGuestsProps> = ({
	renderChildren,
	AcommodationAndTransport,
}) => {
	const [showModal, setShowModal] = useState(false)
	const t = useTranslations("components_ModalSelectGuests")

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
			<button onClick={openModal}>{t('components_ModalSelectGuests_Select_Date')}</button>
		)
	}

	return (
		<>
			{renderButtonOpenModal()}
			<Transition appear show={showModal} as={Fragment}>
				<Dialog
					as="div"
					className="HeroSearchFormMobile__Dialog relative z-50"
					onClose={closeModal}
				>
					<div className="fixed inset-0 bg-white">
						{' '}
						{/* Changed to white background */}
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
								<Dialog.Panel className="relative flex h-full flex-1 flex-col justify-between overflow-hidden">
									<>
										<div className="absolute left-4 top-4">
											<button
												className="focus:outline-none focus:ring-0"
												onClick={closeModal}
											>
												<XMarkIcon className="h-5 w-5 text-black" />{' '}
												{/* Removed dark mode styling */}
											</button>
										</div>

										<div className="flex flex-1 flex-col overflow-hidden p-1 pb-16 pt-12">
											<div className="flex flex-1 animate-[myblur_0.4s_ease-in-out] flex-col overflow-auto transition-opacity">
												<div className="relative z-10 flex flex-1 overflow-y-auto">
													<div className="w-full">
														{AcommodationAndTransport}
													</div>
												</div>
											</div>
										</div>
										<div className="flex justify-between border-t border-neutral-200 bg-white px-4 py-3">
											{' '}
											{/* Removed dark mode styling */}
											<button
												type="button"
												className="flex-shrink-0 font-semibold underline"
												onClick={() => {}}
											>
												{t('components_ModalSelectGuests_Clear_Data')}
											</button>
											<ButtonPrimary
												sizeClass="px-6 py-3 !rounded-xl"
												onClick={() => {
													closeModal()
												}}
											>
												{t('components_ModalSelectGuests_Save')}
											</ButtonPrimary>
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

export default ModalSelectGuests