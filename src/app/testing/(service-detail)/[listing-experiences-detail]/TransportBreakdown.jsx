import React from 'react'

const TransportBreakdown = () => {
	// Data directly inside the component
	const transportData = {
		transport_service_breakdown: [
			{
				service_type: 'vehicle_based',
				service_details: {
					vehicle_type: 'bus',
					quantity: 5,
					unit: 'vehicles',
					description: 'Transport service for company event with 5 buses',
					cost_per_vehicle: 500,
					total_cost: 2500,
				},
			},
			{
				service_type: 'passenger_based',
				service_details: {
					vehicle_type: 'shuttle',
					quantity: 100,
					unit: 'pax',
					description: 'Shuttle service for 100 passengers for event transport',
					cost_per_passenger: 15,
					total_cost: 1500,
				},
			},
		],
	}

	return (
		<div className="mx-auto mt-10 max-w-4xl rounded-lg bg-gray-100 p-6 shadow-lg">
			<h1 className="mb-6 text-2xl font-bold text-gray-800">
				Transport Service Breakdown
			</h1>

			{transportData.transport_service_breakdown.map((service, index) => (
				<div
					key={index}
					className="mb-6 rounded-lg border-l-4 bg-white p-4 shadow-md"
					style={{
						borderColor:
							service.service_type === 'vehicle_based' ? '#3b82f6' : '#f97316',
					}}
				>
					<h2 className="text-xl font-semibold text-gray-700">
						{service.service_type === 'vehicle_based'
							? 'Vehicle-Based Service'
							: 'Passenger-Based Service'}
					</h2>
					<p className="mb-4 text-gray-600">
						{service.service_details.description}
					</p>

					<div className="flex flex-wrap">
						<div className="mb-4 w-1/2">
							<span className="font-semibold text-gray-800">Vehicle Type:</span>{' '}
							<span className="text-gray-600">
								{service.service_details.vehicle_type}
							</span>
						</div>
						<div className="mb-4 w-1/2">
							<span className="font-semibold text-gray-800">Quantity:</span>{' '}
							<span className="text-gray-600">
								{service.service_details.quantity}{' '}
								{service.service_details.unit}
							</span>
						</div>
						<div className="mb-4 w-1/2">
							<span className="font-semibold text-gray-800">
								Cost per {service.service_details.unit}:
							</span>{' '}
							<span className="text-gray-600">
								$
								{service.service_type === 'vehicle_based'
									? service.service_details.cost_per_vehicle
									: service.service_details.cost_per_passenger}
							</span>
						</div>
						<div className="mb-4 w-1/2">
							<span className="font-semibold text-gray-800">Total Cost:</span>{' '}
							<span className="text-gray-600">
								${service.service_details.total_cost}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default TransportBreakdown
