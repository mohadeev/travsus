'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { submitReport } from '@/app/actions/submitReport'
import Textarea from '@/shared/Textarea'

export function WhistleblowerChannel() {
	const [loading, setLoading] = useState(false)
	const [result, setResult] = useState<{
		success?: boolean
		error?: string
		id?: string
	} | null>(null)

	async function handleSubmit(formData: FormData) {
		setLoading(true)
		setResult(null)

		try {
			const response = await submitReport(formData)
			setResult(response)
		} catch (error) {
			setResult({ error: 'An unexpected error occurred. Please try again.' })
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 py-10">
			<Card className="mx-auto max-w-2xl overflow-hidden border-0 bg-white/60 shadow-lg backdrop-blur-sm">
				<CardHeader className="space-y-1 pb-6 text-center">
					<CardTitle className="text-3xl font-bold tracking-tight">
						Whistleblower Channel
					</CardTitle>
					<p className="text-sm text-gray-600">
						Report concerns safely and anonymously. We ensure your privacy.
					</p>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault()
							handleSubmit(new FormData(e.currentTarget))
						}}
						className="space-y-4"
					>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="title" className="text-sm font-medium">
									Report Title
								</Label>
								<Input
									type="text"
									id="title"
									name="title"
									placeholder="Brief title"
									required
									disabled={loading}
									className="w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="category" className="text-sm font-medium">
									Category
								</Label>
								<Select name="category" required disabled={loading}>
									<SelectTrigger className="w-full border-gray-200 bg-white text-sm">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent className="bg-white">
										<SelectItem value="financial">
											Financial Misconduct
										</SelectItem>
										<SelectItem value="ethical">Ethical Violation</SelectItem>
										<SelectItem value="harassment">Harassment</SelectItem>
										<SelectItem value="safety">Safety Concerns</SelectItem>
										<SelectItem value="other">Other</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description" className="text-sm font-medium">
								Description
							</Label>
							<Textarea
								id="description"
								name="description"
								rows={4}
								placeholder="Describe your concern in detail..."
								required
								disabled={loading}
								className="w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
							/>
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="urgencyLevel" className="text-sm font-medium">
									Urgency Level
								</Label>
								<Select name="urgencyLevel" required disabled={loading}>
									<SelectTrigger className="w-full border-gray-200 bg-white text-sm">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent className="bg-white">
										<SelectItem value="low">Low</SelectItem>
										<SelectItem value="medium">Medium</SelectItem>
										<SelectItem value="high">High</SelectItem>
										<SelectItem value="critical">Critical</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="dateOfIncident" className="text-sm font-medium">
									Date of Incident
								</Label>
								<Input
									type="date"
									id="dateOfIncident"
									name="dateOfIncident"
									disabled={loading}
									className="w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="involvedParties" className="text-sm font-medium">
								Involved Parties (Optional)
							</Label>
							<Input
								type="text"
								id="involvedParties"
								name="involvedParties"
								placeholder="Names or positions"
								disabled={loading}
								className="w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="additionalInfo" className="text-sm font-medium">
								Additional Information (Optional)
							</Label>
							<Textarea
								id="additionalInfo"
								name="additionalInfo"
								rows={2}
								placeholder="Any other relevant information..."
								disabled={loading}
								className="w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
							/>
						</div>
						<Button
							type="submit"
							disabled={loading}
							loading={loading}
							className="w-full bg-black text-sm text-white hover:bg-gray-800"
						>
							{loading ? (
								<>
									<span className="mr-2">Submitting...</span>
									<span className="animate-spin">⏳</span>
								</>
							) : (
								'Submit Report'
							)}
						</Button>
					</form>
					{result && (
						<div
							className={`mt-4 rounded-md p-3 text-sm ${
								result.success
									? 'bg-green-100 text-green-700'
									: 'bg-red-100 text-red-700'
							}`}
						>
							{result.success
								? `Report submitted successfully. ID: ${result.id}`
								: result.error}
						</div>
					)}
					<div className="mt-6 flex flex-wrap justify-center gap-3">
						{['Secure', 'Anonymous', 'Confidential'].map((label) => (
							<Badge
								key={label}
								variant="secondary"
								className="px-2 py-1 text-xs"
							>
								{label}
							</Badge>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
