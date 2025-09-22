'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/minikit';
import { ShakeDetector } from '@/components/ShakeDetector';
import { LessonCard } from '@/components/LessonCard';
import { ActionCard } from '@/components/ActionCard';
import { ProfileHeader } from '@/components/ProfileHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMockData } from '@/hooks/useMockData';
import { MicroLesson, User } from '@/lib/types';
import { calculateDistance, formatDistance } from '@/lib/utils';
import { MapPin, Users, BookOpen, Zap, Star, Clock } from 'lucide-react';

export default function HomePage() {
  const { context } = useMiniKit();
  const { location, error: locationError, loading: locationLoading } = useGeolocation();
  const { lessons, loading: dataLoading, getRandomLessons, getNearbyLessons, getUserById } = useMockData();
  
  const [discoveredLessons, setDiscoveredLessons] = useState<MicroLesson[]>([]);
  const [nearbyLessons, setNearbyLessons] = useState<MicroLesson[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<User | null>(null);
  const [bookingLesson, setBookingLesson] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize user from MiniKit context
  useEffect(() => {
    if (context?.user) {
      setCurrentUser({
        userId: context.user.fid?.toString() || 'user_1',
        farcasterId: context.user.fid?.toString(),
        username: context.user.displayName || context.user.username || 'Anonymous',
        profilePictureUrl: context.user.pfpUrl,
        bio: 'Learning enthusiast',
        skills: ['Learning'],
        rating: 5.0,
        location: {
          lat: location?.lat || 37.7749,
          lng: location?.lng || -122.4194,
          address: 'San Francisco, CA'
        }
      });
    }
  }, [context, location]);

  // Load nearby lessons when location is available
  useEffect(() => {
    if (location && !dataLoading) {
      const nearby = getNearbyLessons(location, 10);
      setNearbyLessons(nearby);
    }
  }, [location, dataLoading, getNearbyLessons]);

  const handleShake = () => {
    if (!dataLoading) {
      const randomLessons = getRandomLessons(3);
      setDiscoveredLessons(randomLessons);
    }
  };

  const handleBookLesson = async (lessonId: string) => {
    setBookingLesson(lessonId);
    
    // Simulate booking process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Lesson booked successfully! You will receive a confirmation shortly.');
    } catch (error) {
      alert('Failed to book lesson. Please try again.');
    } finally {
      setBookingLesson(null);
    }
  };

  const handleViewExpert = (expertId: string) => {
    const expert = getUserById(expertId);
    if (expert) {
      setSelectedExpert(expert);
    }
  };

  const calculateLessonDistance = (lesson: MicroLesson) => {
    if (!location || !lesson.expert) return undefined;
    return calculateDistance(
      location.lat,
      location.lng,
      lesson.expert.location.lat,
      lesson.expert.location.lng
    );
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-text-secondary">Loading SkillShake...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-text-primary">
            Skill<span className="text-accent">Shake</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Learn anything, anytime, from anyone nearby. Shake to discover your next micro-lesson!
          </p>
        </div>

        {/* User Profile */}
        {currentUser && (
          <Card>
            <ProfileHeader variant="user" user={currentUser} />
          </Card>
        )}

        {/* Location Status */}
        <Card>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium text-text-primary">
                  {locationLoading ? 'Getting location...' : 
                   locationError ? 'Location unavailable' : 
                   'Location enabled'}
                </p>
                <p className="text-sm text-text-secondary">
                  {locationError || 'Finding experts near you'}
                </p>
              </div>
            </div>
            {location && (
              <Badge variant="success">
                {nearbyLessons.length} nearby
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Shake Discovery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-accent" />
              <span>Discover Random Lessons</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ShakeDetector 
              onShake={handleShake}
              variant="active"
              disabled={dataLoading}
            />
          </CardContent>
        </Card>

        {/* Discovered Lessons */}
        {discoveredLessons.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center space-x-2">
              <Star className="w-6 h-6 text-accent" />
              <span>Discovered for You</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {discoveredLessons.map((lesson) => (
                <LessonCard
                  key={lesson.lessonId}
                  lesson={lesson}
                  onBook={handleBookLesson}
                  onViewExpert={handleViewExpert}
                  distance={calculateLessonDistance(lesson)}
                  loading={bookingLesson === lesson.lessonId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Nearby Lessons */}
        {nearbyLessons.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-accent" />
              <span>Nearby Lessons</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {nearbyLessons.slice(0, 6).map((lesson) => (
                <LessonCard
                  key={lesson.lessonId}
                  lesson={lesson}
                  onBook={handleBookLesson}
                  onViewExpert={handleViewExpert}
                  distance={calculateLessonDistance(lesson)}
                  loading={bookingLesson === lesson.lessonId}
                />
              ))}
            </div>
            {nearbyLessons.length > 6 && (
              <div className="text-center">
                <Button variant="secondary">
                  View All {nearbyLessons.length} Lessons
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <ActionCard
            variant="expert"
            title="Become an Expert"
            description="Share your skills and earn money by teaching micro-lessons to others nearby."
            icon={<Users className="text-primary" />}
            action={{
              label: "Start Teaching",
              onClick: () => alert("Expert onboarding coming soon!")
            }}
          />
          <ActionCard
            variant="lesson"
            title="Browse All Lessons"
            description="Explore all available micro-lessons and find exactly what you want to learn."
            icon={<BookOpen className="text-accent" />}
            action={{
              label: "Browse Lessons",
              onClick: () => alert("Lesson browser coming soon!")
            }}
          />
        </div>

        {/* Stats */}
        <Card>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-accent">{lessons.length}</div>
                <div className="text-sm text-text-secondary">Available Lessons</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{nearbyLessons.length}</div>
                <div className="text-sm text-text-secondary">Nearby Experts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">4.8</div>
                <div className="text-sm text-text-secondary">Avg Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expert Profile Modal */}
        {selectedExpert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Expert Profile</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedExpert(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ProfileHeader
                  variant="expert"
                  user={selectedExpert}
                  expertProfile={{
                    userId: selectedExpert.userId,
                    expertise: selectedExpert.skills,
                    availability: 'available',
                    hourlyRate: 50,
                    rating: selectedExpert.rating
                  }}
                />
                <div className="mt-4 space-y-3">
                  <Button className="w-full" variant="primary">
                    Book a Lesson
                  </Button>
                  <Button className="w-full" variant="secondary">
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
