'use client'
// Payments: the cards saved when booking (remove them here), and payout
// methods for affiliate commissions.
import { useEffect, useState } from 'react'
import { CreditCard, Loader2, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useToast } from '@/hooks/useToast'
import PayoutMethodsList from '@/components/payout/payout-methods-list'
import AddPayoutMethodForm from '@/components/payout/add-payout-method-form'

type Card = { id: string; brand: string; last4: string; exp_month: number; exp_year: number; isDefault?: boolean }
type PayoutMethod = {
	id: string
	type: string
	email?: string
	accountHolderName?: string
	accountNumber?: string
	bankName?: string
	country: string
	currency: string
	isDefault: boolean
}

export default function PaymentsPage() {
	const t = useTranslations('Account')
	const tPay = useTranslations('PaymentMethodsPage')
	const { toast } = useToast()
	const [cards, setCards] = useState<Card[]>([])
	const [payouts, setPayouts] = useState<PayoutMethod[]>([])
	const [loading, setLoading] = useState(true)
	const [removing, setRemoving] = useState<string | null>(null)
	const [addingPayout, setAddingPayout] = useState(false)

	useEffect(() => {
		Promise.all([
			fetch('/api/payment-methods').then((r) => (r.ok ? r.json() : {})),
			fetch('/api/payout-methods').then((r) => (r.ok ? r.json() : {})),
		])
			.then(([cardData, payoutData]: any[]) => {
				setCards(cardData.paymentMethods ?? [])
				setPayouts(payoutData.payoutMethods ?? [])
			})
			.catch(() => toast({ title: tPay('error'), description: tPay('failed_to_load'), variant: 'destructive' }))
			.finally(() => setLoading(false))
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	async function removeCard(id: string) {
		if (!window.confirm(t('card_remove_confirm'))) return
		setRemoving(id)
		const res = await fetch('/api/remove-payment-method', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id }),
		}).catch(() => null)
		if (res?.ok) setCards((list) => list.filter((c) => c.id !== id))
		else toast({ title: tPay('error'), description: t('card_remove_error'), variant: 'destructive' })
		setRemoving(null)
	}

	// Payout methods: same API calls as before
	async function payoutRequest(method: 'POST' | 'DELETE' | 'PATCH', body: any, failKey: string) {
		const res = await fetch('/api/payout-methods', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
		const data = await res.json().catch(() => ({}))
		if (!res.ok) throw new Error(data.message || tPay(failKey))
		return data
	}
	const run = async (fn: () => Promise<void>, doneKey: string) => {
		try {
			await fn()
			toast({ title: tPay('success'), description: tPay(doneKey), variant: 'success' })
		} catch (error) {
			toast({ title: tPay('error'), description: error instanceof Error ? error.message : String(error), variant: 'destructive' })
		}
	}
	const addPayout = (data: any) =>
		run(async () => {
			const result = await payoutRequest('POST', data, 'failed_to_add_payout')
			setPayouts((list) => [...list, result.payoutMethod])
			setAddingPayout(false)
		}, 'payout_method_added')
	const deletePayout = (id: string) =>
		run(async () => {
			await payoutRequest('DELETE', { id }, 'failed_to_delete_payout')
			setPayouts((list) => list.filter((m) => m.id !== id))
		}, 'payout_method_removed')
	const defaultPayout = (id: string) =>
		run(async () => {
			await payoutRequest('PATCH', { id, action: 'setDefault' }, 'failed_to_update_payout')
			setPayouts((list) => list.map((m) => ({ ...m, isDefault: m.id === id })))
		}, 'default_payout_updated')

	return (
		<div className="max-w-3xl">
			<h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{t('nav_payments')}</h1>
			<p className="mt-2 text-neutral-500">{t('payments_text')}</p>

			{/* Saved cards */}
			<section className="mt-10">
				<h2 className="text-xl font-bold tracking-tight">{t('cards_title')}</h2>
				<p className="mt-1 text-sm text-neutral-500">{t('cards_text')}</p>
				{loading ? (
					<div className="mt-5 h-20 animate-pulse rounded-3xl bg-neutral-100 dark:bg-neutral-900" />
				) : cards.length === 0 ? (
					<p className="mt-5 rounded-3xl bg-neutral-100 px-6 py-8 text-center text-neutral-500 dark:bg-neutral-900">{t('cards_empty')}</p>
				) : (
					<ul className="mt-5 space-y-3">
						{cards.map((card) => (
							<li key={card.id} className="flex items-center gap-4 rounded-3xl bg-neutral-100 p-5 dark:bg-neutral-900">
								<span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white dark:bg-neutral-950">
									<CreditCard className="h-5 w-5" />
								</span>
								<div className="min-w-0 flex-1">
									<p className="font-semibold capitalize">
										{card.brand} •••• {card.last4}
										{card.isDefault && <span className="ml-2 rounded-full bg-neutral-950 px-2 py-0.5 text-xs font-semibold normal-case text-white dark:bg-white dark:text-neutral-950">{t('default')}</span>}
									</p>
									<p className="text-sm text-neutral-500">{t('card_expires', { date: `${String(card.exp_month).padStart(2, '0')}/${card.exp_year}` })}</p>
								</div>
								<button
									type="button"
									onClick={() => removeCard(card.id)}
									disabled={removing === card.id}
									aria-label={t('card_remove')}
									className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-neutral-500 transition hover:bg-white hover:text-red-600 disabled:opacity-50 dark:hover:bg-neutral-950"
								>
									{removing === card.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
								</button>
							</li>
						))}
					</ul>
				)}
			</section>

			{/* Payouts (affiliate commissions) */}
			<section className="mt-14 border-t border-neutral-200 pt-10 dark:border-neutral-800">
				<h2 className="text-xl font-bold tracking-tight">{t('payouts_title')}</h2>
				<p className="mt-1 text-sm text-neutral-500">{t('payouts_text')}</p>
				<div className="mt-5">
					{loading ? (
						<div className="h-20 animate-pulse rounded-3xl bg-neutral-100 dark:bg-neutral-900" />
					) : addingPayout ? (
						<AddPayoutMethodForm onCancel={() => setAddingPayout(false)} onSubmit={addPayout} />
					) : (
						<PayoutMethodsList payoutMethods={payouts} onAddMethod={() => setAddingPayout(true)} onDeleteMethod={deletePayout} onSetDefault={defaultPayout} />
					)}
				</div>
			</section>
		</div>
	)
}
