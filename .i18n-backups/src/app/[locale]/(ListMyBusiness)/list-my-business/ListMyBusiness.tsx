'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { ArrowRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import updateCompanyInfo from '@/utils/api-utils/updateCompanyInfo'
import { useAuthAction } from '@/app/hooks/useAuthAction'

const formSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Company name must be at least 2 characters.' }),
	country: z.string().min(1, { message: 'Please select a country.' }),
})

const countries = [
	{ value: 'us', label: 'United States' },
	{ value: 'uk', label: 'United Kingdom' },
	{ value: 'ca', label: 'Canada' },
	{ value: 'au', label: 'Australia' },
	{ value: 'de', label: 'Germany' },
	{ value: 'fr', label: 'France' },
	{ value: 'jp', label: 'Japan' },
	{ value: 'sg', label: 'Singapore' },
	{ value: 'ae', label: 'United Arab Emirates' },
	{ value: 'br', label: 'Brazil' },
]

interface CompanyData {
	name: string
	country: string
}

export default function ListMyBusiness({
	companyData,
}: {
	companyData: CompanyData
}) {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const router = useRouter()
	const formRef = useRef<HTMLFormElement>(null)
	const nameInputRef = useRef<HTMLInputElement>(null)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: companyData?.name || '',
			country: companyData?.country || '',
		},
	})

	// Set focus to the name input when the component mounts
	useEffect(() => {
		if (nameInputRef.current) {
			nameInputRef.current.focus()
		}
	}, [])

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Alt+S to submit the form
			if (e.altKey && e.key === 's') {
				e.preventDefault()
				handleSubmit()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [form])

	// Create the authenticated submission handler
	const handleSubmit = useAuthAction(async () => {
		if (!form.formState.isValid) {
			form.trigger()
			return
		}

		const values = form.getValues()
		setIsSubmitting(true)

		try {
			await updateCompanyInfo(values)

			toast({
				title: 'Company registered successfully',
				description: "Your business has been set up and you're ready to go.",
				variant: 'default',
			})

			// Redirect after successful submission
			setTimeout(() => {
				router.push('/dashboard')
			}, 1500)
		} catch (error) {
			console.error('Error updating company:', error)
			toast({
				title: 'Something went wrong',
				description:
					'There was an error registering your company. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	})

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	}

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				stiffness: 100,
			},
		},
	}

	return (
		<div className="min-h-screen bg-white text-black">
			{/* Skip to content link - hidden visually but available for keyboard users */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:p-4 focus:text-black focus:outline-none focus:ring-2 focus:ring-black"
			>
				Skip to main content
			</a>

			<main
				id="main-content"
				className="container mx-auto px-6 py-16 md:px-8 md:py-24"
				tabIndex={-1}
			>
				<motion.div
					initial="hidden"
					animate="visible"
					variants={containerVariants}
					className="mx-auto max-w-5xl"
				>
					<motion.div variants={itemVariants} className="mb-16 md:mb-24">
						<h1 className="font-serif mb-6 text-7xl font-extrabold tracking-tight text-black sm:text-5xl md:text-6xl lg:text-[100px] lg:font-extrabold">
							Register your business.
							<br />
							<span className="text-black">Unlock your potential.</span>
						</h1>
						<p className="max-w-3xl text-xl text-gray-500 md:text-2xl">
							Join thousands of businesses that trust our platform for their
							operations.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24">
						<motion.div variants={itemVariants} className="space-y-8">
							<h2 className="text-3xl font-extrabold md:text-4xl">
								Why businesses choose us
							</h2>

							<div className="space-y-12">
								<div>
									<h3 className="mb-3 text-2xl font-medium">Global Reach</h3>
									<p className="text-lg text-gray-500">
										Connect with clients and partners from around the world with
										our platform's international capabilities.
									</p>
								</div>

								<div>
									<h3 className="mb-3 text-2xl font-medium">
										Enterprise Security
									</h3>
									<p className="text-lg text-gray-500">
										Your data is protected with industry-leading security
										measures and compliance standards.
									</p>
								</div>

								<div>
									<h3 className="mb-3 text-2xl font-medium">
										Seamless Experience
									</h3>
									<p className="text-lg text-gray-500">
										Our intuitive platform makes managing your business
										operations simple and efficient.
									</p>
								</div>
							</div>

							<div className="pt-8">
								<div className="flex flex-wrap gap-x-8 gap-y-4">
									{[
										{ number: '5,000+', label: 'Businesses' },
										{ number: '150+', label: 'Countries' },
										{ number: '99.9%', label: 'Uptime' },
									].map((stat, index) => (
										<div key={index}>
											<p className="text-3xl font-bold">{stat.number}</p>
											<p className="text-gray-500">{stat.label}</p>
										</div>
									))}
								</div>
							</div>
						</motion.div>

						<motion.div variants={itemVariants} className="space-y-12">
							<h2 className="text-3xl font-extrabold md:text-4xl">
								Register your company
							</h2>

							<Form {...form}>
								<form
									ref={formRef}
									onSubmit={(e) => {
										e.preventDefault()
										handleSubmit()
									}}
									className="space-y-8"
									noValidate
								>
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem className="flex flex-col space-y-4">
												<label
													htmlFor="company-name"
													className="text-xl font-medium"
												>
													Company Name
												</label>
												<FormControl>
													<Input
														id="company-name"
														placeholder="Enter your company name"
														{...field}
														ref={nameInputRef}
														aria-required="true"
														className="h-16 rounded-xl border-gray-300 bg-gray-50 px-4 text-lg focus:border-black focus:ring-black"
														onKeyDown={(e) => {
															if (e.key === 'Enter') {
																e.preventDefault()
																const countrySelect =
																	document.getElementById('country-select')
																countrySelect?.focus()
															}
														}}
													/>
												</FormControl>
												<FormMessage className="text-base" />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="country"
										render={({ field }) => (
											<FormItem className="flex flex-col space-y-4">
												<label
													htmlFor="country-select"
													className="text-xl font-medium"
												>
													Country
												</label>
												<FormControl>
													<div className="relative">
														<select
															id="country-select"
															{...field}
															className="h-16 w-full appearance-none rounded-xl border-gray-300 bg-gray-50 px-4 text-lg transition-colors duration-200 focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
															aria-invalid={!!form.formState.errors.country}
															aria-required="true"
															onKeyDown={(e) => {
																if (e.key === 'Enter') {
																	e.preventDefault()
																	const submitButton =
																		document.getElementById('submit-button')
																	submitButton?.focus()
																}
															}}
														>
															<option value="" disabled>
																Select your country
															</option>
															{countries.map((country) => (
																<option
																	key={country.value}
																	value={country.value}
																>
																	{country.label}
																</option>
															))}
														</select>
														<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
															<svg
																className="h-5 w-5 text-gray-400"
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 20 20"
																fill="currentColor"
																aria-hidden="true"
															>
																<path
																	fillRule="evenodd"
																	d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
													</div>
												</FormControl>
												<FormMessage className="text-base" />
											</FormItem>
										)}
									/>

									<Button
										id="submit-button"
										type="button"
										onClick={handleSubmit}
										className="mt-12 h-16 w-full rounded-xl bg-black text-xl font-medium text-white hover:bg-gray-900"
										disabled={isSubmitting}
										aria-busy={isSubmitting}
									>
										{isSubmitting ? (
											<>
												<Loader2
													className="mr-2 h-5 w-5 animate-spin"
													aria-hidden="true"
												/>
												<span>Processing...</span>
											</>
										) : (
											<>
												<span>Continue</span>
												<ArrowRight
													className="ml-2 h-5 w-5"
													aria-hidden="true"
												/>
											</>
										)}
									</Button>

									<p className="pt-4 text-center text-sm text-gray-500">
										By registering, you agree to our{' '}
										<a
											href="#"
											className="rounded-sm text-black hover:underline focus:outline-none focus:ring-2 focus:ring-black"
										>
											Terms of Service
										</a>{' '}
										and{' '}
										<a
											href="#"
											className="rounded-sm text-black hover:underline focus:outline-none focus:ring-2 focus:ring-black"
										>
											Privacy Policy
										</a>
										.
									</p>
								</form>
							</Form>
						</motion.div>
					</div>
				</motion.div>
			</main>
		</div>
	)
}
