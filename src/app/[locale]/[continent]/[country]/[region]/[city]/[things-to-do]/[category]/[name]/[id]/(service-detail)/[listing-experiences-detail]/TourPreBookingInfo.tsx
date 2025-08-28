import {
	Baby,
	Phone,
	MessageCircle,
	Info,
	HelpCircle,
	RotateCcw,
} from 'lucide-react'

export default function BookingInfo() {
	return (
		<div className="grid grid-cols-1 gap-10 rounded-2xl bg-white p-8 text-gray-800 shadow-sm md:grid-cols-2">
			{/* Accesibilidad */}
			<div className="flex items-start space-x-3">
				<Baby className="h-6 w-6 shrink-0 text-green-700" />
				<div>
					<h2 className="mb-2 text-lg font-semibold">Accesibilidad</h2>
					<ul className="list-disc space-y-1 pl-5 text-gray-700">
						<li>No es accesible para sillas de ruedas</li>
						<li>Asientos o sillas infantiles disponibles</li>
					</ul>
				</div>
			</div>

			{/* Política de cancelación */}
			<div className="flex items-start space-x-3">
				<RotateCcw className="h-6 w-6 shrink-0 text-green-700" />
				<div>
					<h2 className="mb-2 text-lg font-semibold">
						Política de cancelación
					</h2>
					<p className="text-gray-700">
						Para recibir el reembolso íntegro de la experiencia debes cancelarla
						al menos 24 horas antes de que empiece.
					</p>
					<ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700">
						<li>
							Si cancelas la experiencia menos de 24 horas antes de que empiece,
							no se te devolverá el importe abonado.
						</li>
					</ul>
					<a
						href="#"
						className="mt-2 inline-block font-semibold text-green-700 hover:underline"
					>
						Lee más
					</a>
				</div>
			</div>

			{/* Ayuda */}
			<div className="flex items-start space-x-3">
				<HelpCircle className="h-6 w-6 shrink-0 text-green-700" />
				<div>
					<h2 className="mb-2 text-lg font-semibold">Ayuda</h2>
					<p className="text-gray-700">
						Si tiene alguna pregunta sobre este tour o necesita ayuda para hacer
						la reserva, estaremos encantados de ayudarle. Solo tiene que llamar
						al siguiente número e indicar el código del producto:{' '}
						<span className="font-semibold">110964P11</span>
					</p>
					<div className="mt-3 space-y-2">
						<p className="flex items-center space-x-2">
							<Phone className="h-5 w-5 text-green-700" />
							<a
								href="tel:+34911776743"
								className="font-semibold text-green-700 hover:underline"
							>
								+34 643 63 5962
							</a>
						</p>
						<p className="flex items-center space-x-2">
							<MessageCircle className="h-5 w-5 text-green-700" />
							<a
								href="#"
								className="font-semibold text-green-700 hover:underline"
							>
								Chatear ahora
							</a>
						</p>
					</div>
				</div>
			</div>

			{/* Información adicional */}
			<div className="flex items-start space-x-3">
				<Info className="h-6 w-6 shrink-0 text-green-700" />
				<div>
					<h2 className="mb-2 text-lg font-semibold">Información adicional</h2>
					<ul className="list-disc space-y-1 pl-5 text-gray-700">
						<li>
							La confirmación se recibirá en el momento en que se realice la
							reserva
						</li>
						<li>La mayoría de viajeros pueden participar en la experiencia</li>
						<li>
							En esta excursión o actividad habrá 100 viajeros como máximo
						</li>
					</ul>
				</div>
			</div>

			{/* Nota final */}
			<div className="col-span-1 mt-6 text-sm text-gray-600 md:col-span-2">
				Las ganancias influyen en las experiencias que se muestran en esta
				página,{' '}
				<a href="#" className="font-semibold text-green-700 hover:underline">
					obtén más información.
				</a>
			</div>
		</div>
	)
}
