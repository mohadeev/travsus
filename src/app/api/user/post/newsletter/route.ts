export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { rateLimit } from '@/lib/rateLimit'
import sendEmail from '@/utils/email/sendMail'

const limiter = rateLimit(4, 60000) // 4 requests per minute
const TEST_EMAILS = ['skendoulmohamed@gmail.com']
const TEST_DOMAINS = ['travsus.com']

function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email) && email.length <= 60
}

function isTestEmail(email: string): boolean {
	if (TEST_EMAILS.includes(email)) return true
	return TEST_DOMAINS.some((domain) => email.endsWith(`@${domain}`))
}

export async function POST(req: NextRequest) {
	return new Promise<NextResponse>((resolve) => {
		limiter(req, NextResponse.next(), async () => {
			try {
				const { email, types } = await req.json()

				if (!email) {
					resolve(
						NextResponse.json({ code: 'EMAIL_REQUIRED' }, { status: 400 }),
					)
					return
				}

				if (!isValidEmail(email)) {
					resolve(NextResponse.json({ code: 'INVALID_EMAIL' }, { status: 400 }))
					return
				}

				// For test emails, we can bypass some validation and DB operations
				if (isTestEmail(email)) {
					console.log('Sending test email to:', email)

					// Send test email
					await sendEmail({
						to: email,
						subject: 'Test Newsletter Welcome',
						message: '',
						type: 'newsletterWelcomeTemplate',
						emailData: {
							// Test data can be added here
						},
					})

					resolve(
						NextResponse.json({ code: 'TEST_EMAIL_SENT' }, { status: 200 }),
					)
					return
				}

				// Normal flow for non-test emails
				if (!types || !Array.isArray(types) || types.length === 0) {
					resolve(
						NextResponse.json({ code: 'TYPES_REQUIRED' }, { status: 400 }),
					)
					return
				}

				const existingSubscription =
					await prisma.newsletterSubscription.findUnique({
						where: { email },
					})

				if (existingSubscription) {
					resolve(
						NextResponse.json({ code: 'ALREADY_SUBSCRIBED' }, { status: 200 }),
					)
					return
				}

				const subscription = await prisma.newsletterSubscription.create({
					data: {
						email,
						types,
						subscribed: true,
					},
				})

				await sendEmail({
					to: email,
					subject: 'Welcome to Our Newsletter',
					message: '',
					type: 'newsletterWelcomeTemplate',
					emailData: {},
				})

				resolve(
					NextResponse.json({ code: 'SUBSCRIPTION_SUCCESS' }, { status: 201 }),
				)
			} catch (error) {
				console.error('Newsletter subscription error:', error)
				resolve(NextResponse.json({ code: 'SERVER_ERROR' }, { status: 500 }))
			}
		})
	})
}
