'use client'

import { useState } from 'react'
import { useLanguage } from './language-provider'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ChevronRight, Users } from 'lucide-react'

export default function PricingCalculator() {
	const { t } = useLanguage()
	const [tourType, setTourType] = useState<'private' | 'shared'>('private')
	const [people, setPeople] = useState<number>(2)
	const [price, setPrice] = useState<number | null>(null)
	const [pricePerPerson, setPricePerPerson] = useState<number | null>(null)

	const calculatePrice = () => {
		if (tourType === 'private') {
			// Private tour: €25 in Merzouga + €25 in Dades + €450 for transport
			const totalPrice = (25 + 25) * people + 450
			const perPerson = totalPrice / people
			setPrice(totalPrice)
			setPricePerPerson(perPerson)
		} else {
			// Shared tour: €25 in Merzouga + €25 in Dades + €30 per person for transport
			const totalPrice = (25 + 25 + 30) * people
			const perPerson = totalPrice / people
			setPrice(totalPrice)
			setPricePerPerson(perPerson)
		}
	}

	return (
		<section id="pricing" className="bg-gray-50 py-16 md:py-24">
			<div className="container px-4 md:px-6">
				<div className="mx-auto mb-12 max-w-3xl text-center">
					<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
						{t('pricing.title')}
					</h2>
					<p className="text-muted-foreground text-lg">
						Choose between private and shared tours based on your preferences
					</p>
				</div>

				<div className="mx-auto max-w-lg">
					<Card>
						<CardHeader>
							<CardTitle>Calculate Your Tour Price</CardTitle>
							<CardDescription>
								Select your preferred tour type and number of travelers
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<RadioGroup
								value={tourType}
								onValueChange={(value) =>
									setTourType(value as 'private' | 'shared')
								}
								className="space-y-3"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="private" id="private" />
									<Label htmlFor="private" className="flex-1">
										<span className="font-medium">{t('pricing.private')}</span>
										<p className="text-muted-foreground text-sm">
											{t('pricing.privatePerPersonLabel')}
										</p>
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="shared" id="shared" />
									<Label htmlFor="shared" className="flex-1">
										<span className="font-medium">{t('pricing.shared')}</span>
										<p className="text-muted-foreground text-sm">
											{t('pricing.sharedPerPersonLabel')}
										</p>
									</Label>
								</div>
							</RadioGroup>

							<div className="space-y-2">
								<Label htmlFor="people">{t('pricing.persons')}</Label>
								<div className="flex items-center space-x-2">
									<Users className="text-muted-foreground h-5 w-5" />
									<Input
										id="people"
										type="number"
										min="1"
										max="100"
										value={people}
										onChange={(e) =>
											setPeople(Number.parseInt(e.target.value) || 1)
										}
										className="w-24"
									/>
								</div>
							</div>

							<Button
								onClick={calculatePrice}
								className="w-full bg-black hover:bg-gray-800"
							>
								{t('pricing.calculateButton')}
								<ChevronRight className="ml-2 h-4 w-4" />
							</Button>

							{price && pricePerPerson && (
								<div className="bg-muted mt-4 rounded-lg p-4">
									<div className="flex justify-between">
										<span>{t('pricing.perPerson')}:</span>
										<span className="font-bold">
											€{pricePerPerson.toFixed(2)}
										</span>
									</div>
									<div className="mt-2 flex justify-between text-lg">
										<span>{t('pricing.total')}:</span>
										<span className="font-bold text-black">
											€{price.toFixed(2)}
										</span>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	)
}
