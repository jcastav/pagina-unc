import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 0. Rutas de Invitado: Si el usuario ya está logueado, no debe ver Login ni Registro
  if (user && (pathname === '/login' || pathname === '/afiliarse')) {
    return NextResponse.redirect(new URL('/perfil', request.url))
  }

  // 1. Protección Básica: Si no hay usuario, no entra a áreas privadas
  if (!user) {
    if (pathname.startsWith('/perfil') || pathname.startsWith('/comando')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return response
  }

  // 2. Control de Roles (RBAC) y Seguridad
  // Obtenemos el perfil completo para verificar baneo y rol
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_banned')
    .eq('id', user.id)
    .single()

  // VERIFICACIÓN DE BANEO
  if (profile?.is_banned) {
    // Si está baneado, eliminamos la sesión y redirigimos
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login?error=banned', request.url))
  }

  const role = profile?.role || 'AFILIADO'

  // Si intenta entrar al área de COMANDO
  if (pathname.startsWith('/comando')) {
    // Solo ROOT y COMANDO pueden entrar al dashboard general
    if (role !== 'ROOT' && role !== 'COMANDO') {
       return NextResponse.redirect(new URL('/perfil', request.url))
    }

    // Restricción específica: Solo ROOT puede entrar a Gestión de Usuarios (afiliados)
    if (pathname.startsWith('/comando/afiliados') && role !== 'ROOT') {
        return NextResponse.redirect(new URL('/comando/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/perfil/:path*', '/comando/:path*', '/login', '/afiliarse'],
}
