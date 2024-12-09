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
			style="width: 100%; max-width: 500px; margin: 0 auto; text-align: ${style};"
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
							src="https://www.travsus.com/images/logo/dark/travsus_circul_dark.png"
							height="80"
							alt="Travsus"
							style="height: 80px; max-width: 80px; display: block; margin: 0 auto;"
						/>
					</a>
				</td>
			</tr>
		</table>
	`
}
