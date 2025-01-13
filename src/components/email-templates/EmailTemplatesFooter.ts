import { companyProfile } from '@/constants/companyProfile'
import { footerLinks } from '@/constants/footerLinks'

export const emailTemplatesFooter = () => {
	const html = String.raw
	return html`
		<table
			style="
    width: 100%;
    max-width: 500px;
    color: #000;
    background-color: #fff;
    margin: 0 auto;
    border-spacing: 0;
  "
		>
			<!-- Logo -->
			<tr>
				<td style="padding: 15px 0; text-align: left">
					<a
						href="${process.env.NEXT_PUBLIC_SITE_URL}"
						target="_blank"
						rel="noopener noreferrer"
						style="text-decoration: none"
					>
						<img
							src="https://www.travsus.com/images/logo/dark/travsus_text_dark_bg_transparent.png"
							alt="Travsus"
							style="height: 25px; max-width: 80px; display: inline-block"
						/>
					</a>
				</td>
			</tr>

			<!-- Divider -->
			<tr>
				<td style="padding: 0">
					<hr style="border: 0; border-top: 1px solid #eee; margin: 0" />
				</td>
			</tr>

			<!-- Legal Info -->
			<tr>
				<td
					style="
        padding: 10px 0;
        font-size: 11px;
        line-height: 1.5;
        text-align: left;
      "
				>
					<p style="margin: 0">
						© travsus. ${companyProfile.legalName},
						${companyProfile.legalAddress}
					</p>
					<p style="margin: 10px 0 0">
						© 2024 ${companyProfile.legalName} All rights reserved. Travsus,
						the Travsus logo, the trail marker logo, Travelers' Choice, and the
						Travelers' Choice logo are trademarks of ${companyProfile.legalName}
						in the Spain and other countries.
					</p>
				</td>
			</tr>

			<!-- Do Not Reply Notice -->
			<tr>
				<td
					style="
        padding: 10px 0px;
        font-size: 11px;
        line-height: 1.5;
        text-align: left;
        background-color: #f9f9f9;
      "
				>
					<p style="margin: 0; font-style: italic">
						Please do not reply directly to this email. It was sent from an
						address that does not accept replies. If you have any questions or
						need assistance, please visit our
						<a
							href="${process.env.NEXT_PUBLIC_SITE_URL}/help-center"
							target="_blank"
							style="text-decoration: none; color: #000"
							>Help Center</a
						>.
					</p>
				</td>
			</tr>

			<!-- Unsubscribe and Contact -->
			<tr>
				<td
					style="
        padding: 10px 0px;
        font-size: 11px;
        line-height: 1.5;
        text-align: left;
      "
				>
					<p style="margin: 0">
						This email was sent to you because you have a booking or subscribed
						to our platform. If you no longer wish to receive these emails, you
						can
						<a
							href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe"
							target="_blank"
							style="text-decoration: none; color: #000"
							>unsubscribe</a
						>.
					</p>
					<p style="margin: 10px 0 0">
						Need help? Contact us at
						<a
							href="mailto:contact@travsus.com"
							target="_blank"
							style="text-decoration: none; color: #000"
							>contact@travsus.com</a
						>.
					</p>
				</td>
			</tr>

			<!-- Divider -->
			<tr>
				<td style="padding: 0">
					<hr style="border: 0; border-top: 1px solid #eee; margin: 0" />
				</td>
			</tr>

			<!-- Follow Us Section -->
			<tr>
				<td style="padding: 10px 0px; text-align: left; font-size: 11px">
					<p style="margin: 0">Follow us for travel inspo:</p>
					<table style="margin-top: 10px; border-spacing: 0">
						<tr>
							<td style="padding: 0">
								<a
									href="https://www.instagram.com/travsusofficial/"
									target="_blank"
									rel="noopener noreferrer"
									style="text-decoration: none"
								>
									<img
										src="https://www.travsus.com/images/socail_media/instagram.png"
										alt="Instagram"
										style="
                  width: 20px;
                  height: 20px;
                  max-width: 100%;
                  display: inline-block;
                "
									/>
								</a>
							</td>
						</tr>
					</table>
				</td>
			</tr>

			<!-- Divider -->
			<tr>
				<td style="padding: 0">
					<hr style="border: 0; border-top: 1px solid #eee; margin: 0" />
				</td>
			</tr>

			<!-- Links Section -->
			<tr>
				<td
					style="
      padding: 10px 0px;
      text-align: left;
      font-size: 11px;
      line-height: 1.5;
    "
				>
					${footerLinks
						.map(
							(link, index) => `
        <a
          href="${process.env.NEXT_PUBLIC_SITE_URL}${link.href}"
          target="_blank"
          style="text-decoration: none; color: #000; margin: 0 10px"
        >
          ${link.name}
        </a>
        ${index < footerLinks.length - 1 ? '|' : ''}
      `,
						)
						.join('')}
				</td>
			</tr>
		</table>
	`
}

//   <a href="https://www.facebook.com/travsus" style="text-decoration: none; margin-right: 10px;">
//   <img
//     src="https://www.travsus.com/images/logo/socail_media/facebook.png"
//     alt="Facebook"
//     style="width: 20px; height: 20px; margin: 5px; color: #000;"
//   />
// </a>
