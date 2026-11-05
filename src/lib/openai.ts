// Shared OpenAI client. The key comes from OPENAI_API_KEY (never hard-code it).
// Created on first use (not at import) so `next build` works without the key.
import OpenAI from 'openai'

let client: OpenAI | undefined
const getOpenAI = (): OpenAI => (client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY }))

export const openai = new Proxy({} as OpenAI, {
	get(_target, prop) {
		const real = getOpenAI()
		const value = Reflect.get(real, prop, real)
		return typeof value === 'function' ? value.bind(real) : value
	},
})
