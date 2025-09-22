import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const users = [
    {
      userId: 'user_1',
      farcasterId: 'fc_1',
      username: 'alex_chen',
      profilePictureUrl: 'https://via.placeholder.com/150/4ade80/ffffff?text=AC',
      bio: 'Passionate about sharing knowledge and helping others learn JavaScript and React',
      skills: JSON.stringify(['JavaScript', 'React', 'Node.js', 'TypeScript']),
      rating: 4.8,
      locationLat: 37.7749,
      locationLng: -122.4194,
      locationAddress: 'San Francisco, CA'
    },
    {
      userId: 'user_2',
      farcasterId: 'fc_2',
      username: 'sarah_johnson',
      profilePictureUrl: 'https://via.placeholder.com/150/8b5cf6/ffffff?text=SJ',
      bio: 'Professional developer with 5+ years experience in web development',
      skills: JSON.stringify(['Python', 'Django', 'PostgreSQL', 'AWS']),
      rating: 4.9,
      locationLat: 37.7849,
      locationLng: -122.4094,
      locationAddress: 'San Francisco, CA'
    },
    {
      userId: 'user_3',
      farcasterId: 'fc_3',
      username: 'mike_rodriguez',
      profilePictureUrl: 'https://via.placeholder.com/150/f59e0b/ffffff?text=MR',
      bio: 'Creative designer and art enthusiast specializing in UI/UX',
      skills: JSON.stringify(['Figma', 'Adobe XD', 'Sketch', 'Design Systems']),
      rating: 4.7,
      locationLat: 37.7649,
      locationLng: -122.4294,
      locationAddress: 'San Francisco, CA'
    },
    {
      userId: 'user_4',
      farcasterId: 'fc_4',
      username: 'emma_wilson',
      profilePictureUrl: 'https://via.placeholder.com/150/06b6d4/ffffff?text=EW',
      bio: 'Language teacher and cultural exchange advocate',
      skills: JSON.stringify(['Spanish', 'French', 'Italian', 'TESOL']),
      rating: 4.9,
      locationLat: 37.7549,
      locationLng: -122.4394,
      locationAddress: 'San Francisco, CA'
    },
    {
      userId: 'user_5',
      farcasterId: 'fc_5',
      username: 'david_kim',
      profilePictureUrl: 'https://via.placeholder.com/150/84cc16/ffffff?text=DK',
      bio: 'Fitness instructor and wellness coach',
      skills: JSON.stringify(['Personal Training', 'Yoga', 'Nutrition', 'Meditation']),
      rating: 4.8,
      locationLat: 37.7449,
      locationLng: -122.4494,
      locationAddress: 'San Francisco, CA'
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { userId: user.userId },
      update: {},
      create: user
    });
  }

  // Create expert profiles
  const experts = [
    {
      userId: 'user_1',
      expertise: JSON.stringify(['JavaScript', 'React', 'Web Development']),
      availability: 'available',
      hourlyRate: 75.0,
      rating: 4.8
    },
    {
      userId: 'user_2',
      expertise: JSON.stringify(['Python', 'Backend Development', 'DevOps']),
      availability: 'available',
      hourlyRate: 85.0,
      rating: 4.9
    },
    {
      userId: 'user_3',
      expertise: JSON.stringify(['UI/UX Design', 'Figma', 'Design Systems']),
      availability: 'busy',
      hourlyRate: 65.0,
      rating: 4.7
    },
    {
      userId: 'user_4',
      expertise: JSON.stringify(['Language Learning', 'Spanish', 'French']),
      availability: 'available',
      hourlyRate: 45.0,
      rating: 4.9
    },
    {
      userId: 'user_5',
      expertise: JSON.stringify(['Fitness', 'Yoga', 'Nutrition']),
      availability: 'available',
      hourlyRate: 55.0,
      rating: 4.8
    }
  ];

  for (const expert of experts) {
    await prisma.expertProfile.upsert({
      where: { userId: expert.userId },
      update: {},
      create: expert
    });
  }

  // Create micro lessons
  const lessons = [
    {
      lessonId: 'lesson_1',
      expertUserId: 'user_1',
      title: 'Quick JavaScript Tips',
      description: 'Learn essential JavaScript concepts and best practices in just 3 minutes',
      durationMinutes: 3,
      type: 'live',
      price: 5.0,
      locationTag: 'Online',
      isLive: true
    },
    {
      lessonId: 'lesson_2',
      expertUserId: 'user_1',
      title: 'React Hooks Explained',
      description: 'Master React hooks with practical examples and common patterns',
      durationMinutes: 5,
      type: 'recorded',
      price: 8.0,
      locationTag: 'Online',
      isLive: false,
      recordingUrl: 'https://example.com/react-hooks'
    },
    {
      lessonId: 'lesson_3',
      expertUserId: 'user_2',
      title: 'Python Functions Masterclass',
      description: 'Learn to write clean, efficient Python functions',
      durationMinutes: 3,
      type: 'live',
      price: 6.0,
      locationTag: 'Online',
      isLive: true
    },
    {
      lessonId: 'lesson_4',
      expertUserId: 'user_3',
      title: 'Design Color Theory',
      description: 'Understanding color psychology and harmony in design',
      durationMinutes: 5,
      type: 'recorded',
      price: 7.0,
      locationTag: 'Online',
      isLive: false,
      recordingUrl: 'https://example.com/color-theory'
    },
    {
      lessonId: 'lesson_5',
      expertUserId: 'user_4',
      title: 'Spanish Conversation Practice',
      description: 'Practice everyday Spanish conversations with a native speaker',
      durationMinutes: 10,
      type: 'live',
      price: 12.0,
      locationTag: 'Online',
      isLive: true
    },
    {
      lessonId: 'lesson_6',
      expertUserId: 'user_5',
      title: 'Quick Yoga Breathing',
      description: 'Learn breathing techniques for stress relief and focus',
      durationMinutes: 3,
      type: 'inperson',
      price: 8.0,
      locationTag: 'Golden Gate Park',
      isLive: false
    }
  ];

  for (const lesson of lessons) {
    await prisma.microLesson.upsert({
      where: { lessonId: lesson.lessonId },
      update: {},
      create: lesson
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

