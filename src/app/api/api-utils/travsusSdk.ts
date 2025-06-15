import { Description } from '@headlessui/react'

const travsusSdk = async (params: any) => {
	const { action, subAction } = params || {}
	return functions?.find((fun) => fun.subAction === subAction)?.function(params)
}

const functions = [
	// {
	// 	action: 'find',
	// 	subAction: 'findLineItems',
	// 	function: (params: any) => {
	// 		const { tour } = params
	// 		const { pricingTiers } = tour
	// 		if (pricingTiers) {
	// 			return pricingTiers
	// 		} else {
	// 			warningHandler()
	// 		}
	// 	},
	// },
	// {
	// 	action: 'find',
	// 	subAction: 'findSpisificLineItems',
	// 	function: (params: any) => {
	// 		console.log()
	// 		const { tour, lineItemName } = params
	// 		const findLineItems: any = findFuntion('findLineItems')?.function({
	// 			tour: tour,
	// 		})
	// 		console.log('findLineItems: ', findLineItems)
	// 		const lineItem = findLineItems?.find(
	// 			(line: any) => line.description === lineItemName,
	// 		)
	// 		if (lineItem) {
	// 			return lineItem
	// 		} else {
	// 			warningHandler()
	// 		}
	// 	},
	// },
	{
		action: 'find',
		subAction: 'findPricingTiers',
		function: (params: any) => {
			const { tour } = params
			const { pricingTiers } = tour
			if (pricingTiers) {
				return pricingTiers
			} else {
				// warningHandler()
			}
		},
	},
	{
		action: 'find',
		subAction: 'findSpisificPricingTiers',
		function: (params: any) => {
			const { tour, range, totalGuests } = params
			const findPricingTiers: any = findFuntion({
				...params,
				...{ subAction: 'findPricingTiers' },
			})
			let findedTier
			if (totalGuests >= 40) {
				findedTier = tour.pricingTiers.find(
					(eachTier: any) => eachTier.maxSeats >= 40,
				)
			} else {

				findedTier = tour.pricingTiers.find(
					(eachTier: any) =>
						totalGuests >= eachTier.minSeats &&
						totalGuests <= eachTier.maxSeats,
				)
			}

			return findedTier
		},
	},
	{
		action: 'find',
		subAction: 'findSpisificPricingTiers',
		function: (params: any) => {
			const { tour, range, totalGuests } = params
			const findPricingTiers: any = findFuntion({
				...params,
				...{ subAction: 'findPricingTiers' },
			})
			let findedTier
			if (totalGuests >= 40) {
				findedTier = tour.pricingTiers.find(
					(eachTier: any) => eachTier.maxSeats >= 40,
				)
			} else {

				findedTier = tour.pricingTiers.find(
					(eachTier: any) =>
						totalGuests >= eachTier.minSeats &&
						totalGuests <= eachTier.maxSeats,
				)
			}

			return findedTier
		},
	},
]

const findFuntion = (params: any) => {
	return functions
		.find((fun) => fun.subAction === params.subAction)
		?.function(params)
}

const errorHandler = () => {
	return { error: true }
}
const warningHandler = () => {
	return { error: true }
}

export default travsusSdk
