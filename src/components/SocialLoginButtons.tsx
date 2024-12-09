'use client'

import React from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import facebookSvg from '@/images/Facebook.svg'
import twitterSvg from '@/images/Twitter.svg'
import googleSvg from '@/images/Google.svg'

const loginSocials = [
	// {
	//   name: "Continue with Facebook",
	//   provider: "facebook",
	//   icon: facebookSvg,
	// },
	// {
	//   name: "Continue with Twitter",
	//   provider: "twitter",
	//   icon: twitterSvg,
	// },
	{
		name: 'Continue with Google',
		provider: 'google',
		icon: googleSvg,
	},
]

const SocialLoginButtons: React.FC = () => {
	return (
		<div className="grid gap-3">
			{loginSocials.map((item, index) => (
				<button
					key={index}
					onClick={() => signIn(item.provider)}
					className="flex w-full transform rounded-lg bg-primary-50 px-4 py-3 transition-transform hover:translate-y-[-2px] dark:bg-neutral-800 sm:px-6"
				>
					<Image className="flex-shrink-0" src={item.icon} alt={item.name} />
					<h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
						{item.name}
					</h3>
				</button>
			))}
		</div>
	)
}

export default SocialLoginButtons
