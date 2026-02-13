import { NextRequest, NextResponse } from 'next/server';
import { buildPuzzle, type ContentProfile, type Language } from '@/lib/game';

const allowedLanguages: Language[] = ['en', 'de', 'fr', 'es'];
const allowedSizes = [5, 7, 9] as const;
const allowedProfiles: ContentProfile[] = ['standard', 'family', 'kid'];

export const runtime = 'edge';

const bucket = new Map<string, { count: number; resetAt: number }>();

function getRateLimitConfig() {
  const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 120);
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
  return {
    maxRequests: Number.isFinite(maxRequests) && maxRequests > 0 ? maxRequests : 120,
    windowMs: Number.isFinite(windowMs) && windowMs > 0 ? windowMs : 60_000
  };
}

function hardeningHeaders(): HeadersInit {
  return {
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=()',
    'content-security-policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'"
  };
}

function tooManyRequestsResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: 'rate_limited' },
    {
      status: 429,
      headers: {
        ...hardeningHeaders(),
        'retry-after': String(retryAfterSeconds)
      }
    }
  );
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const now = Date.now();
  const { maxRequests, windowMs } = getRateLimitConfig();
  const record = bucket.get(ip);
  if (!record || record.resetAt <= now) {
    bucket.set(ip, { count: 1, resetAt: now + windowMs });
  } else {
    record.count += 1;
    if (record.count > maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
      return tooManyRequestsResponse(Math.max(1, retryAfterSeconds));
    }
  }

  const params = request.nextUrl.searchParams;
  const langParam = params.get('lang') as Language | null;
  const sizeRaw = params.get('size');
  if (sizeRaw && !/^\d+$/.test(sizeRaw)) {
    return NextResponse.json({ error: 'invalid_size' }, { status: 400, headers: hardeningHeaders() });
  }
  const sizeParam = Number(sizeRaw);
  const profileParam = params.get('profile') as ContentProfile | null;

  const language = allowedLanguages.includes(langParam ?? 'en') ? (langParam ?? 'en') : 'en';
  const size = allowedSizes.includes(sizeParam as (typeof allowedSizes)[number]) ? (sizeParam as 5 | 7 | 9) : 5;
  const profile = allowedProfiles.includes(profileParam ?? 'standard') ? (profileParam ?? 'standard') : 'standard';

  const puzzle = buildPuzzle(language, size, profile);

  return NextResponse.json(puzzle, {
    headers: hardeningHeaders()
  });
}
