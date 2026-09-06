import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { createClient } from '@/utils/supabase/middleware';

// Function to convert old blog path to new blog path
function convertOldBlogPath(pathname: string, nameParam: string | null) {
  const pathnameParts = pathname.split('/').filter(Boolean);
  const blogId = pathnameParts[pathnameParts.length - 1];

  if (
    pathnameParts.length >= 3 &&
    pathnameParts[pathnameParts.length - 2] === 'blog'
  ) {
    const nameSegment = nameParam || 'post';
    return `/${pathnameParts.slice(0, -1).join('/')}/${nameSegment}/${blogId}`;
  }
  return pathname;
}

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const locale: string = pathname.split('/')[1] || 'en-US';
  const parts = pathname.split('/');
  const last = parts[parts.length - 1];
  const serviceId =
    parts.length === 11 ? parts[parts.length - 2] : parts[parts.length - 1];

  // === Tour redirect logic (now using Supabase) ===
  if ((last === 'q=tour' && parts.length === 11) || parts.length === 7) {
    try {
      // 1. Get Supabase client for middleware
      const { supabaseResponse, supabase } = createClient(request);

      // 2. Query the tour by ID, fetch only slugs
      const { data: tour, error } = await supabase
        .from('tours')
        .select('slugs')
        .eq('id', serviceId)
        .single();

      if (error || !tour) {
        console.error('Tour not found or error:', error);
        // If not found, do not redirect (maybe 404 later)
        // Continue with i18n middleware
        return createMiddleware(routing)(request);
      }

      // 3. Find the slug for the requested locale
      const slugs = tour.slugs || [];
      let foundSlug = slugs.find((s) => s.language === locale);
      // Fallback to first available slug if no match
      if (!foundSlug && slugs.length > 0) {
        foundSlug = slugs[0];
      }

      if (foundSlug) {
        const link = foundSlug.slug; // e.g., "/en-US/morocco/marrakech/tours/..."
        if (link !== pathname) {
          return NextResponse.redirect(new URL(url.origin + link), 301);
        }
      }
    } catch (error) {
      console.error('Error in tour redirect (Supabase):', error);
    }
  }

  // === Blog old-link redirect logic ===
  if (pathname.startsWith(`/${locale}/blog/`)) {
    const nameParam = url.searchParams.get('name');
    const newBlogPath = convertOldBlogPath(pathname, nameParam);
    if (newBlogPath && newBlogPath !== pathname) {
      return NextResponse.redirect(new URL(url.origin + newBlogPath), 301);
    }
  }

  // Continue with i18n middleware
  return createMiddleware(routing)(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};