import type React from "react";
import getUserData from "@/app/api/user/getUserData";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Helper function to fetch post data from API
async function getPostFromApi(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/blog/${id}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch post: ${response.statusText}`);
  }

  return response.json();
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  console.log("slug:", params.slug);
  const post = await getPostFromApi(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const { title, excerpt, author } = post;
  const authorName =
    author?.username ||
    `${author?.accountData?.firstname} ${author?.accountData?.lastname}`;

  return {
    title: `${title} | TRAVSUS`,
    description: excerpt,
    openGraph: {
      title: title,
      description: excerpt,
      type: "article",
      authors: [authorName],
      publishedTime: post.createdAt,
      images: [
        {
          url:
            post.featuredImage || "https://yourblog.com/default-og-image.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: excerpt,
      images: [
        post.featuredImage || "https://yourblog.com/default-twitter-image.jpg",
      ],
    },
    alternates: {
      canonical: `https://yourblog.com/blog/${params.slug}`,
    },
  };
}

export default async function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const post = await getPostFromApi(params.slug);
  const { id: currentUserId } = (await getUserData()) || {};

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name:
        post.author?.username ||
        `${post.author?.accountData?.firstname} ${post.author?.accountData?.lastname}`,
    },
    datePublished: post.createdAt,
    image: post?.featuredImage,
    publisher: {
      "@type": "Organization",
      name: "Your Blog Name",
      logo: {
        "@type": "ImageObject",
        url: "https://yourblog.com/logo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__INITIAL_DATA__ = ${JSON.stringify({
            post,
            currentUserId,
          })}`,
        }}
      />
    </>
  );
}
