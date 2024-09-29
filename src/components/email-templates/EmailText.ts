export const EmailText = (text: string, style: any) => {
	return `<p style="color:#000; font-size: 16px; font-weight: 500; text-align:center;  ${style && style}">${text}</p>`
}
