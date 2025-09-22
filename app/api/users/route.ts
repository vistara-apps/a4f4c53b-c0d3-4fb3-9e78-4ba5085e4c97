import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { User } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const farcasterId = searchParams.get('farcasterId');

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { userId },
        include: {
          expertProfile: true,
          learnerSessions: {
            include: {
              lesson: true,
              expert: true
            }
          },
          expertSessions: {
            include: {
              lesson: true,
              learner: true
            }
          }
        }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Parse JSON strings back to arrays
      const formattedUser: User & { expertProfile?: any } = {
        ...user,
        skills: JSON.parse(user.skills),
        expertProfile: user.expertProfile ? {
          ...user.expertProfile,
          expertise: JSON.parse(user.expertProfile.expertise)
        } : undefined
      };

      return NextResponse.json(formattedUser);
    }

    if (farcasterId) {
      const user = await prisma.user.findUnique({
        where: { farcasterId },
        include: {
          expertProfile: true
        }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const formattedUser: User & { expertProfile?: any } = {
        ...user,
        skills: JSON.parse(user.skills),
        expertProfile: user.expertProfile ? {
          ...user.expertProfile,
          expertise: JSON.parse(user.expertProfile.expertise)
        } : undefined
      };

      return NextResponse.json(formattedUser);
    }

    // Get all users
    const users = await prisma.user.findMany({
      include: {
        expertProfile: true
      },
      take: 50
    });

    const formattedUsers = users.map(user => ({
      ...user,
      skills: JSON.parse(user.skills),
      expertProfile: user.expertProfile ? {
        ...user.expertProfile,
        expertise: JSON.parse(user.expertProfile.expertise)
      } : undefined
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, farcasterId, username, profilePictureUrl, bio, skills, location } = body;

    if (!userId || !username) {
      return NextResponse.json({ error: 'userId and username are required' }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { userId },
      update: {
        farcasterId,
        username,
        profilePictureUrl,
        bio,
        skills: JSON.stringify(skills || []),
        locationLat: location?.lat || 0,
        locationLng: location?.lng || 0,
        locationAddress: location?.address
      },
      create: {
        userId,
        farcasterId,
        username,
        profilePictureUrl,
        bio,
        skills: JSON.stringify(skills || []),
        locationLat: location?.lat || 0,
        locationLng: location?.lng || 0,
        locationAddress: location?.address
      },
      include: {
        expertProfile: true
      }
    });

    const formattedUser = {
      ...user,
      skills: JSON.parse(user.skills),
      expertProfile: user.expertProfile ? {
        ...user.expertProfile,
        expertise: JSON.parse(user.expertProfile.expertise)
      } : undefined
    };

    return NextResponse.json(formattedUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (updates.farcasterId !== undefined) updateData.farcasterId = updates.farcasterId;
    if (updates.username !== undefined) updateData.username = updates.username;
    if (updates.profilePictureUrl !== undefined) updateData.profilePictureUrl = updates.profilePictureUrl;
    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.skills !== undefined) updateData.skills = JSON.stringify(updates.skills);
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.location) {
      updateData.locationLat = updates.location.lat;
      updateData.locationLng = updates.location.lng;
      updateData.locationAddress = updates.location.address;
    }

    const user = await prisma.user.update({
      where: { userId },
      data: updateData,
      include: {
        expertProfile: true
      }
    });

    const formattedUser = {
      ...user,
      skills: JSON.parse(user.skills),
      expertProfile: user.expertProfile ? {
        ...user.expertProfile,
        expertise: JSON.parse(user.expertProfile.expertise)
      } : undefined
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

