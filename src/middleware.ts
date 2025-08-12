import { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { securityMiddleware, rateLimitMiddleware, corsMiddleware } from './middleware/security';

export default withAuth(
  function middleware(request: NextRequest) {
    // Apply CORS middleware
    const corsResponse = corsMiddleware(request);
    if (corsResponse) return corsResponse;

    // Apply rate limiting middleware
    const rateLimitResponse = rateLimitMiddleware(request);
    if (rateLimitResponse) return rateLimitResponse;

    // Apply security headers
    return securityMiddleware(request);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/auth/login',
          '/auth/register',
          '/api/auth',
          '/api/health',
        ];

        // Check if the route is public
        const isPublicRoute = publicRoutes.some(route => 
          pathname.startsWith(route) || pathname === route
        );

        // Allow access to public routes
        if (isPublicRoute) {
          return true;
        }

        // For protected routes, require authentication
        return !!token;
      },
    },
    pages: {
      signIn: '/auth/login',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
