import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

interface ToastProps {
	id: string
	title: string
	description: string
	variant: 'default' | 'destructive' | 'success'
}

const Toast: React.FC<ToastProps & { onClose: () => void }> = ({
	title,
	description,
	variant,
	onClose,
}) => {
	const bgColor =
		variant === 'destructive'
			? 'bg-red-500'
			: variant === 'success'
				? 'bg-green-500'
				: 'bg-blue-500'

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 50 }}
			className={`${bgColor} w-full max-w-sm rounded-md p-4 text-white shadow-lg`}
		>
			<div className="flex items-start justify-between">
				<div>
					<h3 className="font-semibold">{title}</h3>
					<p className="mt-1 text-sm">{description}</p>
				</div>
				<button
					onClick={onClose}
					className="text-white hover:text-gray-200 focus:outline-none"
				>
					×
				</button>
			</div>
		</motion.div>
	)
}

const ToastContainer: React.FC<{
	toasts: ToastProps[]
	removeToast: (id: string) => void
}> = ({ toasts, removeToast }) => {
	return createPortal(
		<div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-4">
			<AnimatePresence>
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						{...toast}
						onClose={() => removeToast(toast.id)}
					/>
				))}
			</AnimatePresence>
		</div>,
		document.body,
	)
}

export const useToast = () => {
	const [toasts, setToasts] = useState<ToastProps[]>([])

	const addToast = useCallback(
		({ title, description, variant = 'default' }: Omit<ToastProps, 'id'>) => {
			const id = Math.random().toString(36).substr(2, 9)
			setToasts((prevToasts) => [
				...prevToasts,
				{ id, title, description, variant },
			])

			// Automatically remove toast after 5 seconds
			setTimeout(() => {
				removeToast(id)
			}, 5000)
		},
		[],
	)

	const removeToast = useCallback((id: string) => {
		setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
	}, [])

	const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
		children,
	}) => (
		<>
			{children}
			<ToastContainer toasts={toasts} removeToast={removeToast} />
		</>
	)

	return { toast: addToast, ToastProvider }
}
