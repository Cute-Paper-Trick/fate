import { NextRequest, NextResponse } from 'next/server';

import { ContentService } from '@/server/changelog';

const contentService = new ContentService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // Get the full index
    const fullIndex = await contentService.getIndex();

    // Calculate pagination
    const total = fullIndex.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    // Get paginated data
    const data = fullIndex.slice(start, end);

    return NextResponse.json({
      list: data,
      currentPage: page,
      pageSize,
      totalCount: total,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching tutorial list:', error);
    return NextResponse.json({ error: 'Failed to fetch tutorial list' }, { status: 500 });
  }
}
