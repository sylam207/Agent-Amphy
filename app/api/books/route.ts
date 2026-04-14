import { NextRequest, NextResponse } from 'next/server';
import { getBooks } from '@/lib/actions/books.actions';

export async function GET(req: NextRequest) {
  try {
    const result = await getBooks();
    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    }
    return NextResponse.json({ success: false, error: result.error || 'Unknown error' }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
