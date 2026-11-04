// Shared OpenAI client. The key comes from OPENAI_API_KEY (never hard-code it).
import OpenAI from 'openai'

let client: OpenAI | undefined

function getOpenAI(): OpenAI {
	if (!client) {
		const apiKey = process.env.OPENAI_API_KEY
		if (!apiKey) throw new Error('Missing OPENAI_API_KEY')
		client = new OpenAI({ apiKey })
	}
	return client
}

// Created on first use so route modules can be imported during `next build`
// without the key, and so the key is read after Cloudflare copies Worker secrets.
export const openai = new Proxy({} as OpenAI, {
	get(_target, prop, receiver) {
		const real = getOpenAI()
		const value = Reflect.get(real, prop, receiver)
		return typeof value === 'function' ? value.bind(real) : value
	},
})
