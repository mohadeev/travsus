export const EmailBlackButton = (text: string, href: string) => {
	return `<a href=${href} style="box-sizing:border-box;display:block;width:max-content;background-color:#151515;color:#ffffff!important;font-weight:500;font-size:16px!important;line-height:24px;letter-spacing:-0.008em;text-decoration:none;border-radius:16px;padding:10px 16px;margin: 0 auto;text-align:center;">${text}</a>`
}
