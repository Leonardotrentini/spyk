import { NextResponse, type NextRequest } from 'next/server'

// Middleware desabilitado - acesso livre para uso interno
export async function middleware(request: NextRequest) {
  // Apenas permitir todas as rotas sem autenticação
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

