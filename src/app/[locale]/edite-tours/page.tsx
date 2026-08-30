'use client'
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Plus, Trash2, Star, HelpCircle, CheckSquare, Copy } from 'lucide-react'

const SUPPORTED_LANGUAGES = [
	{ code: 'en-US', name: 'English' },
	{ code: 'es-ES', name: 'Spanish' },
	{ code: 'fr-FR', name: 'French' },
	{ code: 'de-DE', name: 'German' },
	{ code: 'it-IT', name: 'Italian' },
]

interface FAQ {
	question: string
	answer: string
}

interface InclusionCategory {
	private: string[]
	shared: string[]
}

interface Inclusions {
	luxury: InclusionCategory
	standard: InclusionCategory
}

interface LanguageData {
	highlights: string[]
	faqs: FAQ[]
	inclusions: Inclusions
}

interface TourData {
	[language: string]: LanguageData
}

export default function TourEditor() {
	const [tourData, setTourData] = useState<TourData>({})
	const [currentLanguage, setCurrentLanguage] = useState('en-US')
	const [jsonInput, setJsonInput] = useState('')
	const [jsonError, setJsonError] = useState('')
	const [loading, setLoading] = useState(false)
	const [tourId, setTourId] = useState<string>('')

	useEffect(() => {
		initializeLanguages()
		// You can load the tour ID from URL params or context
		const urlParams = new URLSearchParams(window.location.search)
		const id = urlParams.get('id') || ''
		setTourId(id)
	}, [])

	useEffect(() => {
		updateJsonOutput()
	}, [tourData, currentLanguage])

	const initializeLanguages = () => {
		const initialData: TourData = {}
		SUPPORTED_LANGUAGES.forEach((lang) => {
			initialData[lang.code] = {
				highlights: [''],
				faqs: [{ question: '', answer: '' }],
				inclusions: {
					luxury: { private: [''], shared: [''] },
					standard: { private: [''], shared: [''] },
				},
			}
		})
		setTourData(initialData)
	}

	const updateJsonOutput = () => {
		if (tourData[currentLanguage]) {
			setJsonInput(JSON.stringify(tourData[currentLanguage], null, 2))
		}
	}

	const getCurrentData = () => {
		return (
			tourData[currentLanguage] || {
				highlights: [''],
				faqs: [{ question: '', answer: '' }],
				inclusions: {
					luxury: { private: [''], shared: [''] },
					standard: { private: [''], shared: [''] },
				},
			}
		)
	}

	const handleHighlightChange = (index: number, value: string) => {
		const currentData = getCurrentData()
		const newHighlights = [...currentData.highlights]
		newHighlights[index] = value

		setTourData((prev) => ({
			...prev,
			[currentLanguage]: {
				...currentData,
				highlights: newHighlights,
			},
		}))
	}

	const addHighlight = () => {
		const currentData = getCurrentData()
		setTourData((prev) => ({
			...prev,
			[currentLanguage]: {
				...currentData,
				highlights: [...currentData.highlights, ''],
			},
		}))
	}

	const removeHighlight = (index: number) => {
		const currentData = getCurrentData()
		if (currentData.highlights.length <= 1) return

		setTourData((prev) => ({
			...prev,
			[currentLanguage]: {
				...currentData,
				highlights: currentData.highlights.filter((_, i) => i !== index),
			},
		}))
	}

	const handleFAQChange = (index: number, field: keyof FAQ, value: string) => {
		const currentData = getCurrentData()
		const newFAQs = [...currentData.faqs]
		newFAQs[index] = { ...newFAQs[index], [field]: value }

		setTourData((prev) => ({
			...prev,
			[currentLanguage]: {
				...currentData,
				faqs: newFAQs,
			},
		}))
	}

	const addFAQ = () => {
		const currentData = getCurrentData()
		setTourData((prev) => ({
			...prev,
			[currentLanguage]: {
				...currentData,
				faqs: [...currentData.faqs, { question: '', answer: '' }],
			},
		}))
	}

	const removeFAQ = (index: number) => {
		const currentData = getCurrentData()
		if (currentData.faqs.length <= 1) return

		setTourData((prev) => ({
			...prev,
			[currentLanguage]: {
				...currentData,
				faqs: currentData.faqs.filter((_, i) => i !== index),
			},
		}))
	}

	const handleInclusionChange = (
		category: keyof Inclusions,
		type: keyof InclusionCategory,
		index: number,
		value: string,
	) => {
		const currentData = getCurrentData()
		const newInclusions = { ...currentData.inclusions }
		const newList = [...newInclusions[category][type]]
		newList[index] = value
		newInclusions[category][type] = newList

		setTourData((prev) => ({
			...prev,
			[currentLanguage]: {
				...currentData,
				inclusions: newInclusions,
			},
		}))
	}

	const addInclusion = (
		category: keyof Inclusions,
		type: keyof InclusionCategory,
	) => {
		const currentData = getCurrentData()
		const newInclusions = { ...currentData.inclusions }
		newInclusions[category][type] = [...newInclusions[category][type], '']

		setTourData((prev) => ({
			...prev,
			[currentLanguage]: {
				...currentData,
				inclusions: newInclusions,
			},
		}))
	}

	const removeInclusion = (
		category: keyof Inclusions,
		type: keyof InclusionCategory,
		index: number,
	) => {
		const currentData = getCurrentData()
		if (currentData.inclusions[category][type].length <= 1) return

		const newInclusions = { ...currentData.inclusions }
		newInclusions[category][type] = newInclusions[category][type].filter(
			(_, i) => i !== index,
		)

		setTourData((prev) => ({
			...prev,
			[currentLanguage]: {
				...currentData,
				inclusions: newInclusions,
			},
		}))
	}

	const handleJsonInputChange = (value: string) => {
		setJsonInput(value)
		setJsonError('')

		try {
			if (value.trim()) {
				const parsed = JSON.parse(value)

				// Validate the JSON structure
				if (
					typeof parsed === 'object' &&
					Array.isArray(parsed.highlights) &&
					Array.isArray(parsed.faqs) &&
					typeof parsed.inclusions === 'object' &&
					typeof parsed.inclusions.luxury === 'object' &&
					typeof parsed.inclusions.standard === 'object'
				) {
					setTourData((prev) => ({
						...prev,
						[currentLanguage]: parsed,
					}))
					toast({ title: 'JSON imported successfully!' })
				} else {
					setJsonError('Invalid JSON structure')
				}
			}
		} catch (error) {
			setJsonError('Invalid JSON format')
		}
	}

	const copyJsonToClipboard = () => {
		navigator.clipboard.writeText(jsonInput)
		toast({ title: 'JSON copied to clipboard!' })
	}

	const handleSave = async () => {
		if (!tourId) {
			toast({ title: 'Please provide a tour ID', variant: 'destructive' })
			return
		}

		setLoading(true)
		try {
			const response = await fetch('/api/tours/features', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					tourId,
					features: tourData,
				}),
			})

			if (response.ok) {
				toast({ title: 'Tour features saved successfully!' })
			} else {
				throw new Error('Failed to save')
			}
		} catch (error) {
			toast({ title: 'Error saving tour features', variant: 'destructive' })
		} finally {
			setLoading(false)
		}
	}

	const currentData = getCurrentData()

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Tour Features Editor</h1>
				<div className="flex gap-2">
					<Input
						placeholder="Tour ID"
						value={tourId}
						onChange={(e) => setTourId(e.target.value)}
						className="w-40"
					/>
					<select
						value={currentLanguage}
						onChange={(e) => setCurrentLanguage(e.target.value)}
						className="rounded-md border p-2"
					>
						{SUPPORTED_LANGUAGES.map((lang) => (
							<option key={lang.code} value={lang.code}>
								{lang.name}
							</option>
						))}
					</select>
					<Button onClick={handleSave} disabled={loading || !tourId}>
						{loading ? 'Saving...' : 'Save All Languages'}
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Left side - Input fields */}
				<div className="space-y-6">
					{/* Highlights Section */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Star className="h-5 w-5 text-yellow-500" />
								Tour Highlights ({currentLanguage})
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<Label>Add highlights that make your tour special</Label>
								<Button onClick={addHighlight} variant="outline" size="sm">
									<Plus className="mr-1 h-4 w-4" />
									Add Highlight
								</Button>
							</div>

							{currentData.highlights.map((highlight, index) => (
								<div key={index} className="flex items-center gap-2">
									<Star className="h-4 w-4 flex-shrink-0 text-yellow-500" />
									<Input
										value={highlight}
										onChange={(e) =>
											handleHighlightChange(index, e.target.value)
										}
										placeholder="Enter highlight..."
									/>
									<Button
										onClick={() => removeHighlight(index)}
										variant="destructive"
										size="icon"
										disabled={currentData.highlights.length <= 1}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
						</CardContent>
					</Card>

					{/* FAQs Section */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<HelpCircle className="h-5 w-5 text-blue-500" />
								Frequently Asked Questions ({currentLanguage})
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<Label>Add common questions and answers</Label>
								<Button onClick={addFAQ} variant="outline" size="sm">
									<Plus className="mr-1 h-4 w-4" />
									Add FAQ
								</Button>
							</div>

							{currentData.faqs.map((faq, index) => (
								<Card key={index} className="p-4">
									<div className="mb-4 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<HelpCircle className="h-4 w-4 text-blue-500" />
											<span className="font-medium">FAQ {index + 1}</span>
										</div>
										<Button
											onClick={() => removeFAQ(index)}
											variant="destructive"
											size="sm"
											disabled={currentData.faqs.length <= 1}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>

									<div className="space-y-4">
										<div className="space-y-2">
											<Label>Question</Label>
											<Input
												value={faq.question}
												onChange={(e) =>
													handleFAQChange(index, 'question', e.target.value)
												}
												placeholder="Enter question..."
											/>
										</div>

										<div className="space-y-2">
											<Label>Answer</Label>
											<Textarea
												value={faq.answer}
												onChange={(e) =>
													handleFAQChange(index, 'answer', e.target.value)
												}
												placeholder="Enter answer..."
												rows={3}
											/>
										</div>
									</div>
								</Card>
							))}
						</CardContent>
					</Card>

					{/* Inclusions Section */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CheckSquare className="h-5 w-5 text-green-500" />
								Tour Inclusions ({currentLanguage})
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<Label>What's included in your tour packages</Label>

							{(['luxury', 'standard'] as const).map((category) => (
								<Card key={category} className="p-4">
									<h4 className="mb-4 font-medium capitalize">
										{category} Package
									</h4>

									{(['private', 'shared'] as const).map((type) => (
										<div key={type} className="mb-4 last:mb-0">
											<div className="mb-2 flex items-center justify-between">
												<Label className="capitalize">{type} Inclusions</Label>
												<Button
													onClick={() => addInclusion(category, type)}
													variant="outline"
													size="sm"
												>
													<Plus className="mr-1 h-4 w-4" />
													Add
												</Button>
											</div>

											{currentData.inclusions[category][type].map(
												(inclusion, index) => (
													<div
														key={index}
														className="mb-2 flex items-center gap-2"
													>
														<CheckSquare className="h-4 w-4 flex-shrink-0 text-green-500" />
														<Input
															value={inclusion}
															onChange={(e) =>
																handleInclusionChange(
																	category,
																	type,
																	index,
																	e.target.value,
																)
															}
															placeholder={`Enter ${type} inclusion...`}
														/>
														<Button
															onClick={() =>
																removeInclusion(category, type, index)
															}
															variant="destructive"
															size="icon"
															disabled={
																currentData.inclusions[category][type].length <=
																1
															}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												),
											)}
										</div>
									))}
								</Card>
							))}
						</CardContent>
					</Card>
				</div>

				{/* Right side - JSON Editor */}
				<div className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								JSON Editor for {currentLanguage}
								<Button
									onClick={copyJsonToClipboard}
									variant="outline"
									size="sm"
								>
									<Copy className="mr-1 h-4 w-4" />
									Copy JSON
								</Button>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Label>Edit JSON for current language:</Label>
								<Textarea
									value={jsonInput}
									onChange={(e) => handleJsonInputChange(e.target.value)}
									placeholder="Paste or edit JSON here..."
									rows={20}
									className="font-mono text-sm"
								/>
								{jsonError && (
									<p className="text-sm text-red-500">{jsonError}</p>
								)}
							</div>

							<div className="text-muted-foreground mt-4 text-sm">
								<p>💡 Format for each language:</p>
								<pre className="bg-muted mt-2 rounded p-2 text-xs">
									{`{
  "highlights": ["Highlight 1", "Highlight 2"],
  "faqs": [
    {
      "question": "Question?",
      "answer": "Answer."
    }
  ],
  "inclusions": {
    "luxury": {
      "private": ["Inclusion 1"],
      "shared": ["Inclusion 2"]
    },
    "standard": {
      "private": ["Inclusion 1"],
      "shared": ["Inclusion 2"]
    }
  }
}`}
								</pre>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
