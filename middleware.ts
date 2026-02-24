import { NextRequest, NextResponse } from 'next/server'

/**
 * 프록시: /dashboard 경로 접근 제어
 * - URL 쿼리 파라미터 token 값을 ADMIN_TOKEN 환경변수와 비교
 * - 토큰이 일치하지 않으면 403 반환
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // /dashboard 경로만 보호
  if (pathname.startsWith('/dashboard')) {
    const token = searchParams.get('token')
    const adminToken = process.env.ADMIN_TOKEN

    // 환경변수 미설정 시 접근 차단 (개발 환경 안전 보호)
    if (!adminToken) {
      return new NextResponse('서버 설정 오류: ADMIN_TOKEN이 설정되지 않았습니다.', {
        status: 500,
      })
    }

    // 토큰 불일치 시 403 반환
    if (token !== adminToken) {
      return new NextResponse('접근 권한이 없습니다. 올바른 토큰을 포함한 URL을 사용하세요.', {
        status: 403,
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  // /dashboard 하위 모든 경로에 미들웨어 적용
  matcher: ['/dashboard/:path*'],
}
