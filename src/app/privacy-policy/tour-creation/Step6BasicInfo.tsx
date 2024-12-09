import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
// import { updateTourField } from '../../store/tourSlice'
import { RootState } from '@/app/GlobalRedux/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Textarea from '@/shared/Textarea'

export function Step6AdditionalDetails({
	onSubmit,
	onPrev,
}: {
	onSubmit: () => void
	onPrev: () => void
}) {
	const tour = useSelector((state: RootState) => state.tour)
	const dispatch = useDispatch()
	const { control, handleSubmit } = useForm({
		defaultValues: {
			lang: tour.lang,
			tourfor: tour.tourfor,
			conclusion: tour.conclusion,
			tags: tour.tags.join(', '),
			keyphrase: tour.keyphrase.join(', '),
		},
	})

	const onFormSubmit = (data: any) => {
		const updatedData = {
			...data,
			tags: data.tags.split(',').map((tag: string) => tag.trim()),
			keyphrase: data.keyphrase
				.split(',')
				.map((phrase: string) => phrase.trim()),
		}
		dispatch(updateTourField(updatedData))
		onSubmit()
	}

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
			<div>
				<Label htmlFor="lang">Language</Label>
				<Controller
					name="lang"
					control={control}
					render={({ field }) => (
						<Input {...field} id="lang" placeholder="Tour language" />
					)}
				/>
			</div>

			<div>
				<Label htmlFor="tourfor">Tour For</Label>
				<Controller
					name="tourfor"
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							id="tourfor"
							placeholder="Who is this tour for?"
						/>
					)}
				/>
			</div>

			<div>
				<Label htmlFor="conclusion">Conclusion</Label>
				<Controller
					name="conclusion"
					control={control}
					render={({ field }) => (
						<Textarea
							{...field}
							id="conclusion"
							placeholder="Tour conclusion"
						/>
					)}
				/>
			</div>

			<div>
				<Label htmlFor="tags">Tags</Label>
				<Controller
					name="tags"
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							id="tags"
							placeholder="Enter tags separated by commas"
						/>
					)}
				/>
			</div>

			<div>
				<Label htmlFor="keyphrase">Key Phrases</Label>
				<Controller
					name="keyphrase"
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							id="keyphrase"
							placeholder="Enter key phrases separated by commas"
						/>
					)}
				/>
			</div>

			<div className="flex justify-between">
				<Button type="button" onClick={onPrev}>
					Previous
				</Button>
				<Button type="submit">Submit Tour</Button>
			</div>
		</form>
	)
}
