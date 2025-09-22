export interface User {
  userId: string;
  farcasterId?: string;
  username: string;
  profilePictureUrl?: string;
  bio: string;
  skills: string[];
  rating: number;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface ExpertProfile {
  userId: string;
  expertise: string[];
  availability: string;
  hourlyRate: number;
  rating: number;
}

export interface MicroLesson {
  lessonId: string;
  expertUserId: string;
  title: string;
  description: string;
  durationMinutes: number;
  type: 'live' | 'recorded' | 'inperson';
  price: number;
  locationTag?: string;
  isLive: boolean;
  recordingUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  expert?: ExpertProfile & { user: User };
}

export interface Session {
  sessionId: string;
  lessonId: string;
  learnerUserId: string;
  expertUserId: string;
  startTime: Date;
  endTime?: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  rating?: number;
  review?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lesson?: MicroLesson;
  learner?: User;
  expert?: User;
}

export interface Notification {
  notificationId: string;
  userId: string;
  message: string;
  timestamp: Date;
  readStatus: boolean;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

