import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateTourField } from '../../store/tourSlice'
import { RootState } from '@/app/GlobalRedux/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function Step2ImagesAndPeople({
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
			images: tour.images,
			people: tour.people,
		},
	})

	const {
		fields: imageFields,
		append: appendImage,
		remove: removeImage,
	} = useFieldArray({
		control,
		name: 'images',
	})

	const {
		fields: peopleFields,
		append: appendPerson,
		remove: removePerson,
	} = useFieldArray({
		control,
		name: 'people',
	})

	const onSubmit = (data: any) => {
		dispatch(updateTourField(data))
		onNext()
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div>
				<Label>Images</Label>
				{imageFields.map((field, index) => (
					<div key={field.id} className="mt-2 flex items-center space-x-2">
						<Controller
							name={`images.${index}.url`}
							control={control}
							render={({ field }) => (
								<Input {...field} placeholder="Image URL" />
							)}
						/>
						<Controller
							name={`images.${index}.public_id`}
							control={control}
							render={({ field }) => (
								<Input {...field} placeholder="Public ID" />
							)}
						/>
						<Button type="button" onClick={() => removeImage(index)}>
							Remove
						</Button>
					</div>
				))}
				<Button
					type="button"
					onClick={() => appendImage({ url: '', public_id: '' })}
					className="mt-2"
				>
					Add Image
				</Button>
			</div>

			<div>
				<Label>People</Label>
				{peopleFields.map((field, index) => (
					<div key={field.id} className="mt-2 flex items-center space-x-2">
						<Controller
							name={`people.${index}.name`}
							control={control}
							render={({ field }) => <Input {...field} placeholder="Name" />}
						/>
						<Controller
							name={`people.${index}.role`}
							control={control}
							render={({ field }) => <Input {...field} placeholder="Role" />}
						/>
						<Button type="button" onClick={() => removePerson(index)}>
							Remove
						</Button>
					</div>
				))}
				<Button
					type="button"
					onClick={() => appendPerson({ name: '', role: '' })}
					className="mt-2"
				>
					Add Person
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
