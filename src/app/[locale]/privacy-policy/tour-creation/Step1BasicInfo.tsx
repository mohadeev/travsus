import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateTourField } from '../../store/tourSlice'
import { RootState } from '@/app/GlobalRedux/store'
import { Input } from '@/components/ui/input'
import Textarea from '@/shared/Textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function Step1BasicInfo({ onNext }: { onNext: () => void }) {
	const tour = useSelector((state: RootState) => state.tour)
	const dispatch = useDispatch()
	const { control, handleSubmit } = useForm({
		defaultValues: {
			name: tour.name,
			subtitle: tour.subtitle,
			overview: tour.overview,
			productCategory: tour.productCategory,
		},
	})

	const onSubmit = (data: any) => {
		dispatch(updateTourField(data))
		onNext()
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div>
				<Label htmlFor="name">Tour Name</Label>
				<Controller
					name="name"
					control={control}
					rules={{ required: 'Tour name is required' }}
					render={({ field, fieldState: { error } }) => (
						<>
							<Input {...field} id="name" placeholder="Enter tour name" />
							{error && <p className="text-sm text-red-500">{error.message}</p>}
						</>
					)}
				/>
			</div>

			<div>
				<Label htmlFor="subtitle">Subtitle</Label>
				<Controller
					name="subtitle"
					control={control}
					render={({ field }) => (
						<Input {...field} id="subtitle" placeholder="Enter subtitle" />
					)}
				/>
			</div>

			<div>
				<Label htmlFor="overview">Overview</Label>
				<Controller
					name="overview"
					control={control}
					render={({ field }) => (
						<Textarea
							{...field}
							id="overview"
							placeholder="Enter tour overview"
						/>
					)}
				/>
			</div>

			<div>
				<Label htmlFor="productCategory">Product Category</Label>
				<Controller
					name="productCategory"
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							id="productCategory"
							placeholder="Enter product category"
						/>
					)}
				/>
			</div>

			<Button type="submit">Next</Button>
		</form>
	)
}
