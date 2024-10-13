import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'
export const dynamic = 'force-dynamic' // This ensures the route is always dynamic

// import axios from 'axios'
// const apiKey = 'QYZHycqZtexrTd_sy6TQsf39tey7Zf5WwmNzDZGR';
// const mailrelayDomain = 'travsus.ipzmarketing.com'; // Your Mailrelay domain

// async function sendEmail() {
//   try {
//     const response = await axios.post(`https://${mailrelayDomain}/api/v1/sendEmails`, { // Use /sendEmails instead of /sendEmail
//       apiKey: apiKey,
//       from: 'ceo@travsus.com',
//       to: 'skedoulmohamed@gmail.com',
//       subject: 'Test email from Node.js',
//       body_html: '<h1>This is a test email</h1><p>Sent via Node.js and Mailrelay API</p>',
//       body_text: 'This is a test email sent via Node.js and Mailrelay API',
//     });

//     console.log('Email sent successfully:', response.data);
//   } catch (error) {
//     console.error('Error sending email:', error.response ? error.response.data : error.message);
//   }
// }

// sendEmail();
// import nodemailer from 'nodemailer'
// let transporter = nodemailer.createTransport({
// 	host: 'smtp1.s.ipzmarketing.com', // Your SMTP server
// 	port: 587, // SMTP port (typically 587 for TLS)
// 	secure: false, // Set to `true` if you're using port 465
// 	auth: {
// 		user: 'ovekaylxnvkx', // Your SMTP username
// 		pass: 'jgo6lkFQm3s', // Your SMTP password
// 	},
// 	tls: {
// 		rejectUnauthorized: false, // Only use this option if you're facing certificate issues
// 	},
// })

// // Set up email data
// let mailOptions = {
// 	from: '"Travsus CEO" <ceo@travsus.com>', // Sender address
// 	to: 'ceo@travsus.com', // Recipient address
// 	subject: 'Here is the subject', // Subject line
// 	text: 'This is the plain text body of the email', // Plain text body
// 	html: '<b>This is the HTML message body in bold!</b>', // HTML body
// }
// const stringLine =
// 	'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------'
// // Send the email
// transporter.sendMail(mailOptions, (error, info) => {
// 	if (error) {
// 		return console.log('Error sending email:', error, stringLine)
// 	}
// 	console.log('Email sent successfully:', info.response, stringLine)
// })

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = request.nextUrl // Use nextUrl instead of new URL(request.url)
		const page = parseInt(searchParams.get('page') || '1')
		const limit = parseInt(searchParams.get('limit') || '8')

		const userData: any = await getUserData()
		const { savedList } = userData || {}

		const totalTours = await prisma.tour.count({
			where: {
				images: {
					isEmpty: false,
				},
			},
		})

		const allToursData = await prisma.tour.findMany({
			where: {
				images: {
					isEmpty: false,
				},
			},
			skip: (page - 1) * limit,
			take: limit,
		})

		const modifiedToursData = allToursData.map((tour) => ({
			...tour,
			liked: savedList?.includes(tour.id),
		}))
		console.log('modifiedToursData:', modifiedToursData?.[0])

		return NextResponse.json({
			allToursData: modifiedToursData,
			totalTours,
			page,
			totalPages: Math.ceil(totalTours / limit),
		})
	} catch (error) {
		console.error('Error fetching tour:', error)
		return NextResponse.json(
			{ message: 'Error fetching tour data' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}

import nodemailer from 'nodemailer'
