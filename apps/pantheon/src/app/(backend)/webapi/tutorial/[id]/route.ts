import { NextRequest, NextResponse } from 'next/server';

import { ContentService } from '@/server/changelog';

const contentService = new ContentService();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') as any;

    const post = await contentService.getPostById(id, locale ? { locale } : undefined);

    if (!post) {
      return NextResponse.json({ error: 'Tutorial post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching tutorial post:', error);
    return NextResponse.json({ error: 'Failed to fetch tutorial post' }, { status: 500 });
  }
}
