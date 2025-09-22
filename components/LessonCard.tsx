import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { MicroLesson } from '@/lib/types';
import { LESSON_TYPES } from '@/lib/constants';
import { formatPrice, formatDuration } from '@/lib/utils';
import { Clock, MapPin, Star } from 'lucide-react';

export interface LessonCardProps {
  lesson: MicroLesson;
  onBook: (lessonId: string) => void;
  onViewExpert: (expertId: string) => void;
  distance?: number;
  loading?: boolean;
}

export function LessonCard({
  lesson,
  onBook,
  onViewExpert,
  distance,
  loading = false,
}: LessonCardProps) {
  const lessonType = LESSON_TYPES[lesson.type];
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card variant="elevated" className="transition-smooth hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">
              {lesson.title}
            </CardTitle>
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
              {lesson.description}
            </p>
          </div>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            {lessonType.icon} {lessonType.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Expert Info */}
        {lesson.expert && (
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-surface/50 -mx-2 px-2 py-2 rounded-md transition-smooth"
            onClick={() => onViewExpert(lesson.expertUserId)}
          >
            <Avatar size="sm">
              {lesson.expert.profilePictureUrl ? (
                <AvatarImage src={lesson.expert.profilePictureUrl} alt={lesson.expert.username} />
              ) : (
                <AvatarFallback>
                  {getInitials(lesson.expert.username)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {lesson.expert.username}
              </p>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-text-secondary">
                    {lesson.expert.rating.toFixed(1)}
                  </span>
                </div>
                {distance && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-text-secondary" />
                    <span className="text-xs text-text-secondary">
                      {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lesson Details */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-text-secondary">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(lesson.durationMinutes)}</span>
            </div>
            {lesson.isLive && (
              <Badge variant="success" size="sm">
                Live Now
              </Badge>
            )}
          </div>
          <span className="font-semibold text-accent text-lg">
            {formatPrice(lesson.price)}
          </span>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onBook(lesson.lessonId)}
          loading={loading}
          className="w-full"
          variant="primary"
        >
          Book Lesson
        </Button>
      </CardContent>
    </Card>
  );
}
