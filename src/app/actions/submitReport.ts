'use server'

import { PrismaClient } from '@prisma/client'
import sgMail from '@sendgrid/mail'

const prisma = new PrismaClient()
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function submitReport(formData: FormData) {
	const title = formData.get('title') as string
	const description = formData.get('description') as string
	const category = formData.get('category') as string
	const urgencyLevel = formData.get('urgencyLevel') as string
	const involvedParties = formData.get('involvedParties') as string
	const dateOfIncident = formData.get('dateOfIncident') as string
	const additionalInfo = formData.get('additionalInfo') as string

	if (!title || !description || !category || !urgencyLevel) {
		return {
			error: 'Title, description, category, and urgency level are required',
		}
	}

	try {
		const report = await prisma.whistleblowerReport.create({
			data: {
				title,
				description,
				category,
				urgencyLevel,
				involvedParties: involvedParties || null,
				dateOfIncident: dateOfIncident ? new Date(dateOfIncident) : null,
				additionalInfo: additionalInfo || null,
			},
		})

		// Prepare email content
		const emailContent = `
      New Whistleblower Report Submitted

      Report ID: ${report.id}
      Title: ${title}
      Category: ${category}
      Urgency Level: ${urgencyLevel}
      Date of Incident: ${dateOfIncident || 'Not provided'}
      Involved Parties: ${involvedParties || 'Not provided'}

      Description:
      ${description}

      Additional Information:
      ${additionalInfo || 'None provided'}
    `

		// Send email
		const msg = {
			to: 'skendoulmohamed@gmail.com',
			from: 'whistleblower@travsus.com', // Make sure this email is verified in your SendGrid account
			subject: `New Whistleblower Report: ${title}`,
			text: emailContent,
		}

		await sgMail.send(msg)

		return { success: true, id: report.id }
	} catch (error) {
		console.error('Failed to submit report or send email:', error)
		return { error: 'Failed to submit report. Please try again.' }
	}
}
