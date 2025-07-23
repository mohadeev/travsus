// import { NextRequest, NextResponse } from "next/server";
// import { parse, serialize } from "cookie";

// export async function middleware(request: NextRequest) {
//   const isAuthenticated = checkAuth(request);

//   const country = request.geo?.country || "US";

//   // if (country === 'ES') {
//   // 	return new NextResponse(null, { status: 403 })
//   // }

//   try {
//     let ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

//     if (ip === "::1") {
//       ip = "79.116.108.40";
//     }

//     const cookies = request.headers.get("cookie");
//     const parsedCookies = cookies ? parse(cookies) : {};
//     const geoCookie = parsedCookies.customGeo;

//     if (!geoCookie) {
//       const geoResponse = await fetch(
//         `https://get.geojs.io/v1/ip/geo/${ip}.json`,
//       );
//       const geoData = await geoResponse.json();

//       if (geoData) {
//         const { city, country, latitude, longitude, timezone } = geoData;
//         const geoDataString = JSON.stringify({
//           city,
//           country,
//           latitude,
//           longitude,
//           timezone,
//           message: "Geo location fetched successfully",
//         });

//         const geoCookieHeader = serialize("customGeo", geoDataString, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           maxAge: 86400,
//           path: "/",
//         });
//         const response = NextResponse.next();
//         response.headers.set("Set-Cookie", geoCookieHeader);
//         return response;
//       } else {
//         const geoCookieHeader = serialize(
//           "customGeo",
//           JSON.stringify({
//             message: "Location not found",
//           }),
//           {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             maxAge: 86400,
//             path: "/",
//           },
//         );
//         const response = NextResponse.next();
//         response.headers.set("Set-Cookie", geoCookieHeader);
//         return response;
//       }
//     }
//   } catch (error) {}

//   const url = new URL(request.url);
//   const origin = url.origin;
//   const pathname = request.nextUrl.pathname;

//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set("x-url", request.url);
//   requestHeaders.set("x-origin", origin);
//   requestHeaders.set("x-pathname", pathname);

//   // Set the server response timeout to 5 minutes (300000 ms)
//   const response = NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });
//   response.headers.set("Connection", "Keep-Alive");
//   response.headers.set("Keep-Alive", "timeout=300");

//   return response;
// }

// function isPublicRoute(pathname: string) {
//   const publicRoutes = [
//     "/login",
//     "/register",
//     "/forgot-password",
//     "/api/auth",
//     "/api/trpc",
//     "/404",
//   ];
//   return (
//     publicRoutes.some((route) => pathname.startsWith(route)) ||
//     pathname === "/" ||
//     pathname.startsWith("/q=")
//   );
// }

// function checkAuth(request: NextRequest): boolean {
//   const sessionToken = request.cookies.get("next-auth.session-token");
//   return !!sessionToken;
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
//   runtime: "experimental-edge",
// };

// import { i18nRouter } from "next-i18n-router";
// import i18nConfig from "./i18nConfig.js";

// export function middleware(request) {
//   return i18nRouter(request, i18nConfig);
// }

// // applies this middleware only to files in the app directory
// export const config = {
//   matcher: "/((?!api|static|.*\\..*|_next).*)",
// };

import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
	// Match all pathnames except for
	// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
	// - … the ones containing a dot (e.g. `favicon.ico`)
	matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
