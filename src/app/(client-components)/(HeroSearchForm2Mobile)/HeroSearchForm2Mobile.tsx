'use client'
import { Fragment, useState } from 'react'
import {
	Dialog,
	DialogPanel,
	Tab,
	TabGroup,
	TabList,
	TabPanel,
	TabPanels,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/solid'
import ButtonSubmit from './ButtonSubmit'
import { useTimeoutFn } from 'react-use'
import StaySearchForm from './(stay-search-form)/StaySearchForm'
import Logo from '@/shared/Logo'
import { useTranslations } from '@/lib/i18n'

const HeroSearchForm2Mobile = () => {
	const t = useTranslations('Jan03_HeroSearchMobile_x7k9')
	const [showModal, setShowModal] = useState(false)
	// FOR RESET ALL DATA WHEN CLICK CLEAR BUTTON
	const [showDialog, setShowDialog] = useState(false)
	let [, , resetIsShowingDialog] = useTimeoutFn(() => setShowDialog(true), 1)
	//
	function closeModal() {
		setShowModal(false)
	}
	function openModal() {
		setShowModal(true)
	}
	const renderButtonOpenModal = () => {
		return (
			<div className="flex w-full items-center justify-between">
				<Logo />
				<div className="ml-6">
					<button
						onClick={openModal}
						className="dark:border-neutral-6000 aspect-square flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 shadow-lg transition-colors hover:bg-gray-50"
					>
						<MagnifyingGlassIcon className="h-5 w-5" />
					</button>
				</div>
			</div>
		)
	}
	const TABS: any = [{ name: t('Experiences'), id: 'Experiences' }]
	return (
		<div className="HeroSearchForm2Mobile">
			{renderButtonOpenModal()}
			<Transition appear show={showModal} as={Fragment}>
				<Dialog
					as="div"
					className="HeroSearchFormMobile__Dialog relative z-10"
					onClose={closeModal}
				>
					<div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
						<div className="flex h-full">
							<TransitionChild
								as={Fragment}
								enter="ease-out transition-transform"
								enterFrom="opacity-0 translate-y-52"
								enterTo="opacity-100 translate-y-0"
								leave="ease-in transition-transform"
								leaveFrom="opacity-100 translate-y-0"
								leaveTo="opacity-0 translate-y-52"
							>
								<DialogPanel className="relative flex h-full flex-1 flex-col justify-between overflow-y-auto">
									{showDialog && (
										<TabGroup manual>
											<div className="absolute left-4 top-4">
												<button className="" onClick={closeModal}>
													<XMarkIcon className="h-5 w-5 text-black dark:text-white" />
												</button>
											</div>
											<TabList className="flex w-full justify-center space-x-6 pt-12 text-sm font-semibold text-neutral-500 dark:text-neutral-400 sm:space-x-8 sm:text-base">
												{TABS.map((item, index) => (
													<Tab key={index} as={Fragment}>
														{({ selected }) => (
															<div className="relative select-none outline-none focus:outline-none focus-visible:ring-0">
																<div
																	className={`${
																		selected ? 'text-black dark:text-white' : ''
																	} `}
																>
																	{item.name}
																</div>
																{selected && (
																	<span className="absolute inset-x-0 top-full border-b-2 border-black dark:border-white"></span>
																)}
															</div>
														)}
													</Tab>
												))}
											</TabList>
											<div className="flex flex-1 overflow-y-auto px-1.5 pt-3 sm:px-4">
												<TabPanels className="flex-1 overflow-y-auto py-4">
													<TabPanel>
														<div className="animate-[myblur_0.4s_ease-in-out] transition-opacity">
															<StaySearchForm />
														</div>
													</TabPanel>
												</TabPanels>
											</div>
											<div className="flex justify-between border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900">
												<button
													type="button"
													className="flex-shrink-0 font-semibold underline"
													onClick={() => {
														setShowDialog(false)
														resetIsShowingDialog()
													}}
												>
													{t('Clear_All')}
												</button>
												<ButtonSubmit
													onClick={() => {
														closeModal()
													}}
												/>
											</div>
										</TabGroup>
									)}
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	)
}

export default HeroSearchForm2Mobile
