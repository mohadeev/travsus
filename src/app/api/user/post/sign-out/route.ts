// app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { NextRequest } from 'next/server';

// Handle sign out and clear session cookie
export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    // If no session exists, return 401 (Unauthorized)
    // if (!session) {
    //   return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    // }

    // Invalidate the session by clearing the session cookie
    const clearCookies = [
      'next-auth.session-token=deleted; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax',
      'next-auth.csrf-token=deleted; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax'
    ];

    // Send response with cookies cleared
    return NextResponse.json({ message: 'Successfully signed out' }, {
      headers: {
        'Set-Cookie': clearCookies.join(', '), // Clear cookies using a single header
      },
    });
  } catch (error: any) {
    console.error('Error during sign out:', error);
    return NextResponse.json(
      { message: 'Sign out failed', error: error.message },
      { status: 500 }
    );
  }
}
