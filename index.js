const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LOCALE_PATH = path.join(__dirname, 'src', 'app', '[locale]');
const MESSAGES_PATH = path.join(__dirname, 'src', 'messages', 'en_US.json');

function generateKey(namespace, text) {
	const words = text
		.toLowerCase()
		.replace(/[^a-zA-Z0-9 ]/g, '')
		.split(/\s+/)
		.slice(0, 5)
		.map(w => w.slice(0, Math.ceil(w.length / 2)))
		.join('_');

	const random = Array.from({ length: 8 }, () =>
		Math.random().toString(36).charAt(2)
	).join('');

	return `${namespace}.${words}_${random}`;
}

async function rewriteCodeWithAI(originalCode, namespace) {
	const prompt = `
You are a code assistant. You will read a full React code file (TSX).
Your task:

- Identify user-facing texts in JSX (e.g., heading="Popular Cities").
- Ignore logic-related values like IDs, layout, flags.
- Translate only texts that will appear in the UI.
- For each translatable value:
  - Replace it with t('namespace.key') (you will generate a key).
  - Keep the rest of the code identical.
  - Assume 't' is defined via: const t = useTranslations('namespace')
- Do NOT extract text outside components.
- Do NOT change any other part of the file.

Here is the namespace: "${namespace}"
Here is the code:
\`\`\`tsx
${originalCode}
\`\`\`

Return only the final modified code with `t(...)` calls.
`;

	const response = await openai.chat.completions.create({
		model: 'gpt-4',
		messages: [
			{ role: 'system', content: 'You are a precise AI code rewriter.' },
			{ role: 'user', content: prompt },
		],
		temperature: 0.2,
	});

	return response.choices[0].message.content.trim();
}

async function extractKeysFromCode(code, namespace) {
	const regex = /t\(['"`]([\w.-]+)['"`]\)/g;
	const keys = new Set();
	let match;
	while ((match = regex.exec(code))) {
		keys.add(`${namespace}.${match[1]}`);
	}
	return Array.from(keys);
}

async function translateKeys(keys) {
	const translations = {};
	for (const fullKey of keys) {
		const shortKey = fullKey.split('.').slice(1).join('.');
		const label = shortKey.replace(/[_-]/g, ' ');
		const translated = await openai.chat.completions.create({
			model: 'gpt-4',
			messages: [
				{
					role: 'system',
					content: 'Translate UI text to English as it would appear on a website.',
				},
				{ role: 'user', content: `Translate: "${label}"` },
			],
			temperature: 0.2,
		});
		translations[shortKey] = translated.choices[0].message.content.trim();
	}
	return translations;
}

async function processFile(file) {
	const code = fs.readFileSync(file, 'utf-8');

	const parts = path.relative(LOCALE_PATH, file).split(path.sep);
	const namespace = parts[0].replace(/\[|\]/g, '') || 'common';

	// Get AI-rewritten code
	const rewritten = await rewriteCodeWithAI(code, namespace);

	// Extract keys from rewritten code
	const keys = await extractKeysFromCode(rewritten, namespace);

	// Translate those keys
	const translatedMap = await translateKeys(keys);

	// Update JSON
	let messages = {};
	if (fs.existsSync(MESSAGES_PATH)) {
		messages = JSON.parse(fs.readFileSync(MESSAGES_PATH, 'utf-8'));
	}
	if (!messages[namespace]) messages[namespace] = {};
	for (const [k, v] of Object.entries(translatedMap)) {
		if (!messages[namespace][k]) {
			messages[namespace][k] = v;
		}
	}
	fs.writeFileSync(MESSAGES_PATH, JSON.stringify(messages, null, 2), 'utf-8');

	// Save updated file
	fs.writeFileSync(file, rewritten, 'utf-8');
	console.log(`✅ Translated: ${file}`);
}

(async () => {
	const files = await fg(`${LOCALE_PATH}/**/*.tsx`);

	for (const file of files) {
		await processFile(file);
	}

	console.log('🌍 All translations injected.');
})();
