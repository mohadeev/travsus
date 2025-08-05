'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Form, Field } from 'react-final-form'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Input from '@/shared/Input'
import { useToast } from '@/hooks/useToast'
import { motion, AnimatePresence } from 'framer-motion'
import LocationSelect from '@/components/ui/LocationSelect'
import allCountries from '@/constants/allCountries'
import FieldSelectFormItem from '@/app/add-listing/FieldSelectFormItem'

interface PaymentMethod {
	id: string
	stripePaymentMethodId: string
	type: string | null
	last4: string | null
	brand: string | null
	exp_month: number | null
	exp_year: number | null
	cardHolder: string | null
	createdAt: string
	updatedAt: string
	billingAddressLine1: string | null
	billingAddressLine2: string | null
	billingCity: string | null
	billingState: string | null
	billingPostalCode: string | null
	billingCountry: string | null
}

interface ApiResponse {
	success: boolean
	paymentMethods: PaymentMethod[]
}

const AccountBilling: React.FC = () => {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
	const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
	const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)
	const dropdownRef = useRef<HTMLDivElement | null>(null)
	const { toast }: any = useToast()

	const fetchPaymentMethods = async () => {
		try {
			const response = await fetch('/api/get-payment-methods')
			if (!response.ok) {
				console.error('Failed to fetch payment methods')
			}
			const data: ApiResponse = await response.json()
			setPaymentMethods(data.paymentMethods)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error occurred')
			toast({
				title: 'Error',
				description: 'Failed to fetch payment methods. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchPaymentMethods()
	}, [])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setActiveDropdown(null)
				setConfirmingDelete(null)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleDropdownToggle = (id: string) => {
		setActiveDropdown(activeDropdown === id ? null : id)
		setConfirmingDelete(null)
	}

	const handleRemovePaymentMethod = async (id: string) => {
		try {
			const response = await fetch('/api/remove-payment-method', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id }),
			})
			if (!response.ok) {
				console.error('Failed to remove payment method')
			}
			await fetchPaymentMethods()
			toast({
				title: 'Success',
				description: 'Payment method removed successfully.',
			})
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to remove payment method',
			)
			toast({
				title: 'Error',
				description: 'Failed to remove payment method. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setConfirmingDelete(null)
			setActiveDropdown(null)
		}
	}

	const handleEditPaymentMethod = (method: PaymentMethod) => {
		setEditingMethod(method)
		setActiveDropdown(null)
	}

	const handleCloseEditForm = () => {
		setEditingMethod(null)
	}

	const handleUpdatePaymentMethod = async (values: any) => {
		if (!editingMethod) return

		setLoading(true)
		setError(null)

		try {
			const response = await fetch('/api/update-payment-method', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: editingMethod.id,
					cardHolder: values.cardHolder,
					billingAddressLine1: values.billingAddressLine1,
					billingAddressLine2: values.billingAddressLine2,
					billingCity: values.billingCity,
					billingState: values.billingState,
					billingPostalCode: values.billingPostalCode,
					billingCountry: values.billingCountry,
				}),
			})

			if (!response.ok) {
				console.error('Failed to update payment method')
			}

			await fetchPaymentMethods()
			setEditingMethod(null)
			toast({
				title: 'Success',
				description: 'Payment method updated successfully.',
			})
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to update payment method',
			)
			toast({
				title: 'Error',
				description: 'Failed to update payment method. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	const renderPaymentMethodCard = (method: PaymentMethod) => (
		<motion.li
			key={method.id}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="relative flex flex-col rounded-lg border border-neutral-300 bg-white p-4 shadow-sm"
		>
			<div className="mb-2 flex items-center justify-between">
				<span className="font-semibold text-neutral-800 dark:text-neutral-200">
					{method.brand ? (
						<>
							{method.brand.toUpperCase()} **** **** **** {method.last4}
						</>
					) : (
						`Payment Method (${method.type || 'Unknown'})`
					)}
				</span>
				{method.exp_month && method.exp_year && (
					<span className="text-sm text-neutral-500 dark:text-neutral-400">
						Expires {method.exp_month.toString().padStart(2, '0')}/
						{method.exp_year}
					</span>
				)}
			</div>
			<div className="text-sm text-neutral-500 dark:text-neutral-400">
				<p>
					Card Holder: {method.cardHolder || 'N/A'}
					<br />
					Address: {method.billingAddressLine1 || 'N/A'}
					{method.billingAddressLine2 && <>, {method.billingAddressLine2}</>}
					<br />
					{method.billingCity || 'N/A'}, {method.billingState || 'N/A'}{' '}
					{method.billingPostalCode || 'N/A'}, {method.billingCountry || 'N/A'}
				</p>
			</div>

			<div className="relative z-10 mt-2" ref={dropdownRef}>
				<button
					className="text-blue-600 hover:underline"
					onClick={() => handleDropdownToggle(method.id)}
				>
					Manage
				</button>
				<AnimatePresence>
					{activeDropdown === method.id && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-neutral-300 bg-white p-2 shadow-lg"
						>
							{confirmingDelete === method.id ? (
								<>
									<p className="mb-2 text-sm text-neutral-600">
										Are you sure you want to delete this payment method?
									</p>
									<button
										className="block w-full rounded p-2 text-left text-red-600 hover:bg-red-100"
										onClick={() => handleRemovePaymentMethod(method.id)}
									>
										Yes, Delete
									</button>
									<button
										className="block w-full rounded p-2 text-left text-blue-600 hover:bg-blue-100"
										onClick={() => setConfirmingDelete(null)}
									>
										Cancel
									</button>
								</>
							) : (
								<>
									<button
										className="block w-full rounded p-2 text-left text-blue-600 hover:bg-blue-100"
										onClick={() => handleEditPaymentMethod(method)}
									>
										Edit
									</button>
									<button
										className="block w-full rounded p-2 text-left text-red-600 hover:bg-red-100"
										onClick={() => setConfirmingDelete(method.id)}
									>
										Delete
									</button>
								</>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.li>
	)

	return (
		<div className="space-y-6 sm:space-y-8">
			<h2 className="text-3xl font-semibold">Payments & payouts</h2>
			<div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
			<div className="max-w-2xl">
				<span className="block text-xl font-semibold">Payout methods</span>
				<br />
				<span className="block text-neutral-700 dark:text-neutral-300">
					{` When you receive a payment for a reservation, we call that payment
          to you a "payout." Our secure payment system supports several
          payout methods, which can be set up below. Go to FAQ.`}
					<br />
					<br />
					To get paid, you need to set up a payout method. travsus releases
					payouts about 24 hours after a guest's scheduled check-in time. The
					time it takes for the funds to appear in your account depends on your
					payout method. Learn more
				</span>

				{loading && <p>Loading payment methods...</p>}
				{error && <p className="text-red-500">{error}</p>}

				<AnimatePresence>
					{paymentMethods.length > 0 ? (
						<motion.ul
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="mt-4 space-y-4"
						>
							{paymentMethods.map(renderPaymentMethodCard)}
						</motion.ul>
					) : (
						!loading && <p>No payment methods found. Please add one.</p>
					)}
				</AnimatePresence>

				{editingMethod && (
					<Form
						onSubmit={handleUpdatePaymentMethod}
						initialValues={{
							cardHolder: editingMethod.cardHolder || '',
							billingAddressLine1: editingMethod.billingAddressLine1 || '',
							billingAddressLine2: editingMethod.billingAddressLine2 || '',
							billingCity: editingMethod.billingCity || '',
							billingState: editingMethod.billingState || '',
							billingPostalCode: editingMethod.billingPostalCode || '',
							billingCountry: editingMethod.billingCountry || '',
						}}
						render={({ handleSubmit, values }) => (
							<form onSubmit={handleSubmit} className="mt-4 space-y-4">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<Field name="cardHolder">
										{({ input }) => (
											<Input
												{...input}
												label="Card Holder"
												placeholder="Enter card holder name"
											/>
										)}
									</Field>
									<Field name="billingAddressLine1">
										{({ input }) => (
											<Input
												{...input}
												label="Address Line 1"
												placeholder="Enter address line 1"
											/>
										)}
									</Field>
								</div>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<Field name="billingAddressLine2">
										{({ input }) => (
											<Input
												{...input}
												label="Address Line 2"
												placeholder="Enter address line 2"
											/>
										)}
									</Field>
									<Field name="billingCity">
										{({ input }) => (
											<Input {...input} label="City" placeholder="Enter city" />
										)}
									</Field>
								</div>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
									<Field name="billingState">
										{({ input }) => (
											<Input
												{...input}
												label="State"
												placeholder="Enter state"
											/>
										)}
									</Field>
									<Field name="billingPostalCode">
										{({ input }) => (
											<Input
												{...input}
												label="Postal Code"
												placeholder="Enter postal code"
											/>
										)}
									</Field>
									{/* <FieldSelectFormItem
										// value="ES"
										name="billingCountry"
										label="Choose an option"
										placeholder="Select an option"
										options={allCountries.map((country: any) => ({
											label: country?.name?.common,
											value: country?.cca2,
										}))}
									/> */}
								</div>
								<div className="flex justify-between">
									<ButtonPrimary type="submit" disabled={loading}>
										{loading ? 'Updating...' : 'Update Payment Method'}
									</ButtonPrimary>
									<ButtonPrimary type="button" onClick={handleCloseEditForm}>
										Cancel
									</ButtonPrimary>
								</div>
							</form>
						)}
					/>
				)}
			</div>
		</div>
	)
}

export default AccountBilling

// {
// 	/* <div className="pt-10">
// 					<ButtonPrimary>Add payout method</ButtonPrimary>
// 				</div> */
// }
