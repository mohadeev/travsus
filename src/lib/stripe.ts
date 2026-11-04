// lib/stripe.js
import Stripe from 'stripe'

let client: Stripe | undefined

function getStripe(): Stripe {
	if (!client) {
		const key = process.env.STRIPE_SECRET_KEY
		if (!key) throw new Error('Missing STRIPE_SECRET_KEY')
		client = new Stripe(key)
	}
	return client
}

// Created on first use so importing a payments route during `next build`
// does not require the secret, and so the key is read after Cloudflare has
// copied Worker secrets onto process.env.
const stripe = new Proxy({} as Stripe, {
	get(_target, prop, receiver) {
		const real = getStripe()
		const value = Reflect.get(real, prop, receiver)
		return typeof value === 'function' ? value.bind(real) : value
	},
})

export default stripe
