import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  // Protect dashboard, profile, orders, AI routes, etc.
  const protectedRoutes = ['/dashboard', '/orders', '/ai-generation', '/billing', '/settings']
  const isProtected = protectedRoutes.some(path => request.nextUrl.pathname.startsWith(path))
  const { data: { user } } = await supabase.auth.getUser()
  
  // Check for demo user in cookies (fallback for server-side detection)
  const demoUserCookie = request.cookies.get('demo_user')
  const hasDemoUser = demoUserCookie && demoUserCookie.value === 'true'
  
  // Allow access if user exists OR if it's a demo user
  const hasValidAuth = user || hasDemoUser

  if (isProtected && !hasValidAuth) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/signin'
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
