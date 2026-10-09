// Shared OpenAI client. The key comes from OPENAI_API_KEY (never hard-code it).
import OpenAI from 'openai'

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
