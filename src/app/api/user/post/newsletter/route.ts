import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { rateLimit } from '@/lib/rateLimit'
import sendEmail from '@/utils/email/sendMail'

const limiter = rateLimit(4, 60000) // 4 requests per minute

function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email) && email.length <= 60
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

				// const email = 'skendoulmohamed@gmail.com'
				// const fullname = ''
				sendEmail({
					to: email,
					subject: '',
					message: '',
					type: 'newsletterWelcomeTemplate',
					emailData: {
						// ...{
						// 	name: fullname,
						// 	email,
						// 	restLink: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/q?token=${'resetToken'}`,
						// },
						...{
							// name: 'Jane Smith',
							// transactionId: 'TRV-PAY-98765',
							// paymentDate: '2023-06-30',
							// amount: '$500.00',
							// paymentMethod: 'Visa ending in 1234',
							// description: 'Deposit for Paris trip (Booking Ref: TRVS12345)',
							// receiptLink: 'https://www.travsus.com/payments/TRV-PAY-98765',
						},
					},
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
