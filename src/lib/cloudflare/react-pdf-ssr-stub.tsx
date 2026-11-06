// Cloudflare build only (see vite.config.ts): stands in for @react-pdf/renderer
// when client components are rendered to HTML on the server. The only client
// user is the GDPR form, which is loaded with ssr:false and never rendered on
// the server; the browser and server-side PDFs (bookingPdf) get the real library.
const Empty = () => null

export const Document = Empty
export const Page = Empty
export const Text = Empty
export const View = Empty
export const Image = Empty
export const Link = Empty
export const PDFDownloadLink = Empty
export const PDFViewer = Empty
export const BlobProvider = Empty
export const StyleSheet = { create: <T,>(styles: T) => styles }
export const Font = { register: () => {}, registerHyphenationCallback: () => {}, registerEmojiSource: () => {} }
export const pdf = () => {
	throw new Error('@react-pdf/renderer is browser-only here')
}
