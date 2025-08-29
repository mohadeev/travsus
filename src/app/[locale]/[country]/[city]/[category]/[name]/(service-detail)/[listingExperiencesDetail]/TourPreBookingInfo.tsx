'use client'

import {
	Accessibility,
	Phone,
	MessageCircle,
	Info,
	FileQuestion as CircleQuestionMark,
	RotateCcw,
	X,
} from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { toggleTawdWidget } from '@/app/[locale]/GlobalRedux/Features/overlaySlice/overlaySlice'
import { useDispatch } from 'react-redux'
import { useState } from 'react' // Added useState for modal state

export default function BookingInfo() {
	const t = useTranslations('BookingInfo')
	const dispatch = useDispatch()
	const [isModalOpen, setIsModalOpen] = useState(false) // Added modal state

	const hanelToggle = () => {
		dispatch(toggleTawdWidget({ value: true }))
	}
	const textclassName = 'text-xs font-medium text-black underline'

	return (
		<>
			<div className="my-10 grid grid-cols-1 gap-15 p-0 text-gray-800 md:grid-cols-2">
				{/* Accessibility */}
				<div className="flex items-start space-x-3">
					<span className="rounded-full border-2 border-black p-2">
						<Accessibility className="h-6 w-6 shrink-0 text-black" />
					</span>
					<div>
						<h2 className="mb-2 text-lg font-semibold text-black">
							{t('accessibility')}
						</h2>
						<ul className="list-disc space-y-1 pl-5 text-base text-black">
							<li>{t('not_wheelchair_accessible')}</li>
							<li>{t('child_seats_available')}</li>
						</ul>
					</div>
				</div>

				{/* Cancellation Policy */}
				<div className="flex items-start space-x-3">
					<span className="rounded-full border-2 border-black p-2">
						<RotateCcw className="h-6 w-6 shrink-0 text-black" />
					</span>
					<div>
						<h2 className="mb-2 text-lg font-semibold text-black">
							{t('cancellation_policy')}
						</h2>
						<p className={textclassName}>
							{t('cancellation_policy_description')}
						</p>
						<ul className="mt-2 list-disc space-y-1 pl-5 text-base text-black">
							<li>{t('cancellation_less_than_24h')}</li>
						</ul>
						<button
							onClick={() => setIsModalOpen(true)} // Changed from link to button that opens modal
							className="mt-2 inline-block font-semibold text-black hover:underline"
						>
							{t('read_more')}
						</button>
					</div>
				</div>

				{/* Help */}
				<div className="flex items-start space-x-3">
					<span className="rounded-full border-2 border-black p-2">
						<CircleQuestionMark className="h-6 w-6 shrink-0 text-black" />
					</span>
					<div>
						<h2 className="mb-2 text-lg font-semibold text-black">
							{t('help')}
						</h2>
						<p className="text-base text-black">
							{t('help_description')}{' '}
							<span className="font-semibold">110964P11</span>
						</p>
						<div className="mt-3 flex flex-col space-y-4 sm:flex-row sm:gap-6 sm:space-y-0">
							<p className="flex items-center gap-3">
								<Phone className="h-4 w-4 text-black" />
								<a
									href="tel:+34911776743"
									className="text-xs font-semibold text-black hover:underline"
								>
									+34 643 63 5962
								</a>
							</p>
							<p className="flex items-center gap-3">
								<MessageCircle className="h-4 w-4 text-black" />
								<button
									onClick={hanelToggle}
									className="text-xs font-semibold text-black hover:underline"
								>
									{t('chat_now')}
								</button>
							</p>
						</div>
					</div>
				</div>

				{/* Additional Information */}
				<div className="flex items-start space-x-3">
					<span className="rounded-full border-2 border-black p-2">
						<Info className="h-6 w-6 shrink-0 text-black" />
					</span>
					<div>
						<h2 className="mb-2 text-lg font-semibold text-black">
							{t('additional_information')}
						</h2>
						<ul className="list-disc space-y-1 pl-5 text-base text-black">
							<li>{t('confirmation_received')}</li>
							<li>{t('most_travelers_can_participate')}</li>
							<li>{t('max_travelers')}</li>
						</ul>
					</div>
				</div>

				{/* Final Note */}
				<div className="col-span-1 mt-6 text-sm text-black md:col-span-2">
					{t('earnings_disclaimer')}{' '}
					<a href="#" className="font-semibold text-black hover:underline">
						{t('learn_more')}
					</a>
				</div>
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
						<button
							onClick={() => setIsModalOpen(false)}
							className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
						>
							<X className="h-6 w-6" />
						</button>

						<h2 className="mb-4 text-xl font-semibold text-black">
							Política de cancelación
						</h2>

						<p className="mb-4 text-gray-600">
							Para recibir el reembolso íntegro de la experiencia debes
							cancelarla al menos 24 horas antes de que empiece.
						</p>

						<ul className="mb-6 list-disc space-y-2 pl-5 text-gray-700">
							<li>
								Si cancelas la experiencia menos de 24 horas antes de que
								empiece, no se te devolverá el importe abonado.
							</li>
							<li>
								No se aceptará ningún cambio que se realice cuando falten menos
								de 24 horas para empezar la experiencia.
							</li>
							<li>
								La hora límite se basa en la hora local del lugar donde se
								realiza la experiencia.
							</li>
							<li>
								Tiene que hacer buen tiempo para que se pueda realizar esta
								experiencia. Si se cancela por malas condiciones meteorológicas,
								se te ofrecerá otra fecha o el reembolso total del importe
								abonado.
							</li>
							<li>
								En esta experiencia debe haber un número mínimo de viajeros. Si
								se cancela porque no se llega a dicho mínimo, se te ofrecerá
								otra fecha o experiencia o el reembolso total del importe
								abonado.
							</li>
						</ul>

						<a
							href="#"
							className="font-semibold text-black underline hover:no-underline"
						>
							Obtén más información sobre las cancelaciones
						</a>
					</div>
				</div>
			)}
		</>
	)
}
