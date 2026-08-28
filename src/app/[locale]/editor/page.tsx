export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { notFound } from 'next/navigation'
import BlogEditor from '@/components/BlogEditor'
import getUserData from '@/app/api/user/getUserData'
import { getPostById } from '@/app/actions/getPostById'

export default async function EditorPage({
	searchParams,
}: {
	searchParams: { id?: string }
}) {
	const { id: userId }: any = (await getUserData()) || {}
	const postId = searchParams.id

	if (postId) {
		const post = await getPostById(postId)
		if (!post || post.authorId !== userId) {
			notFound()
		}
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<BlogEditor postId={postId} userId={userId} />
		</div>
	)
}
