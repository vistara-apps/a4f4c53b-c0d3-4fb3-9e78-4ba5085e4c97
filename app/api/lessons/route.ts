import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { MicroLesson } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const expertUserId = searchParams.get('expertUserId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (lessonId) {
      const lesson = await prisma.microLesson.findUnique({
        where: { lessonId },
        include: {
          expert: {
            include: {
              user: true
            }
          },
          sessions: {
            include: {
              learner: true,
              expert: true
            }
          }
        }
      });

      if (!lesson) {
        return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
      }

      const formattedLesson: MicroLesson & { expert: any; sessions: any[] } = {
        ...lesson,
        expert: {
          ...lesson.expert,
          expertise: JSON.parse(lesson.expert.expertise),
          user: lesson.expert.user
        }
      };

      return NextResponse.json(formattedLesson);
    }

    // Build where clause
    const where: any = {};
    if (expertUserId) {
      where.expertUserId = expertUserId;
    }
    if (type) {
      where.type = type;
    }

    const lessons = await prisma.microLesson.findMany({
      where,
      include: {
        expert: {
          include: {
            user: true
          }
        }
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedLessons = lessons.map(lesson => ({
      ...lesson,
      expert: {
        ...lesson.expert,
        expertise: JSON.parse(lesson.expert.expertise),
        user: lesson.expert.user
      }
    }));

    return NextResponse.json(formattedLessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      expertUserId,
      title,
      description,
      durationMinutes,
      type,
      price,
      locationTag,
      isLive,
      recordingUrl
    } = body;

    if (!expertUserId || !title || !description) {
      return NextResponse.json({
        error: 'expertUserId, title, and description are required'
      }, { status: 400 });
    }

    // Verify expert exists
    const expert = await prisma.expertProfile.findUnique({
      where: { userId: expertUserId }
    });

    if (!expert) {
      return NextResponse.json({ error: 'Expert profile not found' }, { status: 404 });
    }

    const lesson = await prisma.microLesson.create({
      data: {
        expertUserId,
        title,
        description,
        durationMinutes: durationMinutes || 3,
        type: type || 'live',
        price: price || 5.0,
        locationTag,
        isLive: isLive || false,
        recordingUrl
      },
      include: {
        expert: {
          include: {
            user: true
          }
        }
      }
    });

    const formattedLesson = {
      ...lesson,
      expert: {
        ...lesson.expert,
        expertise: JSON.parse(lesson.expert.expertise),
        user: lesson.expert.user
      }
    };

    return NextResponse.json(formattedLesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonId, ...updates } = body;

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.durationMinutes !== undefined) updateData.durationMinutes = updates.durationMinutes;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.locationTag !== undefined) updateData.locationTag = updates.locationTag;
    if (updates.isLive !== undefined) updateData.isLive = updates.isLive;
    if (updates.recordingUrl !== undefined) updateData.recordingUrl = updates.recordingUrl;

    const lesson = await prisma.microLesson.update({
      where: { lessonId },
      data: updateData,
      include: {
        expert: {
          include: {
            user: true
          }
        }
      }
    });

    const formattedLesson = {
      ...lesson,
      expert: {
        ...lesson.expert,
        expertise: JSON.parse(lesson.expert.expertise),
        user: lesson.expert.user
      }
    };

    return NextResponse.json(formattedLesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
    }

    await prisma.microLesson.delete({
      where: { lessonId }
    });

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

