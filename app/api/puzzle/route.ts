import { NextRequest, NextResponse } from 'next/server';
import { buildPuzzle, type Language } from '@/lib/game';

const allowedLanguages: Language[] = ['en', 'de', 'fr', 'es'];
const allowedSizes = [5, 7, 9] as const;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const langParam = params.get('lang') as Language | null;
  const sizeParam = Number(params.get('size'));

  const language = allowedLanguages.includes(langParam ?? 'en') ? (langParam ?? 'en') : 'en';
  const size = allowedSizes.includes(sizeParam as (typeof allowedSizes)[number]) ? (sizeParam as 5 | 7 | 9) : 5;

  const puzzle = buildPuzzle(language, size);

  return NextResponse.json(puzzle, {
    headers: {
      'cache-control': 'no-store'
    }
  });
}
