interface Params {
	[key: string]: any
	style?: 'center' | 'left'
}

export const emailTemplatesHeader = (params: Params = {}): string => {
	const style = params.style === 'center' ? 'center' : 'left'
	const html = String.raw
	return html`
		<table
			role="presentation"
			cellspacing="0"
			cellpadding="0"
			style="width: 100%; max-width: 500px; margin: 0 auto; margin: 40px 0;text-align: ${style};"
		>
			<tr>
				<td style="padding: 0;">
					<a
						href="${process.env.NEXT_PUBLIC_SITE_URL}"
						target="_blank"
						rel="noopener noreferrer"
						style="color: #000000; text-decoration: none; display: inline-block;"
					>
						<img
							src="https://www.travsus.com/images/logo/dark/travsus_text_dark_bg_transparent.png"
							alt="Travsus"
							style="height: 30px; max-height: 30px; display: inline-block"
						/>
					</a>
				</td>
			</tr>
		</table>
	`
}
