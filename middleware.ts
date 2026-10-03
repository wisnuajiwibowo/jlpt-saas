import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Inisialisasi Supabase Server Client di dalam Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Ambal data sesi user yang sedang aktif secara aman dari server
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Aturan A: Amankan rute /dashboard
  if (url.pathname.startsWith('/dashboard')) {
    if (!user) {
      // Jika belum login, paksa ke halaman login
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Aturan B: Amankan rute /admin (Hanya untuk User dengan Role Admin)
  if (url.pathname.startsWith('/admin')) {
    if (!user) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Periksa metadata user untuk memastikan role-nya adalah admin
    // Catatan: Pastikan saat user mendaftar, Anda menyisipkan app_metadata atau user_metadata 'is_admin' / 'role'
    const userRole = user.app_metadata?.role || user.user_metadata?.role
    if (userRole !== 'admin') {
      // Jika bukan admin, tendang ke dashboard biasa
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Aturan C: Cegah user yang sudah login untuk masuk ke halaman auth lagi
  if (url.pathname.startsWith('/login')) {
    if (user) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return response
}

// 3. Konfigurasi Matcher untuk menyaring halaman mana saja yang harus melewati pemeriksaan middleware
export const config = {
  matcher: [
    /*
     * Cocokkan semua jalur permintaan kecuali:
     * - _next/static (file statis Next.js)
     * - _next/image (optimasi gambar Next.js)
     * - favicon.ico (file ikon browser)
     * - api (api routes dikecualikan agar webhook iPaymu/Stripe tidak terblokir auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
