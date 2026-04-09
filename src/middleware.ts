import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
  localeDetection: false,
});

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
  '/onboarding(.*)',
  '/:locale/onboarding(.*)',
  '/admin(.*)',
  '/:locale/admin(.*)',
]);

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // Force Arabic locale unless explicitly visiting /en path
  const { pathname } = request.nextUrl;
  const isEnglishPath = pathname.startsWith('/en') || pathname.startsWith('/en/');

  if (!isEnglishPath) {
    request.cookies.set('NEXT_LOCALE', 'ar');
  }

  if (
    request.nextUrl.pathname.includes('/sign-in')
    || request.nextUrl.pathname.includes('/sign-up')
    || isProtectedRoute(request)
    || (request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.startsWith('/api/webhooks'))
  ) {
    return clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        const locale
          = req.nextUrl.pathname.match(/(\/.*)?\/dashboard/)?.at(1) ?? '';

        const signInUrl = new URL(`${locale}/sign-in`, req.url);

        await auth.protect({
          unauthenticatedUrl: signInUrl.toString(),
        });
      }

      const authObj = await auth();

      if (
        authObj.userId
        && !authObj.orgId
        && req.nextUrl.pathname.includes('/dashboard')
        && !req.nextUrl.pathname.endsWith('/organization-selection')
      ) {
        const orgSelection = new URL(
          '/onboarding/organization-selection',
          req.url,
        );

        return NextResponse.redirect(orgSelection);
      }

      // Bypass next-intl for API routes
      if (req.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
      }

      return intlMiddleware(req);
    })(request, event);
  }

  // Bypass next-intl for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!ai/|.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'], // Also exclude /ai and tunnelRoute used in Sentry from the matcher
};
