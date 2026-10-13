import { useState, Fragment, useEffect, FC } from 'react'
import {
	Transition,
	Dialog,
	TransitionChild,
	DialogPanel,
} from '@headlessui/react'
import NavMobile from './Navigation/NavMobile'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

export interface MenuBarProps {
	className?: string
	iconClassName?: string
}
const MenuBar: FC<MenuBarProps> = ({
	className = 'p-2.5 rounded-lg text-neutral-700 dark:text-neutral-300',
	iconClassName = 'h-8 w-8',
}) => {
	const [isVisable, setIsVisable] = useState(false)

	const pathname = usePathname()

	useEffect(() => {
		setIsVisable(false)
	}, [pathname])

	const handleOpenMenu = () => setIsVisable(true)
	const handleCloseMenu = () => setIsVisable(false)

	const renderContent = () => {
		return (
			<Transition appear show={isVisable} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-50 overflow-hidden"
					onClose={handleCloseMenu}
				>
					<TransitionChild
						as={Fragment}
						enter=" duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave=" duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
					</TransitionChild>
					<div className="fixed inset-0">
						<div className="flex min-h-full justify-end">
							<TransitionChild
								as={Fragment}
								enter="transition duration-300 ease-out transform"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transition duration-200 ease-in transform"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<DialogPanel className="w-full max-w-sm transform overflow-hidden transition-all">
									<NavMobile onClickClose={handleCloseMenu} />
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		)
	}

	return (
		<>
			<button
				type="button"
				aria-label="Menu"
				onClick={handleOpenMenu}
				className={`flex items-center justify-center focus:outline-none ${className}`}
			>
				<Menu className={iconClassName} />
			</button>

			{renderContent()}
		</>
	)
}

export default MenuBar
