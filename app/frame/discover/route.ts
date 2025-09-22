import { NextRequest, NextResponse } from 'next/server';
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL } from '@/lib/constants';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get a random lesson from the database
    const lessonCount = await prisma.microLesson.count();
    const randomOffset = Math.floor(Math.random() * lessonCount);

    const randomLesson = await prisma.microLesson.findFirst({
      skip: randomOffset,
      include: {
        expert: {
          include: {
            user: true
          }
        }
      }
    });

    if (!randomLesson) {
      return NextResponse.json({ error: 'No lessons available' }, { status: 404 });
    }

    const lesson = {
      ...randomLesson,
      expert: {
        ...randomLesson.expert,
        expertise: JSON.parse(randomLesson.expert.expertise),
        user: randomLesson.expert.user
      }
    };

    const lessonTitle = lesson.title.length > 30 ? lesson.title.substring(0, 27) + '...' : lesson.title;
    const expertName = lesson.expert.user.username;

    const html = getFrameHtmlResponse({
      buttons: [
        {
          action: 'post',
          label: 'Book Now',
          target: `${NEXT_PUBLIC_URL}/frame/book/${lesson.lessonId}`
        },
        {
          action: 'post',
          label: 'Shake Again',
          target: `${NEXT_PUBLIC_URL}/frame/discover`
        },
        {
          action: 'post',
          label: 'View Profile',
          target: `${NEXT_PUBLIC_URL}/frame/expert/${lesson.expertUserId}`
        }
      ],
      image: `${NEXT_PUBLIC_URL}/api/og/lesson?lessonId=${lesson.lessonId}`,
      postUrl: `${NEXT_PUBLIC_URL}/frame/discover`
    });

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      }
    });
  } catch (error) {
    console.error('Error handling discover request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

