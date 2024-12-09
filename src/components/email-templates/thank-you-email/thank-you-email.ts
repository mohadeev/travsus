import { format } from 'date-fns'
import { ceoSignature } from '../ceoSignature/ceoSignature'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'

export const thankyouEmailTemplate = ({
	name,
	destination,
	date,
}: {
	name: string
	destination: string
	date: string
}) => {
	const formattedDate = format(new Date(date), 'MMMM d, yyyy')
	const html = String.raw
	return html`
		<!doctype html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Thank You for Booking with Travsus</title>
			</head>
			<body
				style="
				font-family:  Arial, sans-serif;
				line-height: 1.6;
				color: #333;
				max-width: 600px;
				margin: 0 auto;
				padding: 0;
			"
			>
				<div style="background-color: #000; padding: 20px; text-align: center;">
					${emailTemplatesHeader({
						style: 'left',
					})}
				</div>

				<div style="background-color: #ffffff; padding: 30px;">
					<h1
						style="
						color: #000;
						text-align: center;
						font-size: 28px;
						margin-bottom: 20px;
						font-weight: bold;
					"
					>
						Thank You for Choosing Travsus!
					</h1>

					<p style="font-size: 16px; margin-bottom: 20px;">Dear ${name},</p>

					<p style="font-size: 16px; margin-bottom: 20px;">
						We're thrilled that you've booked your trip to ${destination} with
						Travsus. As a token of our appreciation, we have a special gift for
						you!
					</p>

					<div
						style="
						background-color: #f2f2f2;
						border: 1px solid #e0e0e0;
						border-radius: 10px;
						padding: 20px;
						margin-bottom: 20px;
					"
					>
						<h2
							style="
							color: #000;
							font-size: 20px;
							margin: 0 0 15px 0;
							font-weight: bold;
						"
						>
							Your Complimentary Dinner in Merzouga
						</h2>
						<p style="margin: 5px 0; font-size: 16px;">
							<strong>Date:</strong> To be determined based on your arrival
						</p>
						<p style="margin: 5px 0; font-size: 16px;">
							<strong>Location:</strong> We'll provide details of top-rated
							restaurants in Merzouga
						</p>
						<p
							style="
							margin: 15px 0 5px 0;
							font-size: 14px;
							color: #767676;
							font-style: italic;
						"
						>
							Note: The cost of this dinner will be automatically refunded to
							you
						</p>
					</div>

					<p style="font-size: 16px; margin-bottom: 20px;">
						We hope this dining experience will be a highlight of your trip.
						It's our way of ensuring your visit to ${destination} is truly
						unforgettable. Enjoy the local cuisine without worrying about the
						cost!
					</p>

					<p style="font-size: 16px; margin-bottom: 20px;">
						If you have any questions or special requests, our customer service
						team is here to help. We're committed to making your journey smooth
						and enjoyable.
					</p>

					<p style="font-size: 16px; margin-bottom: 20px;">
						Thank you again for choosing Travsus. We look forward to being part
						of your travel adventures!
					</p>

					<p style="font-size: 16px; margin-bottom: 20px;">
						Safe travels and bon appétit!
					</p>

					<p style="font-size: 16px; margin-bottom: 5px;">Best regards,</p>

					<p
						style="
						font-size: 18px;
						font-weight: bold;
						margin-bottom: 20px;
						color: #000;
					"
					>
						CEO, Travsus
					</p>

					${ceoSignature()}
				</div>
			</body>
		</html>
	`
}
