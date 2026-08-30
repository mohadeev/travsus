'use client'
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'

const SUPPORTED_LANGUAGES = [
	{ code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
	{ code: 'de-DE', name: 'German (Germany)', flag: '🇩🇪' },
	{ code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
	{ code: 'fr-FR', name: 'French (France)', flag: '🇫🇷' },
	{ code: 'it-IT', name: 'Italian (Italy)', flag: '🇮🇹' },
    
	{ code: 'ja-JP', name: 'Japanese (Japan)', flag: '🇯🇵' },
	{ code: 'ko-KR', name: 'Korean (Korea)', flag: '🇰🇷' },
	{ code: 'pt-PT', name: 'Portuguese (Portugal)', flag: '🇵🇹' },
	{ code: 'ru-RU', name: 'Russian (Russia)', flag: '🇷🇺' },
	{ code: 'zh-CN', name: 'Chinese (China)', flag: '🇨🇳' },
]

interface DayTranslation {
	name: string
	description: string
}

interface TourTranslation {
	name: string
	subtitle: string
	overview: string
	conclusion: string
	days: DayTranslation[]
}

interface TourTranslations {
	[language: string]: TourTranslation
}

export default function ToursPage() {
	const [activeTab, setActiveTab] = useState('edit')
	const [selectedLanguage, setSelectedLanguage] = useState('en-US')
	const [translations, setTranslations] = useState<TourTranslations>({
		'en-US': { name: '', subtitle: '', overview: '', conclusion: '', days: [] },
	})
	const [loading, setLoading] = useState(false)
	const [existingTours, setExistingTours] = useState<any[]>([])
	const [selectedTourId, setSelectedTourId] = useState<string | null>(null)
	const [jsonInput, setJsonInput] = useState('')
	const [jsonError, setJsonError] = useState('')

	useEffect(() => {
		loadExistingTours()
	}, [])

	useEffect(() => {
		setJsonInput(
			JSON.stringify(
				translations[selectedLanguage] || {
					name: '',
					subtitle: '',
					overview: '',
					conclusion: '',
					days: [],
				},
				null,
				2,
			),
		)
	}, [translations, selectedLanguage])

	const loadTourTranslations = async (id: string) => {
		setLoading(true)
		try {
			const response = await fetch(`/api/tours/${id}/translations`)
			if (response.ok) {
				const data = await response.json()

				const formattedTranslations: TourTranslations = {}

				// Process available languages and their translations
				if (data.availableLanguages && data.availableLanguages.length > 0) {
					data.availableLanguages.forEach((lang: string) => {
						formattedTranslations[lang] = {
							name: data.translations?.[lang]?.name || '',
							subtitle: data.translations?.[lang]?.subtitle || '',
							overview: data.translations?.[lang]?.overview || '',
							conclusion: data.translations?.[lang]?.conclusion || '',
							days: data.translations?.[lang]?.days || [],
						}
					})
				}

				// Ensure en-US exists as fallback
				if (!formattedTranslations['en-US']) {
					formattedTranslations['en-US'] = {
						name: data.tour?.name || '',
						subtitle: data.tour?.subtitle || '',
						overview: data.tour?.overview || '',
						conclusion: data.tour?.conclusion || '',
						days:
							data.tour?.days?.map((day: any) => ({
								name: day.name || '',
								description: day.description || '',
							})) || [],
					}
				}

				setTranslations(formattedTranslations)
				setSelectedTourId(id)

				// Set the first available language as selected
				if (data.availableLanguages && data.availableLanguages.length > 0) {
					setSelectedLanguage(data.availableLanguages[0])
				}
			}
		} catch (error) {
			toast({ title: 'Error loading translations', variant: 'destructive' })
		} finally {
			setLoading(false)
		}
	}

	const loadExistingTours = async () => {
		try {
			const response = await fetch('/api/tours')
			if (response.ok) {
				const data = await response.json()
				setExistingTours(data.tours || [])
			}
		} catch (error) {
			console.error('Error loading tours:', error)
		}
	}

	const handleLanguageChange = (language: string) => {
		setSelectedLanguage(language)
		if (!translations[language]) {
			setTranslations((prev) => ({
				...prev,
				[language]: {
					name: '',
					subtitle: '',
					overview: '',
					conclusion: '',
					days: prev['en-US']?.days || [],
				},
			}))
		}
	}

	const handleFieldChange = (field: keyof TourTranslation, value: string) => {
		setTranslations((prev) => ({
			...prev,
			[selectedLanguage]: {
				...prev[selectedLanguage],
				[field]: value,
			},
		}))
	}

	const handleDayChange = (
		dayIndex: number,
		field: keyof DayTranslation,
		value: string,
	) => {
		setTranslations((prev) => {
			const currentDays = [...(prev[selectedLanguage]?.days || [])]
			if (!currentDays[dayIndex]) {
				currentDays[dayIndex] = { name: '', description: '' }
			}
			currentDays[dayIndex] = { ...currentDays[dayIndex], [field]: value }

			return {
				...prev,
				[selectedLanguage]: {
					...prev[selectedLanguage],
					days: currentDays,
				},
			}
		})
	}

	const addDay = () => {
		setTranslations((prev) => ({
			...prev,
			[selectedLanguage]: {
				...prev[selectedLanguage],
				days: [
					...(prev[selectedLanguage]?.days || []),
					{ name: '', description: '' },
				],
			},
		}))
	}

	const removeDay = (dayIndex: number) => {
		setTranslations((prev) => ({
			...prev,
			[selectedLanguage]: {
				...prev[selectedLanguage],
				days:
					prev[selectedLanguage]?.days?.filter(
						(_, index) => index !== dayIndex,
					) || [],
			},
		}))
	}

	const handleJsonChange = (value: string) => {
		setJsonInput(value)
		setJsonError('')

		try {
			const parsed = JSON.parse(value)

			if (typeof parsed === 'object' && parsed !== null) {
				const isMultipleLanguages = Object.keys(parsed).some((key) =>
					SUPPORTED_LANGUAGES.some((lang) => lang.code === key),
				)

				if (isMultipleLanguages) {
					// Multiple languages detected - update all languages
					const validTranslations: TourTranslations = {}

					for (const [langCode, translation] of Object.entries(parsed)) {
						if (
							SUPPORTED_LANGUAGES.some((lang) => lang.code === langCode) &&
							typeof translation === 'object' &&
							translation !== null
						) {
							const trans = translation as any
							if (
								typeof trans.name === 'string' &&
								typeof trans.subtitle === 'string' &&
								typeof trans.overview === 'string' &&
								typeof trans.conclusion === 'string' &&
								Array.isArray(trans.days)
							) {
								validTranslations[langCode] = trans
							}
						}
					}

					if (Object.keys(validTranslations).length > 0) {
						setTranslations((prev) => ({
							...prev,
							...validTranslations,
						}))
						toast({
							title: `Multiple languages imported successfully! (${Object.keys(validTranslations).length} languages)`,
						})
					} else {
						setJsonError('No valid language translations found')
					}
				} else {
					// Single language object - update current language only
					const isValidTranslation =
						typeof parsed.name === 'string' &&
						typeof parsed.subtitle === 'string' &&
						typeof parsed.overview === 'string' &&
						typeof parsed.conclusion === 'string' &&
						Array.isArray(parsed.days)

					if (isValidTranslation) {
						setTranslations((prev) => ({
							...prev,
							[selectedLanguage]: parsed,
						}))
						toast({ title: 'Single language imported successfully!' })
					} else {
						setJsonError('Invalid translation structure')
					}
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
		setLoading(true)
		try {
			const endpoint = selectedTourId
				? `/api/tours/${selectedTourId}/translations`
				: '/api/tours/create-multilingual'

			const response = await fetch(endpoint, {
				method: selectedTourId ? 'PUT' : 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					translations,
					defaultLanguage: 'en-US',
					creatorId: 'user-id', // Replace with actual user ID
				}),
			})

			if (response.ok) {
				toast({ title: 'Translations saved successfully!' })
				if (!selectedTourId) {
					const data = await response.json()
					setSelectedTourId(data.tour.id)
				}
				loadExistingTours()
			} else {
				throw new Error('Failed to save')
			}
		} catch (error) {
			toast({ title: 'Error saving translations', variant: 'destructive' })
		} finally {
			setLoading(false)
		}
	}

	const handleNewTour = () => {
		setSelectedTourId(null)
		setTranslations({
			'en-US': {
				name: '',
				subtitle: '',
				overview: '',
				conclusion: '',
				days: [],
			},
		})
		setSelectedLanguage('en-US')
	}

	const currentTranslation = translations[selectedLanguage] || {
		name: '',
		subtitle: '',
		overview: '',
		conclusion: '',
		days: [],
	}

	return (
		<div className="container mx-auto p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-3xl font-bold">Tour Translation Manager</h1>
				<Button onClick={handleNewTour} variant="outline">
					Create New Tour
				</Button>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="edit">Edit Translations</TabsTrigger>
					<TabsTrigger value="preview">Preview</TabsTrigger>
					<TabsTrigger value="manage">Manage Tours</TabsTrigger>
				</TabsList>

				<TabsContent value="edit" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								{selectedTourId ? 'Edit Tour Translations' : 'Create New Tour'}
								<div className="flex gap-2">
									{Object.keys(translations).map((lang) => {
										const langInfo = SUPPORTED_LANGUAGES.find(
											(l) => l.code === lang,
										)
										return (
											<Badge
												key={lang}
												variant={
													lang === selectedLanguage ? 'default' : 'secondary'
												}
												className="cursor-pointer"
												onClick={() => handleLanguageChange(lang)}
											>
												{langInfo?.flag} {langInfo?.name || lang}
											</Badge>
										)
									})}
								</div>
							</CardTitle>

							<div className="flex items-center gap-4">
								<Label htmlFor="language-select">Add Language:</Label>
								<Select
									value={selectedLanguage}
									onValueChange={handleLanguageChange}
								>
									<SelectTrigger className="w-64">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{SUPPORTED_LANGUAGES.map((lang) => (
											<SelectItem key={lang.code} value={lang.code}>
												{lang.flag} {lang.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</CardHeader>

						<CardContent>
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
								{/* Left side - Input fields */}
								<div className="space-y-6">
									<h3 className="text-lg font-semibold">Translation Inputs</h3>

									<div className="grid grid-cols-1 gap-4">
										<div className="space-y-2">
											<Label htmlFor="name">Tour Name</Label>
											<Input
												id="name"
												value={currentTranslation.name}
												onChange={(e) =>
													handleFieldChange('name', e.target.value)
												}
												placeholder="Enter tour name..."
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="subtitle">Subtitle</Label>
											<Input
												id="subtitle"
												value={currentTranslation.subtitle}
												onChange={(e) =>
													handleFieldChange('subtitle', e.target.value)
												}
												placeholder="Enter tour subtitle..."
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="overview">Overview</Label>
										<Textarea
											id="overview"
											value={currentTranslation.overview}
											onChange={(e) =>
												handleFieldChange('overview', e.target.value)
											}
											placeholder="Enter tour overview..."
											rows={4}
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="conclusion">Conclusion</Label>
										<Textarea
											id="conclusion"
											value={currentTranslation.conclusion}
											onChange={(e) =>
												handleFieldChange('conclusion', e.target.value)
											}
											placeholder="Enter tour conclusion..."
											rows={3}
										/>
									</div>

									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<Label className="text-lg font-semibold">Tour Days</Label>
											<Button
												type="button"
												onClick={addDay}
												variant="outline"
												size="sm"
											>
												Add Day
											</Button>
										</div>

										{currentTranslation.days?.map((day, index) => (
											<Card key={index} className="p-4">
												<div className="mb-4 flex items-center justify-between">
													<h4 className="font-medium">Day {index + 1}</h4>
													<Button
														type="button"
														onClick={() => removeDay(index)}
														variant="destructive"
														size="sm"
													>
														Remove
													</Button>
												</div>

												<div className="space-y-4">
													<div className="space-y-2">
														<Label htmlFor={`day-${index}-name`}>
															Day Name
														</Label>
														<Input
															id={`day-${index}-name`}
															value={day.name}
															onChange={(e) =>
																handleDayChange(index, 'name', e.target.value)
															}
															placeholder="Enter day name..."
														/>
													</div>

													<div className="space-y-2">
														<Label htmlFor={`day-${index}-description`}>
															Day Description
														</Label>
														<Textarea
															id={`day-${index}-description`}
															value={day.description}
															onChange={(e) =>
																handleDayChange(
																	index,
																	'description',
																	e.target.value,
																)
															}
															placeholder="Enter day description..."
															rows={3}
														/>
													</div>
												</div>
											</Card>
										))}

										{currentTranslation.days?.length === 0 && (
											<div className="text-muted-foreground py-8 text-center">
												No days added yet. Click "Add Day" to create your first
												day.
											</div>
										)}
									</div>
								</div>

								{/* Right side - JSON Editor */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-semibold">JSON Editor</h3>
										<Button
											onClick={copyJsonToClipboard}
											variant="outline"
											size="sm"
										>
											Copy JSON
										</Button>
									</div>

									<div className="space-y-2">
										<Label htmlFor="json-editor">
											Paste JSON translations here:
										</Label>
										<Textarea
											id="json-editor"
											value={jsonInput}
											onChange={(e) => handleJsonChange(e.target.value)}
											placeholder="Paste your JSON translations here..."
											rows={25}
											className="font-mono text-sm"
										/>
										{jsonError && (
											<p className="text-sm text-red-500">{jsonError}</p>
										)}
									</div>

									<div className="text-muted-foreground text-sm">
										<p>💡 Tips:</p>
										<ul className="mt-2 list-inside list-disc space-y-1">
											<li>Paste valid JSON to auto-populate all inputs</li>
											<li>Copy the current JSON to backup your work</li>
											<li>Edit JSON directly for bulk changes</li>
										</ul>
									</div>
								</div>
							</div>

							<div className="mt-6 flex gap-2">
								<Button
									onClick={handleSave}
									disabled={loading}
									className="flex-1"
								>
									{loading
										? 'Saving...'
										: selectedTourId
											? 'Update Translations'
											: 'Create Tour'}
								</Button>
								<Button
									variant="outline"
									onClick={handleNewTour}
									disabled={loading}
								>
									Reset
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="preview" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>
								Preview -{' '}
								{
									SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)
										?.name
								}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h1 className="text-3xl font-bold">
									{currentTranslation?.name || 'Tour Name'}
								</h1>
								<p className="text-muted-foreground mt-2 text-xl">
									{currentTranslation?.subtitle || 'Tour Subtitle'}
								</p>
							</div>

							<div>
								<h2 className="mb-2 text-lg font-semibold">Overview</h2>
								<p className="text-muted-foreground">
									{currentTranslation?.overview ||
										'Tour overview will appear here...'}
								</p>
							</div>

							<div>
								<h2 className="mb-2 text-lg font-semibold">Conclusion</h2>
								<p className="text-muted-foreground">
									{currentTranslation?.conclusion ||
										'Tour conclusion will appear here...'}
								</p>
							</div>

							{currentTranslation.days &&
								currentTranslation.days.length > 0 && (
									<div>
										<h2 className="mb-4 text-lg font-semibold">Itinerary</h2>
										<div className="space-y-4">
											{currentTranslation.days.map((day, index) => (
												<div
													key={index}
													className="border-l-4 border-primary pl-4"
												>
													<h3 className="font-semibold">
														Day {index + 1}: {day.name || 'Day Name'}
													</h3>
													<p className="text-muted-foreground mt-1">
														{day.description ||
															'Day description will appear here...'}
													</p>
												</div>
											))}
										</div>
									</div>
								)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="manage" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Existing Tours</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4">
								{existingTours.length === 0 ? (
									<p className="text-muted-foreground">
										No tours found. Create your first multilingual tour!
									</p>
								) : (
									existingTours.map((tour) => (
										<div
											key={tour.id}
											className="flex items-center justify-between rounded-lg border p-4"
										>
											<div>
												<h3 className="font-semibold">{tour.name}</h3>
												<p className="text-muted-foreground text-sm">
													{tour.subtitle}
												</p>
												<div className="mt-2 flex gap-1">
													{tour.availableLanguages.map((lang: string) => {
														const langInfo = SUPPORTED_LANGUAGES.find(
															(l) => l.code === lang,
														)
														return (
															<Badge
																key={lang}
																variant="secondary"
																className="text-xs"
															>
																{langInfo?.flag}
															</Badge>
														)
													})}
												</div>
											</div>
											<Button
												variant="outline"
												onClick={() => loadTourTranslations(tour.id)}
											>
												Edit Translations
											</Button>
										</div>
									))
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
