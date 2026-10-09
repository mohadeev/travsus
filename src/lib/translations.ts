// Helpers for the translatable_contents / translated_texts tables.
import { db, T, must, touch, withMeta } from '@/lib/db'

/** Embed for a content row with all its translations. */
export const contentWithTexts = (fk: string) =>
	`${T.translatableContents}!${fk}(*, translations:${T.translatedTexts}(*))`

/** Creates or updates the text of one content item in one language. */
export async function upsertTranslatedText(
	contentId: string,
	languageCode: string,
	text: string,
) {
	const existing = must(
		await db
			.from(T.translatedTexts)
			.select('id')
			.match({ contentId, languageCode })
			.maybeSingle(),
	)
	if (existing) {
		must(await db.from(T.translatedTexts).update(touch({ text })).eq('id', existing.id))
	} else {
		must(
			await db
				.from(T.translatedTexts)
				.insert(withMeta({ contentId, languageCode, text })),
		)
	}
}

/** Creates a content item with its translations and returns its id. */
export async function createTranslatableContent(
	contentType: string,
	entityId: string,
	texts: { languageCode: string; text: string }[],
) {
	const content = must(
		await db
			.from(T.translatableContents)
			.insert(withMeta({ contentType, entityId }))
			.select('id')
			.single(),
	)
	if (texts.length) {
		must(
			await db
				.from(T.translatedTexts)
				.insert(texts.map((t) => withMeta({ ...t, contentId: content.id }))),
		)
	}
	return content.id as string
}
