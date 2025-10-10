import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Skip middleware if environment variables are not available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('Supabase environment variables not available, skipping middleware')
    return NextResponse.next()
  }

  let response = NextResponse.next()
  
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
    
    // Check for demo user in cookies (fallback for server-side detection)
    const demoUserCookie = request.cookies.get('demo_user')
    const hasDemoUser = demoUserCookie && demoUserCookie.value === 'true'
    
    // If it's a protected route, check authentication
    if (isProtected) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const hasValidAuth = user || hasDemoUser

        if (!hasValidAuth) {
          const redirectUrl = request.nextUrl.clone()
          redirectUrl.pathname = '/auth/signin'
          redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
          return NextResponse.redirect(redirectUrl)
        }
      } catch (authError) {
        console.log('Auth check failed, allowing access:', authError)
        // If auth check fails, allow access to prevent blocking
      }
    }

    return response
  } catch (error) {
    console.log('Middleware error, allowing request:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
