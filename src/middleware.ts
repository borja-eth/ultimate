import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Si no hay sesión y no estamos en la página de login
  if (!session && req.nextUrl.pathname !== '/login') {
    console.log('No session found, redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Si hay sesión y estamos en login
  if (session && req.nextUrl.pathname === '/login') {
    console.log('Session found, redirecting to dashboard');
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

// Especificar las rutas que el middleware debe manejar
export const config = {
  matcher: ['/', '/login'],
}; 