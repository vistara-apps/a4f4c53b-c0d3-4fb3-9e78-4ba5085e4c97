import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Session } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (sessionId) {
      const session = await prisma.session.findUnique({
        where: { sessionId },
        include: {
          lesson: {
            include: {
              expert: {
                include: {
                  user: true
                }
              }
            }
          },
          learner: true,
          expert: true
        }
      });

      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      const formattedSession: Session & { lesson: any; learner: any; expert: any } = {
        ...session,
        lesson: {
          ...session.lesson,
          expert: {
            ...session.lesson.expert,
            expertise: JSON.parse(session.lesson.expert.expertise),
            user: session.lesson.expert.user
          }
        },
        learner: {
          ...session.learner,
          skills: JSON.parse(session.learner.skills)
        },
        expert: {
          ...session.expert,
          skills: JSON.parse(session.expert.skills)
        }
      };

      return NextResponse.json(formattedSession);
    }

    // Build where clause
    const where: any = {};
    if (userId) {
      where.OR = [
        { learnerUserId: userId },
        { expertUserId: userId }
      ];
    }
    if (status) {
      where.status = status;
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        lesson: {
          include: {
            expert: {
              include: {
                user: true
              }
            }
          }
        },
        learner: true,
        expert: true
      },
      take: limit,
      skip: offset,
      orderBy: {
        startTime: 'desc'
      }
    });

    const formattedSessions = sessions.map(session => ({
      ...session,
      lesson: {
        ...session.lesson,
        expert: {
          ...session.lesson.expert,
          expertise: JSON.parse(session.lesson.expert.expertise),
          user: session.lesson.expert.user
        }
      },
      learner: {
        ...session.learner,
        skills: JSON.parse(session.learner.skills)
      },
      expert: {
        ...session.expert,
        skills: JSON.parse(session.expert.skills)
      }
    }));

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lessonId,
      learnerUserId,
      expertUserId,
      startTime,
      status,
      paymentStatus
    } = body;

    if (!lessonId || !learnerUserId || !expertUserId || !startTime) {
      return NextResponse.json({
        error: 'lessonId, learnerUserId, expertUserId, and startTime are required'
      }, { status: 400 });
    }

    // Verify lesson exists
    const lesson = await prisma.microLesson.findUnique({
      where: { lessonId }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Verify users exist
    const [learner, expert] = await Promise.all([
      prisma.user.findUnique({ where: { userId: learnerUserId } }),
      prisma.user.findUnique({ where: { userId: expertUserId } })
    ]);

    if (!learner || !expert) {
      return NextResponse.json({ error: 'Learner or expert not found' }, { status: 404 });
    }

    const session = await prisma.session.create({
      data: {
        lessonId,
        learnerUserId,
        expertUserId,
        startTime: new Date(startTime),
        status: status || 'pending',
        paymentStatus: paymentStatus || 'pending'
      },
      include: {
        lesson: {
          include: {
            expert: {
              include: {
                user: true
              }
            }
          }
        },
        learner: true,
        expert: true
      }
    });

    const formattedSession = {
      ...session,
      lesson: {
        ...session.lesson,
        expert: {
          ...session.lesson.expert,
          expertise: JSON.parse(session.lesson.expert.expertise),
          user: session.lesson.expert.user
        }
      },
      learner: {
        ...session.learner,
        skills: JSON.parse(session.learner.skills)
      },
      expert: {
        ...session.expert,
        skills: JSON.parse(session.expert.skills)
      }
    };

    return NextResponse.json(formattedSession, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, ...updates } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (updates.startTime !== undefined) updateData.startTime = new Date(updates.startTime);
    if (updates.endTime !== undefined) updateData.endTime = updates.endTime ? new Date(updates.endTime) : null;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.paymentStatus !== undefined) updateData.paymentStatus = updates.paymentStatus;
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.review !== undefined) updateData.review = updates.review;

    const session = await prisma.session.update({
      where: { sessionId },
      data: updateData,
      include: {
        lesson: {
          include: {
            expert: {
              include: {
                user: true
              }
            }
          }
        },
        learner: true,
        expert: true
      }
    });

    const formattedSession = {
      ...session,
      lesson: {
        ...session.lesson,
        expert: {
          ...session.lesson.expert,
          expertise: JSON.parse(session.lesson.expert.expertise),
          user: session.lesson.expert.user
        }
      },
      learner: {
        ...session.learner,
        skills: JSON.parse(session.learner.skills)
      },
      expert: {
        ...session.expert,
        skills: JSON.parse(session.expert.skills)
      }
    };

    return NextResponse.json(formattedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

