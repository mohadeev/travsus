'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { CreditCard } from 'lucide-react'
import NewCardForm from './NewCardForm'

interface PaymentMethodsProps {
	paymentMethods: any[]
	selectedPaymentMethod: string | null
	setSelectedPaymentMethod: (val: string | null) => void
	showNewPaymentForm: boolean
	setShowNewPaymentForm: (val: boolean) => void
	saveAsNewPaymentMethod: boolean
	setSaveAsNewPaymentMethod: (val: boolean) => void
	handlePayment: (formData: any) => void
	loading: boolean
	t: any
}

const PaymentMethods: React.FC<PaymentMethodsProps> & {
	initiatePayment?: any
	processExistingPaymentMethod?: any
} = ({
	paymentMethods,
	selectedPaymentMethod,
	setSelectedPaymentMethod,
	showNewPaymentForm,
	setShowNewPaymentForm,
	saveAsNewPaymentMethod,
	setSaveAsNewPaymentMethod,
	handlePayment,
	loading,
	t,
}) => {
	return (
		<>
			{paymentMethods.length > 0 && (
				<Card className="mx-auto mb-4 w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-2xl font-bold">
							{t('Select_Payment_Method')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<RadioGroup
							value={selectedPaymentMethod || ''}
							onValueChange={(value) => {
								setSelectedPaymentMethod(value)
								setShowNewPaymentForm(value === 'new_card')
							}}
							className="space-y-4"
						>
							{paymentMethods.map((method) => (
								<div
									key={method.stripePaymentMethodId}
									className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-slate-100"
								>
									<RadioGroupItem
										value={method.stripePaymentMethodId}
										id={method.stripePaymentMethodId}
									/>
									<Label
										htmlFor={method.stripePaymentMethodId}
										className="flex flex-1 cursor-pointer items-center justify-between"
									>
										<span className="flex items-center">
											<CreditCard className="mr-2 h-5 w-5 text-blue-500" />
											<span>
												{method.brand} •••• {method.last4}
											</span>
										</span>
										<span className="text-sm text-gray-500">
											{t('Expires_Date', {
												month: method.exp_month,
												year: method.exp_year,
											})}
										</span>
									</Label>
								</div>
							))}
							<div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-slate-100">
								<RadioGroupItem value="new_card" id="new_card" />
								<Label
									htmlFor="new_card"
									className="flex flex-1 cursor-pointer items-center"
								>
									<CreditCard className="mr-2 h-5 w-5 text-blue-500" />
									<span>{t('Use_Another_Card')}</span>
								</Label>
							</div>
							<div className="flex cursor-pointer items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-slate-100">
								<RadioGroupItem
									value="book_now_pay_later"
									id="book_now_pay_later"
								/>
								<Label
									htmlFor="book_now_pay_later"
									className="flex flex-1 cursor-pointer items-center"
								>
									{/* <span className="mr-2 h-5 w-5 text-green-500">💸</span> */}
									<span>{t('Book_Now_Pay_Later')}</span>
								</Label>
							</div>
						</RadioGroup>
					</CardContent>
				</Card>
			)}

			{showNewPaymentForm && (
				<Card className="mx-auto mt-4 w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-2xl font-bold">
							{t('Add_New_Card')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<NewCardForm onSubmit={handlePayment} loading={loading} />
						<div className="mt-2 flex items-center space-x-2">
							<Checkbox
								id="saveNewPaymentMethod"
								checked={saveAsNewPaymentMethod}
								onCheckedChange={(checked) =>
									setSaveAsNewPaymentMethod(checked as boolean)
								}
							/>
							<label
								htmlFor="saveNewPaymentMethod"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								{t('Save_As_New_Payment_Method')}
							</label>
						</div>
					</CardContent>
				</Card>
			)}
		</>
	)
}

export default PaymentMethods
