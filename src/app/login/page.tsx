// import React, { FC } from 'react'
// import facebookSvg from '@/images/Facebook.svg'
// import twitterSvg from '@/images/Twitter.svg'
// import googleSvg from '@/images/Google.svg'
// import Input from '@/shared/Input'
// import ButtonPrimary from '@/shared/ButtonPrimary'
// import Image from 'next/image'
// import Link from 'next/link'

// export interface PageLoginProps {}

// const loginSocials = [
// 	{
// 		name: 'Continue with Facebook',
// 		href: '#',
// 		icon: facebookSvg,
// 	},
// 	{
// 		name: 'Continue with Twitter',
// 		href: '#',
// 		icon: twitterSvg,
// 	},
// 	{
// 		name: 'Continue with Google',
// 		href: '#',
// 		icon: googleSvg,
// 	},
// ]

// const PageLogin: FC<PageLoginProps> = ({}) => {
// 	return (
// 		<div className={`nc-PageLogin`}>
// 			<div className="container mb-24 lg:mb-32">
// 				<h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
// 					Login
// 				</h2>
// 				<div className="mx-auto max-w-md space-y-6">
// 					<div className="grid gap-3">
// 						{loginSocials.map((item, index) => (
// 							<a
// 								key={index}
// 								href={item.href}
// 								className="flex w-full transform rounded-lg bg-primary-50 px-4 py-3 transition-transform hover:translate-y-[-2px] dark:bg-neutral-800 sm:px-6"
// 							>
// 								<Image
// 									className="flex-shrink-0"
// 									src={item.icon}
// 									alt={item.name}
// 								/>
// 								<h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
// 									{item.name}
// 								</h3>
// 							</a>
// 						))}
// 					</div>
// 					{/* OR */}
// 					<div className="relative text-center">
// 						<span className="relative z-10 inline-block bg-white px-4 text-sm font-medium dark:bg-neutral-900 dark:text-neutral-400">
// 							OR
// 						</span>
// 						<div className="absolute left-0 top-1/2 w-full -translate-y-1/2 transform border border-neutral-100 dark:border-neutral-800"></div>
// 					</div>
// 					{/* FORM */}
// 					<form className="grid grid-cols-1 gap-6" action="#" method="post">
// 						<label className="block">
// 							<span className="text-neutral-800 dark:text-neutral-200">
// 								Email address
// 							</span>
// 							<Input
// 								type="email"
// 								placeholder="example@example.com"
// 								className="mt-1"
// 							/>
// 						</label>
// 						<label className="block">
// 							<span className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
// 								Password
// 								<Link href="/login" className="text-sm font-medium underline">
// 									Forgot password?
// 								</Link>
// 							</span>
// 							<Input type="password" className="mt-1" />
// 						</label>
// 						<ButtonPrimary type="submit">Continue</ButtonPrimary>
// 					</form>

// 					{/* ==== */}
// 					<span className="block text-center text-neutral-700 dark:text-neutral-300">
// 						New user? {` `}
// 						<Link href="/signup" className="font-semibold underline">
// 							Create an account
// 						</Link>
// 					</span>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// export default PageLogin
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import Input from '@/shared/Input'
import ButtonPrimary from '@/shared/ButtonPrimary'
import SocialLoginButtons from '@/components/SocialLoginButtons'

export default function PageLogin() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isForgotPassword, setIsForgotPassword] = useState(false) // State to track the "Forgot password" flow
  const [emailSent, setEmailSent] = useState(false) // Track email sent status
  const [email, setEmail] = useState('') // State to store email input value
  const [loading, setLoading] = useState(false) // Loading state to prevent multiple requests

  React.useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  // Function to handle login form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      // Handle error (e.g., show error message)
      console.error(result.error)
    }
  }

  // Function to handle forgot password form submission
  const handleForgotPasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const response = await fetch('/api/user/post/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setEmailSent(true) // Mark that email was sent
      } else {
        console.error('Failed to send password reset email')
      }
    } catch (error) {
      console.error('An error occurred:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (session) {
    return null // This will be handled by the useEffect hook
  }

  return (
    <div className="nc-PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
          {isForgotPassword ? 'Forgot Password' : 'Login'}
        </h2>
        <div className="mx-auto max-w-md space-y-6">
          {!isForgotPassword ? (
            <>
              <SocialLoginButtons />
              {/* OR */}
              <div className="relative text-center">
                <span className="relative z-10 inline-block bg-white px-4 text-sm font-medium dark:bg-neutral-900 dark:text-neutral-400">
                  OR
                </span>
                <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 transform border border-neutral-100 dark:border-neutral-800"></div>
              </div>
              {/* FORM */}
              <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-neutral-800 dark:text-neutral-200">
                    Email address
                  </span>
                  <Input
                    type="email"
                    name="email"
                    placeholder="example@example.com"
                    className="mt-1"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
                    Password
                    <a
                      href="#"
                      className="text-sm font-medium underline"
                      onClick={() => setIsForgotPassword(true)}
                    >
                      Forgot password?
                    </a>
                  </span>
                  <Input type="password" name="password" className="mt-1" required />
                </label>
                <ButtonPrimary type="submit">Continue</ButtonPrimary>
              </form>
            </>
          ) : (
            // FORGOT PASSWORD FORM
            <form className="grid grid-cols-1 gap-6" onSubmit={handleForgotPasswordSubmit}>
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Enter your email to reset password
                </span>
                <Input
                  type="email"
                  name="email"
                  placeholder="example@example.com"
                  className="mt-1"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <ButtonPrimary type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Password Reset Email'}
              </ButtonPrimary>
            </form>
          )}

          {emailSent && (
            <div className="text-green-600 text-center">
              Password reset email has been sent!
            </div>
          )}

          {/* ==== */}
          {!isForgotPassword && (
            <span className="block text-center text-neutral-700 dark:text-neutral-300">
              New user?{' '}
              <Link href="/signup" className="font-semibold underline">
                Create an account
              </Link>
            </span>
          )}

          {isForgotPassword && (
            <span
              className="block text-center text-neutral-700 dark:text-neutral-300 cursor-pointer underline"
              onClick={() => setIsForgotPassword(false)}
            >
              Back to Login
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
