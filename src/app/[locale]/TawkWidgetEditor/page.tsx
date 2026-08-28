export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import tawkWidgets from '@/constants/tawkWidgets.json'

interface WidgetMap {
	[key: string]: string
}

interface Language {
	code: string
	name: string
	flag: string
}

const SUPPORTED_LANGUAGES: Language[] = [
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

export default function TawkWidgetEditor() {
	const [widgets, setWidgets] = useState<WidgetMap>({})

	useEffect(() => {
		setWidgets(tawkWidgets as WidgetMap)
	}, [])

	const handleChange = (code: string, value: string) => {
		setWidgets((prev) => ({ ...prev, [code]: value }))
	}

	const handleSave = async () => {
		try {
			const res = await fetch('/api/tawk-widgets', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(widgets),
			})

			if (res.ok) alert('Saved successfully!')
			else alert('Error saving data')
		} catch (err) {
			console.error(err)
			alert('Error saving data')
		}
	}

	return (
		<div className="space-y-4 p-4">
			{SUPPORTED_LANGUAGES.map((lang) => (
				<div key={lang.code} className="flex items-center gap-4">
					<span className="text-2xl">{lang.flag}</span>
					<label className="w-40">{lang.name}</label>
					<input
						type="text"
						placeholder="Enter Tawk Widget ID"
						className="flex-1 border px-2 py-1"
						value={widgets[lang.code] || ''}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							handleChange(lang.code, e.target.value)
						}
					/>
				</div>
			))}
			<button
				onClick={handleSave}
				className="rounded bg-blue-600 px-4 py-2 text-white"
			>
				Save Widget IDs
			</button>
		</div>
	)
}
