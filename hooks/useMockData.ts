'use client';

import { useState, useEffect } from 'react';
import { User, MicroLesson, ExpertProfile } from '@/lib/types';
import { MOCK_SKILLS } from '@/lib/constants';

// Mock data generators
const generateMockUser = (id: string): User => {
  const names = ['Alex Chen', 'Sarah Johnson', 'Mike Rodriguez', 'Emma Wilson', 'David Kim', 'Lisa Zhang', 'Tom Brown', 'Anna Garcia'];
  const bios = [
    'Passionate about sharing knowledge and helping others learn',
    'Professional developer with 5+ years experience',
    'Creative designer and art enthusiast',
    'Language teacher and cultural exchange advocate',
    'Fitness instructor and wellness coach',
    'Chef specializing in international cuisine',
    'Musician and music theory expert',
    'Marketing professional and entrepreneur'
  ];

  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomBio = bios[Math.floor(Math.random() * bios.length)];
  const randomSkills = MOCK_SKILLS.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 2);

  return {
    userId: id,
    farcasterId: `fc_${id}`,
    username: randomName,
    profilePictureUrl: `https://via.placeholder.com/150/4ade80/ffffff?text=${randomName.split(' ').map(n => n[0]).join('')}`,
    bio: randomBio,
    skills: randomSkills,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
    location: {
      lat: 37.7749 + (Math.random() - 0.5) * 0.1, // San Francisco area
      lng: -122.4194 + (Math.random() - 0.5) * 0.1,
      address: `${Math.floor(Math.random() * 999) + 1} ${['Market', 'Mission', 'Valencia', 'Castro', 'Haight'][Math.floor(Math.random() * 5)]} St`
    }
  };
};

const generateMockExpertProfile = (userId: string): ExpertProfile => {
  const availabilityOptions: ExpertProfile['availability'][] = ['available', 'busy', 'offline'];
  
  return {
    userId,
    expertise: MOCK_SKILLS.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
    availability: availabilityOptions[Math.floor(Math.random() * availabilityOptions.length)],
    hourlyRate: Math.floor(Math.random() * 80) + 20, // $20-$100
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
  };
};

const generateMockLesson = (id: string, expert: User): MicroLesson => {
  const lessonTypes: MicroLesson['type'][] = ['live', 'recorded', 'inperson'];
  const titles = [
    'Quick JavaScript Tips',
    'Guitar Basics in 5 Minutes',
    'Spanish Conversation Practice',
    'Photography Composition',
    'Cooking Pasta Perfectly',
    'Yoga Breathing Techniques',
    'Marketing Strategy Basics',
    'Design Color Theory',
    'Python Functions Explained',
    'Chess Opening Moves'
  ];

  const descriptions = [
    'Learn essential concepts quickly and effectively',
    'Master the fundamentals with hands-on practice',
    'Interactive session with personalized feedback',
    'Practical tips you can apply immediately',
    'Step-by-step guidance from an expert',
    'Common mistakes and how to avoid them',
    'Real-world examples and case studies',
    'Q&A session with immediate answers'
  ];

  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  const randomType = lessonTypes[Math.floor(Math.random() * lessonTypes.length)];

  return {
    lessonId: id,
    expertUserId: expert.userId,
    title: randomTitle,
    description: randomDescription,
    durationMinutes: [3, 5, 10, 15][Math.floor(Math.random() * 4)],
    type: randomType,
    price: Math.floor(Math.random() * 20) + 5, // $5-$25
    locationTag: expert.location.address,
    isLive: randomType === 'live' && Math.random() > 0.7,
    expert
  };
};

export function useMockData() {
  const [users, setUsers] = useState<User[]>([]);
  const [experts, setExperts] = useState<ExpertProfile[]>([]);
  const [lessons, setLessons] = useState<MicroLesson[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch users
        const usersResponse = await fetch('/api/users');
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }

        // Fetch lessons
        const lessonsResponse = await fetch('/api/lessons');
        if (lessonsResponse.ok) {
          const lessonsData = await lessonsResponse.json();
          setLessons(lessonsData);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data if API fails
        const mockUsers = Array.from({ length: 20 }, (_, i) => generateMockUser(`user_${i + 1}`));
        const mockExperts = mockUsers.slice(0, 15).map(user => generateMockExpertProfile(user.userId));
        const mockLessons = Array.from({ length: 30 }, (_, i) => {
          const randomExpert = mockUsers[Math.floor(Math.random() * 15)];
          return generateMockLesson(`lesson_${i + 1}`, randomExpert);
        });

        setUsers(mockUsers);
        setExperts(mockExperts);
        setLessons(mockLessons);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRandomLessons = (count: number = 3) => {
    return lessons.sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const getNearbyLessons = (userLocation: { lat: number; lng: number }, radius: number = 10) => {
    // In a real app, this would filter by actual distance
    return lessons.slice(0, 10);
  };

  const getExpertProfile = (userId: string) => {
    return experts.find(expert => expert.userId === userId);
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.userId === userId);
  };

  return {
    users,
    experts,
    lessons,
    loading,
    getRandomLessons,
    getNearbyLessons,
    getExpertProfile,
    getUserById,
  };
}
