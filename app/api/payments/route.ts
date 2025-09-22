import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, amount, currency = 'USD' } = body;

    if (!sessionId || !amount) {
      return NextResponse.json({
        error: 'sessionId and amount are required'
      }, { status: 400 });
    }

    // Verify session exists
    const session = await prisma.session.findUnique({
      where: { sessionId },
      include: {
        lesson: true,
        learner: true,
        expert: true
      }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.paymentStatus === 'paid') {
      return NextResponse.json({ error: 'Session already paid' }, { status: 400 });
    }

    // In a real implementation, this would integrate with a payment processor
    // For now, we'll simulate a successful payment
    const paymentResult = {
      success: true,
      transactionId: `txn_${Date.now()}`,
      amount,
      currency,
      timestamp: new Date().toISOString()
    };

    // Update session payment status
    await prisma.session.update({
      where: { sessionId },
      data: {
        paymentStatus: 'paid'
      }
    });

    // Create notification for expert
    await prisma.notification.create({
      data: {
        userId: session.expertUserId,
        message: `Payment received for lesson: ${session.lesson.title}`,
        timestamp: new Date()
      }
    });

    return NextResponse.json({
      ...paymentResult,
      sessionId,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const session = await prisma.session.findUnique({
      where: { sessionId },
      select: {
        sessionId: true,
        paymentStatus: true,
        lesson: {
          select: {
            title: true,
            price: true
          }
        }
      }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      sessionId: session.sessionId,
      paymentStatus: session.paymentStatus,
      amount: session.lesson.price,
      title: session.lesson.title
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

