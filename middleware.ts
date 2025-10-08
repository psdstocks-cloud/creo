import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Don't redirect to locale paths, use default locale
  localePrefix: 'never'
});
 
export const config = {
  // Match all pathnames except for
  // - /api
  // - /_next (Next.js internals)
  // - /_static (inside /public)
  // - all root files inside /public (e.g. /favicon.ico)
  matcher: ['/((?!api|_next|_static|.*\\..*).*)']
};
