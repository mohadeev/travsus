import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateTourField } from '../../store/tourSlice'
import { RootState } from '@/app/GlobalRedux/store'
import { Input } from '@/components/ui/input'
import Textarea from '@/shared/Textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function Step3ServicesAndPlaces({
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
			services: tour.services,
			places: tour.places,
		},
	})

	const {
		fields: serviceFields,
		append: appendService,
		remove: removeService,
	} = useFieldArray({
		control,
		name: 'services',
	})

	const {
		fields: placeFields,
		append: appendPlace,
		remove: removePlace,
	} = useFieldArray({
		control,
		name: 'places',
	})

	const onSubmit = (data: any) => {
		dispatch(updateTourField(data))
		onNext()
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div>
				<Label>Services</Label>
				{serviceFields.map((field, index) => (
					<div key={field.id} className="mt-2 space-y-2">
						<Controller
							name={`services.${index}.name`}
							control={control}
							render={({ field }) => (
								<Input {...field} placeholder="Service Name" />
							)}
						/>
						<Controller
							name={`services.${index}.description`}
							control={control}
							render={({ field }) => (
								<Textarea {...field} placeholder="Service Description" />
							)}
						/>
						<Button type="button" onClick={() => removeService(index)}>
							Remove Service
						</Button>
					</div>
				))}
				<Button
					type="button"
					onClick={() => appendService({ name: '', description: '' })}
					className="mt-2"
				>
					Add Service
				</Button>
			</div>

			<div>
				<Label>Places</Label>
				{placeFields.map((field, index) => (
					<div key={field.id} className="mt-2 space-y-2">
						<Controller
							name={`places.${index}.name`}
							control={control}
							render={({ field }) => (
								<Input {...field} placeholder="Place Name" />
							)}
						/>
						<Controller
							name={`places.${index}.description`}
							control={control}
							render={({ field }) => (
								<Textarea {...field} placeholder="Place Description" />
							)}
						/>
						<Button type="button" onClick={() => removePlace(index)}>
							Remove Place
						</Button>
					</div>
				))}
				<Button
					type="button"
					onClick={() => appendPlace({ name: '', description: '' })}
					className="mt-2"
				>
					Add Place
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
