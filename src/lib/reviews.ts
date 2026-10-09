// Shared select + translation logic for reviews.
import { T } from '@/lib/db'
import { contentWithTexts } from '@/lib/translations'

/** Review with its author's public profile and all title/content translations. */
export const REVIEW_SELECT = `*,
	user:${T.users}(accountData, profileImage),
	titleContent:${contentWithTexts('titleContentId')},
	contentContent:${contentWithTexts('contentContentId')}`

const pickText = (content: any, language: string) =>
	content?.translations?.find((t: any) => t.languageCode === language)?.text

/** Uses the translated title/content for `language` when available. */
export function localizeReview(review: any, language: string) {
	const { titleContent, contentContent, ...rest } = review
	return {
		...rest,
		title: pickText(titleContent, language) ?? review.title,
		content: pickText(contentContent, language) ?? review.content,
		language,
	}
}
