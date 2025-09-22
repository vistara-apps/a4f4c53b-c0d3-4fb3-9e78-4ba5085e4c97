import { NextRequest, NextResponse } from 'next/server';
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate frame message
    // In production, you should validate the frame message signature

    const html = getFrameHtmlResponse({
      buttons: [
        {
          action: 'post',
          label: 'Shake to Discover',
          target: `${NEXT_PUBLIC_URL}/frame/discover`
        },
        {
          action: 'post',
          label: 'Browse Lessons',
          target: `${NEXT_PUBLIC_URL}/frame/browse`
        },
        {
          action: 'post',
          label: 'Become Expert',
          target: `${NEXT_PUBLIC_URL}/frame/expert`
        }
      ],
      image: `${NEXT_PUBLIC_URL}/api/og`,
      postUrl: `${NEXT_PUBLIC_URL}/frame`
    });

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      }
    });
  } catch (error) {
    console.error('Error handling frame request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const html = getFrameHtmlResponse({
    buttons: [
      {
        action: 'post',
        label: 'Shake to Discover',
        target: `${NEXT_PUBLIC_URL}/frame/discover`
      },
      {
        action: 'post',
        label: 'Browse Lessons',
        target: `${NEXT_PUBLIC_URL}/frame/browse`
      },
      {
        action: 'post',
        label: 'Become Expert',
        target: `${NEXT_PUBLIC_URL}/frame/expert`
      }
    ],
    image: `${NEXT_PUBLIC_URL}/api/og`,
    postUrl: `${NEXT_PUBLIC_URL}/frame`
  });

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html'
    }
  });
}
