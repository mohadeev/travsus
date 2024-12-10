'use client'

import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/shared/Logo'
import { footerLinks } from '@/constants/footerLinks'
import { Route } from 'next'

export default function Footer() {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="bg-[#f5f5f7] text-black">
			<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8 flex justify-center">
					<Link href="/" className="inline-block">
						<Logo />
					</Link>
				</div>

				<nav
					className="-mx-5 -my-2 flex flex-row justify-center"
					aria-label="Footer"
				>
					{footerLinks.map((link) => (
						<div key={link.name} className="px-2 py-2">
							<motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
								<Link
									href={link.href as Route}
									className="text-xs transition-colors duration-300 hover:text-gray-700"
								>
									{link.name}
								</Link>
							</motion.div>
						</div>
					))}
				</nav>

				<div className="mt-8 flex justify-center">
					<motion.div
						whileHover={{ scale: 1.1 }}
						transition={{ duration: 0.2 }}
					>
						<Link
							href="https://www.instagram.com/travsusofficial"
							target="_blank"
							rel="noopener noreferrer"
							className="text-black transition-colors duration-300 hover:text-gray-700"
						>
							<span className="sr-only">Instagram</span>
							<Instagram className="h-6 w-6" aria-hidden="true" />
						</Link>
					</motion.div>
				</div>

				<p className="mt-8 text-center text-xs leading-5">
					Copyright © {currentYear} Travsus.com. All rights reserved.
				</p>
			</div>
		</footer>
	)
}

// 'use client'

// import Logo from '@/shared/Logo'
// import SocialsList1 from '@/shared/SocialsList1'
// import { CustomLink } from '@/data/types'
// import React from 'react'
// import FooterNav from './FooterNav'

// import Image from 'next/image'
// import Link from 'next/link'
// import { Instagram } from 'lucide-react'
// import { motion } from 'framer-motion'

// export interface WidgetFooterMenu {
// 	id: string
// 	title: string
// 	menus: CustomLink[]
// }

// const widgetMenus: WidgetFooterMenu[] = [
// 	{
// 		id: '5',
// 		title: 'Getting started',
// 		menus: [
// 			{ href: '#', label: 'Installation' },
// 			{ href: '#', label: 'Release Notes' },
// 			{ href: '#', label: 'Upgrade Guide' },
// 			{ href: '#', label: 'Browser Support' },
// 			{ href: '#', label: 'Editor Support' },
// 		],
// 	},
// 	{
// 		id: '1',
// 		title: 'Explore',
// 		menus: [
// 			{ href: '#', label: 'Design features' },
// 			{ href: '#', label: 'Prototyping' },
// 			{ href: '#', label: 'Design systems' },
// 			{ href: '#', label: 'Pricing' },
// 			{ href: '#', label: 'Security' },
// 		],
// 	},
// 	{
// 		id: '2',
// 		title: 'Resources',
// 		menus: [
// 			{ href: '#', label: 'Best practices' },
// 			{ href: '#', label: 'Support' },
// 			{ href: '#', label: 'Developers' },
// 			{ href: '#', label: 'Learn design' },
// 			{ href: '#', label: 'Releases' },
// 		],
// 	},
// 	{
// 		id: '4',
// 		title: 'Community',
// 		menus: [
// 			{ href: '#', label: 'Discussion Forums' },
// 			{ href: '#', label: 'Code of Conduct' },
// 			{ href: '#', label: 'Community Resources' },
// 			{ href: '#', label: 'Contributing' },
// 			{ href: '#', label: 'Concurrent Mode' },
// 		],
// 	},
// ]

// // const Footer: React.FC = () => {
// //   const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
// //     return (
// //       <div key={index} className="text-sm">
// //         <h2 className="font-semibold text-neutral-700 dark:text-neutral-200">
// //           {menu.title}
// //         </h2>
// //         <ul className="mt-5 space-y-4">
// //           {menu.menus.map((item, index) => (
// //             <li key={index}>
// //               <a
// //                 key={index}
// //                 className="text-neutral-6000 dark:text-neutral-300 hover:text-black dark:hover:text-white"
// //                 href={item.href}
// //               >
// //                 {item.label}
// //               </a>
// //             </li>
// //           ))}
// //         </ul>
// //       </div>
// //     );
// //   };

// //   return (
// //     <>
// //       <FooterNav />

// //       <div className="nc-Footer relative py-24 lg:py-28 border-t border-neutral-200 dark:border-neutral-700">
// //         <div className="container grid grid-cols-2 gap-y-10 gap-x-5 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 ">
// //           <div className="grid grid-cols-4 gap-5 col-span-2 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
// //             <div className="col-span-2 md:col-span-1">
// //               <Logo />
// //             </div>
// //             <div className="col-span-2 flex items-center md:col-span-3">
// //               <SocialsList1 className="flex items-center space-x-3 lg:space-x-0 lg:flex-col lg:space-y-2.5 lg:items-start" />
// //             </div>
// //           </div>
// //           {widgetMenus.map(renderWidgetMenuItem)}
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// function Footer() {
// 	const currentYear = new Date().getFullYear()

// 	const links = [
// 		{ name: 'About', href: '/about' },
// 		{ name: 'Contact', href: '/contact' },
// 		{ name: 'Legal', href: '/legal' },
// 		{ name: 'Privacy', href: '/privacy' },
// 		{ name: 'Cookies', href: '/cookies' },
// 		{ name: 'Terms of Use', href: '/terms' },
// 	]

// 	return (
// 		<footer className="bg-[#f5f5f7] text-[#86868b]">
// 			<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
// 				<div className="mb-8 flex justify-center">
// 					<Link href="/" className="inline-block">
// 						<Logo />

// 						{/* <Image
// 							src="/placeholder.svg?height=40&width=40"
// 							alt="Your Company Logo"
// 							width={40}
// 							height={40}
// 							className="h-10 w-auto"
// 						/> */}
// 					</Link>
// 				</div>

// 				<nav
// 					className="-mx-5 -my-2 flex flex-wrap justify-center"
// 					aria-label="Footer"
// 				>
// 					{links.map((link) => (
// 						<div key={link.name} className="px-5 py-2">
// 							<motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
// 								<Link
// 									href={link.href}
// 									className="text-sm transition-colors duration-300 hover:text-[#1d1d1f]"
// 								>
// 									{link.name}
// 								</Link>
// 							</motion.div>
// 						</div>
// 					))}
// 				</nav>

// 				<div className="mt-8 flex justify-center">
// 					<motion.div
// 						whileHover={{ scale: 1.1 }}
// 						transition={{ duration: 0.2 }}
// 					>
// 						<Link
// 							href="https://www.instagram.com/travsusofficial"
// 							target="_blank"
// 							rel="noopener noreferrer"
// 							className="text-[#86868b] transition-colors duration-300 hover:text-[#1d1d1f]"
// 						>
// 							<span className="sr-only">Instagram</span>
// 							<Instagram className="h-6 w-6" aria-hidden="true" />
// 						</Link>
// 					</motion.div>
// 				</div>

// 				<p className="mt-8 text-center text-xs leading-5">
// 					Copyright © {currentYear} Travsus.com. All rights reserved.
// 				</p>
// 			</div>
// 		</footer>
// 	)
// }

// export default Footer
