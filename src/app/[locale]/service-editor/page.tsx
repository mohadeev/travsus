// The editor reads its state from the URL (?active=…&step=…), so it's built on
// each request. Route config like `dynamic` only works in a server file, which
// is why the editor itself lives in ServiceEditor.tsx.
import { Suspense } from 'react'
import ServiceEditor from './ServiceEditor'

export const dynamic = 'force-dynamic'

export default function ServiceEditorPage() {
	return (
		<Suspense>
			<ServiceEditor />
		</Suspense>
	)
}
