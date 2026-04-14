import { NextRequest, NextResponse } from 'next/server';
import { deleteBookById } from '@/lib/actions/books.actions';

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  console.log('[API] DELETE /api/books/[id] called with id:', id);
  try {
    const result = await deleteBookById(id);
    console.log('[API] deleteBookById result:', result);
    return NextResponse.json({ success: result.success });
  } catch (error) {
    console.error('[API] Error in DELETE /api/books/[id]:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
