export const LESSON_TYPES = {
  live: {
    label: 'Live Video',
    icon: '📹',
    description: 'Real-time video session',
  },
  recorded: {
    label: 'Recorded',
    icon: '🎥',
    description: 'Pre-recorded lesson',
  },
  inperson: {
    label: 'In Person',
    icon: '🤝',
    description: 'Meet face-to-face',
  },
} as const;

export const AVAILABILITY_STATUS = {
  available: {
    label: 'Available',
    color: 'text-accent',
    bgColor: 'bg-accent/20',
  },
  busy: {
    label: 'Busy',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
  },
  offline: {
    label: 'Offline',
    color: 'text-text-secondary',
    bgColor: 'bg-surface',
  },
} as const;

export const SESSION_STATUS = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-400',
  },
  active: {
    label: 'Active',
    color: 'text-accent',
  },
  completed: {
    label: 'Completed',
    color: 'text-text-secondary',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-400',
  },
} as const;

export const MOCK_SKILLS = [
  'JavaScript',
  'Python',
  'Guitar',
  'Cooking',
  'Photography',
  'Spanish',
  'Yoga',
  'Marketing',
  'Design',
  'Writing',
  'Math',
  'Chess',
  'Dancing',
  'Singing',
  'Drawing',
];

export const SHAKE_THRESHOLD = 15; // Acceleration threshold for shake detection
export const SHAKE_TIMEOUT = 1000; // Cooldown between shakes in milliseconds
