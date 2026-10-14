'use client'
// Shows the messages sent with toast() from '@/components/ui/use-toast'
// ("Tour saved", errors…). Nothing displayed them before, so saving gave
// no feedback. Each message closes by itself after a few seconds.
import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function Toaster() {
	const { toasts, dismiss } = useToast()
	const visible = toasts.filter((t: any) => t.open !== false)

	useEffect(() => {
		if (!visible.length) return
		const timers = visible.map((t: any) => setTimeout(() => dismiss(t.id), t.variant === 'destructive' ? 7000 : 4000))
		return () => timers.forEach(clearTimeout)
	}, [visible.map((t: any) => t.id).join()]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-8">
			{visible.map((t: any) => {
				const error = t.variant === 'destructive'
				return (
					<div
						key={t.id}
						role={error ? 'alert' : 'status'}
						className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl px-4 py-3 shadow-2xl ${error ? 'bg-red-600 text-white' : 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'}`}
					>
						{error ? <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />}
						<div className="min-w-0 flex-1 text-sm">
							{t.title && <p className="font-semibold">{t.title}</p>}
							{t.description && <p className="opacity-80">{t.description}</p>}
						</div>
						<button type="button" onClick={() => dismiss(t.id)} aria-label="Close" className="-mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-full opacity-70 hover:opacity-100">
							<X className="h-4 w-4" />
						</button>
					</div>
				)
			})}
		</div>
	)
}
