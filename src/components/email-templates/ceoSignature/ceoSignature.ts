import { companyProfile } from '@/constants/companyProfile'

interface SignatureParams {
	[key: string]: any
	style?: 'center' | 'left'
}

export const ceoSignature = (params: SignatureParams = {}): string => {
	const style = params.style === 'left' ? 'left' : 'center'
	const html = String.raw
	return html`<!doctype html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Document</title>
			</head>
			<body>
				<table
					style="
			  width: 100%;
			  max-width: 600px;
			  font-family: Arial, sans-serif;
			  color: #000;
			  background-color: #fff;
			  margin: 0 auto;
			  border-spacing: 0;
			  text-align: ${style};
			"
				>
					<tr>
						<!-- Profile Image + Info -->
						<td
							style="padding: 15px; vertical-align: top; display: flex; justify-content: ${style ===
							'center'
								? 'center'
								: 'flex-start'};"
						>
							<!-- Profile Image -->
							<table style="margin-right: 15px">
								<tr>
									<td style="padding: 0">
										<img
											src="https://media.licdn.com/dms/image/v2/D4D03AQETvP90A5Anlg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1714695083171?e=1738195200&v=beta&t=f-xWtPh3tu3YC8z1VpdYSAFdL31g_08j6tp1dew75Fo"
											alt="Massin Skendoul"
											style="width: 80px; height: 80px; border-radius: 50%"
										/>
									</td>
								</tr>
							</table>
							<!-- CEO Info -->
							<table style="width: auto">
								<tr>
									<td style="padding: 0">
										<p style="margin: 0; font-size: 16px; font-weight: bold">
											Massin Skendoul
										</p>
										<p style="margin: 0; font-size: 14px">CEO, Travsus</p>
										<p style="margin: 5px 0; font-size: 12px">
											Connecting Explorers with Endless Adventures
										</p>
										<p style="margin: 5px 0; font-size: 12px">
											📞 +34 123 456 789 | ✉️
											<a
												href="mailto:ceo@travsus.com"
												style="color: #000; text-decoration: none"
												>ceo@travsus.com</a
											>
										</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Travsus Logo -->
					<tr>
						<td style="padding: 15px; text-align: ${style};">
							<a
								href="https://www.travsus.com"
								target="_blank"
								rel="noopener noreferrer"
								style="text-decoration: none"
							>
								<img
									src="https://www.travsus.com/images/logo/dark/travsus_text_dark_bg_transparent.png"
									alt="Travsus Logo"
									height="20"
									style="display: inline-block"
								/>
							</a>
						</td>
					</tr>

					<!-- Divider -->
					<tr>
						<td style="padding: 0 15px">
							<hr style="border: 0; border-top: 1px solid #eee" />
						</td>
					</tr>

					<!-- Enhanced Company Info -->
					<tr>
						<td style="padding: 0 15px">
							<table style="width: 100%; border-spacing: 0">
								<tr>
									<td
										style="padding: 0; font-size: 13px; line-height: 1.8; text-align: ${style};"
									>
										<p style="margin: 0; font-weight: bold">
											${companyProfile.legalName}
										</p>
										<p style="margin: 0">${companyProfile.legalAddress}</p>
										<p
											style="margin: 10px 0; font-size: 12px; font-style: italic"
										>
											Our mission is to redefine the way people explore the
											world. Whether you're seeking hidden gems or bucket-list
											adventures, Travsus is your ultimate travel companion. We
											connect passionate explorers with unforgettable
											experiences, curating journeys that inspire and transform.
										</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Divider -->
					<tr>
						<td style="padding: 0 15px">
							<hr style="border: 0; border-top: 1px solid #eee" />
						</td>
					</tr>

					<!-- Legal Disclaimer -->
					<tr>
						<td style="padding: 0 15px">
							<table style="width: 100%; border-spacing: 0">
								<tr>
									<td
										style="padding: 0; font-size: 11px; line-height: 1.5; text-align: ${style};"
									>
										<p style="margin: 0">
											© 2024 Travsus S.L. All rights reserved.
										</p>
										<p style="margin: 0">
											Travsus and its logos are trademarks of
											${companyProfile.legalName} in Irland, Spain and other
											countries.
										</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Social Media -->
					<tr>
						<td style="padding: 15px; text-align: ${style};">
							<table style="width: 100%; border-spacing: 0">
								<tr>
									<td
										style="padding: 0; font-size: 12px; text-align: ${style};"
									>
										<p style="margin: 0">Follow us:</p>
									</td>
								</tr>
								<tr>
									<td style="padding: 0; text-align: ${style};">
										<a
											href="https://www.instagram.com/travsusofficial/"
											style="text-decoration: none"
										>
											<img
												src="https://www.travsus.com/images/socail_media/instagram.png"
												alt="Instagram"
												style="width: 20px; height: 20px"
											/>
										</a>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</body>
		</html>`
}
