import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateTourField } from '../../store/tourSlice'
import { RootState } from '@/app/GlobalRedux/store'
import { Input } from '@/components/ui/input'
import Textarea from '@/shared/Textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

export function Step5PricingAndAccommodations({
	onNext,
	onPrev,
}: {
	onNext: () => void
	onPrev: () => void
}) {
	const tour = useSelector((state: RootState) => state.tour)
	const dispatch = useDispatch()
	const { control, handleSubmit } = useForm({
		defaultValues: {
			price: tour.price,
			discount: tour.discount,
			pricingTiers: tour.pricingTiers,
			accommodations: tour.accommodations,
		},
	})

	const {
		fields: pricingTierFields,
		append: appendPricingTier,
		remove: removePricingTier,
	} = useFieldArray({
		control,
		name: 'pricingTiers',
	})

	const {
		fields: accommodationFields,
		append: appendAccommodation,
		remove: removeAccommodation,
	} = useFieldArray({
		control,
		name: 'accommodations',
	})

	const onSubmit = (data: any) => {
		dispatch(updateTourField(data))
		onNext()
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div>
				<Label htmlFor="price">Base Price</Label>
				<Controller
					name="price"
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							id="price"
							type="number"
							placeholder="Enter base price"
						/>
					)}
				/>
			</div>

			<div>
				<Label htmlFor="discount">Discount</Label>
				<Controller
					name="discount"
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							id="discount"
							type="number"
							placeholder="Enter discount"
						/>
					)}
				/>
			</div>

			<div>
				<Label>Pricing Tiers</Label>
				{pricingTierFields.map((field, index) => (
					<div key={field.id} className="mt-2 space-y-2 rounded border p-4">
						<Controller
							name={`pricingTiers.${index}.minSeats`}
							control={control}
							render={({ field }) => (
								<Input {...field} type="number" placeholder="Min Seats" />
							)}
						/>
						<Controller
							name={`pricingTiers.${index}.maxSeats`}
							control={control}
							render={({ field }) => (
								<Input {...field} type="number" placeholder="Max Seats" />
							)}
						/>
						<Controller
							name={`pricingTiers.${index}.pricing.pricePerDay`}
							control={control}
							render={({ field }) => (
								<Input {...field} type="number" placeholder="Price Per Day" />
							)}
						/>
						<Controller
							name={`pricingTiers.${index}.pricing.totalPrice`}
							control={control}
							render={({ field }) => (
								<Input {...field} type="number" placeholder="Total Price" />
							)}
						/>
						<Controller
							name={`pricingTiers.${index}.pricing.currency`}
							control={control}
							render={({ field }) => (
								<Input {...field} placeholder="Currency" />
							)}
						/>
						<Button type="button" onClick={() => removePricingTier(index)}>
							Remove Pricing Tier
						</Button>
					</div>
				))}
				<Button
					type="button"
					onClick={() =>
						appendPricingTier({
							minSeats: 0,
							maxSeats: 0,
							pricing: { pricePerDay: 0, totalPrice: 0, currency: '' },
						})
					}
					className="mt-2"
				>
					Add Pricing Tier
				</Button>
			</div>

			<div>
				<Label>Accommodations</Label>
				{accommodationFields.map((field, index) => (
					<div key={field.id} className="mt-2 space-y-2 rounded border p-4">
						<Controller
							name={`accommodations.${index}.name`}
							control={control}
							render={({ field }) => (
								<Input {...field} placeholder="Accommodation Name" />
							)}
						/>
						<Controller
							name={`accommodations.${index}.description`}
							control={control}
							render={({ field }) => (
								<Textarea {...field} placeholder="Accommodation Description" />
							)}
						/>
						{/* Nested FieldArray for pricingTiers */}
						<div>
							<Label>Pricing Tiers</Label>
							<Controller
								name={`accommodations.${index}.pricingTiers`}
								control={control}
								render={({ field }) => (
									<div>
										{field.value?.map((pricingTier: any, pIndex: number) => (
											<div
												key={pIndex}
												className="mt-2 space-y-2 rounded border p-2"
											>
												<Input
													value={pricingTier.name}
													onChange={(e) => {
														const newValue = [...field.value]
														newValue[pIndex].name = e.target.value
														field.onChange(newValue)
													}}
													placeholder="Tier Name"
												/>
												<Input
													type="number"
													value={pricingTier.minSeats}
													onChange={(e) => {
														const newValue = [...field.value]
														newValue[pIndex].minSeats = parseInt(e.target.value)
														field.onChange(newValue)
													}}
													placeholder="Min Seats"
												/>
												<Input
													type="number"
													value={pricingTier.maxSeats}
													onChange={(e) => {
														const newValue = [...field.value]
														newValue[pIndex].maxSeats = parseInt(e.target.value)
														field.onChange(newValue)
													}}
													placeholder="Max Seats"
												/>
												{/* Bed Options */}
												{pricingTier.bedOptions.map(
													(bedOption: any, bIndex: number) => (
														<div
															key={bIndex}
															className="mt-2 space-y-2 rounded border p-2"
														>
															<Select
																value={bedOption.bedType}
																onValueChange={(value) => {
																	const newValue = [...field.value]
																	newValue[pIndex].bedOptions[bIndex].bedType =
																		value
																	field.onChange(newValue)
																}}
															>
																<SelectTrigger>
																	<SelectValue placeholder="Select bed type" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="SINGLE">Single</SelectItem>
																	<SelectItem value="TWIN">Twin</SelectItem>
																	<SelectItem value="COUPLE">Couple</SelectItem>
																</SelectContent>
															</Select>
															<Input
																type="number"
																value={bedOption.maxOccupancy}
																onChange={(e) => {
																	const newValue = [...field.value]
																	newValue[pIndex].bedOptions[
																		bIndex
																	].maxOccupancy = parseInt(e.target.value)
																	field.onChange(newValue)
																}}
																placeholder="Max Occupancy"
															/>
															<Input
																type="number"
																value={bedOption.basePrice}
																onChange={(e) => {
																	const newValue = [...field.value]
																	newValue[pIndex].bedOptions[
																		bIndex
																	].basePrice = parseFloat(e.target.value)
																	field.onChange(newValue)
																}}
																placeholder="Base Price"
															/>
															<Input
																value={bedOption.currency}
																onChange={(e) => {
																	const newValue = [...field.value]
																	newValue[pIndex].bedOptions[bIndex].currency =
																		e.target.value
																	field.onChange(newValue)
																}}
																placeholder="Currency"
															/>
														</div>
													),
												)}
												<Button
													type="button"
													onClick={() => {
														const newValue = [...field.value]
														newValue[pIndex].bedOptions.push({
															bedType: 'SINGLE',
															maxOccupancy: 1,
															basePrice: 0,
															currency: '',
														})
														field.onChange(newValue)
													}}
												>
													Add Bed Option
												</Button>
											</div>
										))}
										<Button
											type="button"
											onClick={() => {
												field.onChange([
													...field.value,
													{
														name: '',
														minSeats: 0,
														maxSeats: 0,
														bedOptions: [],
													},
												])
											}}
										>
											Add Pricing Tier
										</Button>
									</div>
								)}
							/>
						</div>
						<Button type="button" onClick={() => removeAccommodation(index)}>
							Remove Accommodation
						</Button>
					</div>
				))}
				<Button
					type="button"
					onClick={() =>
						appendAccommodation({ name: '', description: '', pricingTiers: [] })
					}
					className="mt-2"
				>
					Add Accommodation
				</Button>
			</div>

			<div className="flex justify-between">
				<Button type="button" onClick={onPrev}>
					Previous
				</Button>
				<Button type="submit">Next</Button>
			</div>
		</form>
	)
}
