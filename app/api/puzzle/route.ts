import { NextRequest, NextResponse } from 'next/server';
import { buildPuzzle, type ContentProfile, type Language } from '@/lib/game';

const allowedLanguages: Language[] = ['en', 'de', 'fr', 'es'];
const allowedSizes = [5, 7, 9] as const;
const allowedProfiles: ContentProfile[] = ['standard', 'family', 'kid'];

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const langParam = params.get('lang') as Language | null;
  const sizeParam = Number(params.get('size'));
  const profileParam = params.get('profile') as ContentProfile | null;

  const language = allowedLanguages.includes(langParam ?? 'en') ? (langParam ?? 'en') : 'en';
  const size = allowedSizes.includes(sizeParam as (typeof allowedSizes)[number]) ? (sizeParam as 5 | 7 | 9) : 5;
  const profile = allowedProfiles.includes(profileParam ?? 'standard') ? (profileParam ?? 'standard') : 'standard';

  const puzzle = buildPuzzle(language, size, profile);

  return NextResponse.json(puzzle, {
    headers: {
      'cache-control': 'no-store'
    }
  });
}
