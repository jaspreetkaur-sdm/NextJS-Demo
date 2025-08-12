import { NextRequest, NextResponse } from 'next/server';
import { env } from '../lib/constants/env';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Strict Transport Security (only in production with HTTPS)
  if (env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Adjust for Next.js needs
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export function rateLimitMiddleware(request: NextRequest): NextResponse | null {
  const ip = request.ip ?? request.headers.get('X-Forwarded-For') ?? 'anonymous';
  const now = Date.now();
  const windowMs = env.RATE_LIMIT_WINDOW_MS;
  const maxRequests = env.RATE_LIMIT_MAX;

  // Clean up old entries
  const cutoff = now - windowMs;
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < cutoff) {
      rateLimitStore.delete(key);
    }
  }

  // Check current requests
  const key = `${ip}:${Math.floor(now / windowMs)}`;
  const current = rateLimitStore.get(key) ?? { count: 0, resetTime: now + windowMs };

  if (current.count >= maxRequests) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString(),
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': current.resetTime.toString(),
      },
    });
  }

  // Increment counter
  rateLimitStore.set(key, {
    count: current.count + 1,
    resetTime: current.resetTime,
  });

  return null; // Continue processing
}

export function corsMiddleware(request: NextRequest): NextResponse | null {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    
    response.headers.set('Access-Control-Allow-Origin', env.ALLOWED_ORIGINS);
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  }

  return null; // Continue processing
}
