export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const SUPPORTED_LANGUAGES = [
	'en-US',
	'de-DE',
	'es-ES',
	'fr-FR',
	'it-IT',
	'ja-JP',
	'ko-KR',
	'pt-PT',
	'ru-RU',
	'zh-CN',
]

export default function CountriesPage() {
	const [countries, setCountries] = useState<any[]>([])
	const [cities, setCities] = useState<any[]>([])
	const [selectedCountry, setSelectedCountry] = useState<any>(null)
	const [selectedCity, setSelectedCity] = useState<any>(null)
	const [loading, setLoading] = useState(false)
	const [saving, setSaving] = useState(false)
	const [jsonInput, setJsonInput] = useState('')

	const createDefaultJson = () => {
		const defaultJson: any = {}
		SUPPORTED_LANGUAGES.forEach((lang) => {
			defaultJson[lang] = {
				name: '',
				description: '',
			}
		})
		return JSON.stringify(defaultJson, null, 2)
	}

	const loadCountries = async () => {
		setLoading(true)
		try {
			const response = await fetch('/api/places')
			const data = await response.json()

			if (data.success) {
				setCountries(data.data || [])
			}
		} catch (error) {
			console.error('Error loading countries:', error)
			toast({
				title: 'Error',
				description: 'Failed to load countries',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	const loadCities = async (countryId: string) => {
		setLoading(true)
		try {
			const response = await fetch(`/api/places?countryId=${countryId}`)
			const data = await response.json()

			if (data.success) {
				setCities(data.data || [])
			}
		} catch (error) {
			console.error('Error loading cities:', error)
			toast({
				title: 'Error',
				description: 'Failed to load cities',
				variant: 'destructive',
			})
		} finally {
			setLoading(false)
		}
	}

	const loadExistingTranslations = async (
		entityId: string,
		entityType: string,
	) => {
		try {
			const response = await fetch(
				`/api/places/${entityId}/translations?type=${entityType}`,
			)
			const data = await response.json()

			if (data.success && data.translations) {
				const defaultJson: any = {}
				SUPPORTED_LANGUAGES.forEach((lang) => {
					defaultJson[lang] = {
						name: '',
						description: '',
					}
				})

				Object.keys(data.translations).forEach((lang) => {
					if (SUPPORTED_LANGUAGES.includes(lang)) {
						const langData = data.translations[lang]
						if (langData) {
							defaultJson[lang] = {
								name: langData.name || '',
								description: langData.description || '',
							}
						}
					}
				})

				return JSON.stringify(defaultJson, null, 2)
			}
		} catch (error) {
			console.error('Error loading existing translations:', error)
		}

		return createDefaultJson()
	}

	const handleCountryClick = async (country: any) => {
		setSelectedCountry(country)
		setSelectedCity(null)

		const existingJson = await loadExistingTranslations(country.id, 'country')
		setJsonInput(existingJson)

		loadCities(country.id)
	}

	const handleCityClick = async (city: any) => {
		setSelectedCity(city)

		const existingJson = await loadExistingTranslations(city.id, 'city')
		setJsonInput(existingJson)
	}

	const saveTranslations = async () => {
		if (!selectedCountry && !selectedCity) return

		try {
			const translations = JSON.parse(jsonInput)
			setSaving(true)

			const entityType = selectedCity ? 'city' : 'country'
			const entityId = selectedCity ? selectedCity.id : selectedCountry.id

			const response = await fetch(
				`/api/places/${entityId}/translations?type=${entityType}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ translations }),
				},
			)

			const data = await response.json()

			if (data.success) {
				toast({
					title: 'Success',
					description: 'Translations saved successfully',
				})
			} else {
				throw new Error(data.message)
			}
		} catch (error) {
			console.error('Error saving translations:', error)
			toast({
				title: 'Error',
				description: 'Failed to save translations',
				variant: 'destructive',
			})
		} finally {
			setSaving(false)
		}
	}

	const goBack = () => {
		if (selectedCity) {
			setSelectedCity(null)
			if (selectedCountry) {
				loadExistingTranslations(selectedCountry.id, 'country').then(
					setJsonInput,
				)
			}
		} else {
			setSelectedCountry(null)
			setCities([])
			setJsonInput('')
		}
	}

	useEffect(() => {
		loadCountries()
	}, [])

	return (
		<div className="container mx-auto py-8">
			<div className="mb-8">
				<div className="mb-4 flex items-center gap-4">
					{(selectedCountry || selectedCity) && (
						<Button variant="outline" onClick={goBack}>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back
						</Button>
					)}
					<h1 className="text-3xl font-bold">
						{selectedCity
							? `Cities in ${selectedCountry.name}`
							: selectedCountry
								? `${selectedCountry.name} - Cities`
								: 'Countries'}
					</h1>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>
							{selectedCountry
								? `Cities in ${selectedCountry.name} (${cities.length})`
								: `All Countries (${countries.length})`}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-6 w-6 animate-spin" />
							</div>
						) : (
							<div className="grid grid-cols-1 gap-4">
								{selectedCountry
									? cities.map((city) => (
											<div
												key={city.id}
												className="hover:bg-muted cursor-pointer rounded-lg border p-4 transition-colors"
												onClick={() => handleCityClick(city)}
											>
												<div className="text-lg font-medium">{city.name}</div>
												<Badge variant="outline">
													{city.code || 'No Code'}
												</Badge>
											</div>
										))
									: countries.map((country) => (
											<div
												key={country.id}
												className="hover:bg-muted cursor-pointer rounded-lg border p-4 transition-colors"
												onClick={() => handleCountryClick(country)}
											>
												<div className="text-lg font-medium">
													{country.name}
												</div>
												<div className="mt-2 flex gap-2">
													<Badge variant="outline">{country.code}</Badge>
													{country.code3 && (
														<Badge variant="secondary">{country.code3}</Badge>
													)}
												</div>
											</div>
										))}
							</div>
						)}
					</CardContent>
				</Card>

				{(selectedCountry || selectedCity) && (
					<Card>
						<CardHeader>
							<CardTitle>
								Translations for{' '}
								{selectedCity ? selectedCity.name : selectedCountry.name}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<Textarea
								value={jsonInput}
								onChange={(e) => setJsonInput(e.target.value)}
								placeholder="Enter translations JSON..."
								className="font-mono min-h-[400px] text-sm"
							/>
							<Button
								onClick={saveTranslations}
								disabled={saving || !jsonInput.trim()}
								className="w-full"
							>
								{saving ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									'Save Languages'
								)}
							</Button>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	)
}
