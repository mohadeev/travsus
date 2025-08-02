import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateTourField } from '../../store/tourSlice'
import { RootState } from '@/app/GlobalRedux/store'
import { Input } from '@/components/ui/input'
import Textarea from '@/shared/Textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function Step4HighlightsAndItinerary({
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
			highlights: tour.highlights,
			days: tour.days,
		},
	})

	const {
		fields: highlightFields,
		append: appendHighlight,
		remove: removeHighlight,
	} = useFieldArray({
		control,
		name: 'highlights',
	})

	const {
		fields: dayFields,
		append: appendDay,
		remove: removeDay,
	} = useFieldArray({
		control,
		name: 'days',
	})

	const onSubmit = (data: any) => {
		dispatch(updateTourField(data))
		onNext()
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div>
				<Label>Highlights</Label>
				{highlightFields.map((field, index) => (
					<div key={field.id} className="mt-2 flex items-center space-x-2">
						<Controller
							name={`highlights.${index}`}
							control={control}
							render={({ field }) => (
								<Input {...field} placeholder="Tour Highlight" />
							)}
						/>
						<Button type="button" onClick={() => removeHighlight(index)}>
							Remove
						</Button>
					</div>
				))}
				<Button
					type="button"
					onClick={() => appendHighlight('')}
					className="mt-2"
				>
					Add Highlight
				</Button>
			</div>

			<div>
				<Label>Itinerary</Label>
				{dayFields.map((field, index) => (
					<div key={field.id} className="mt-2 space-y-2">
						<Controller
							name={`days.${index}.title`}
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									placeholder="
Day Title"
								/>
							)}
						/>
						<Controller
							name={`days.${index}.description`}
							control={control}
							render={({ field }) => (
								<Textarea {...field} placeholder="Day Description" />
							)}
						/>
						<Button type="button" onClick={() => removeDay(index)}>
							Remove Day
						</Button>
					</div>
				))}
				<Button
					type="button"
					onClick={() => appendDay({ title: '', description: '' })}
					className="mt-2"
				>
					Add Day
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
