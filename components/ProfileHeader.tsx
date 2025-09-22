import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { User, ExpertProfile } from '@/lib/types';
import { AVAILABILITY_STATUS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { Star, MapPin } from 'lucide-react';

export interface ProfileHeaderProps {
  variant: 'user' | 'expert';
  user: User;
  expertProfile?: ExpertProfile;
  showLocation?: boolean;
}

export function ProfileHeader({
  variant,
  user,
  expertProfile,
  showLocation = true,
}: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium text-text-primary">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="flex items-start space-x-4 p-4">
      <Avatar size="lg">
        {user.profilePictureUrl ? (
          <AvatarImage src={user.profilePictureUrl} alt={user.username} />
        ) : (
          <AvatarFallback>
            {getInitials(user.username)}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary truncate">
            {user.username}
          </h2>
          {variant === 'expert' && expertProfile && (
            <Badge
              variant={
                expertProfile.availability === 'available' ? 'success' :
                expertProfile.availability === 'busy' ? 'warning' : 'secondary'
              }
            >
              {AVAILABILITY_STATUS[expertProfile.availability].label}
            </Badge>
          )}
        </div>

        {user.bio && (
          <p className="text-sm text-text-secondary line-clamp-2">
            {user.bio}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {renderRating(user.rating)}
            
            {variant === 'expert' && expertProfile && (
              <span className="text-sm font-medium text-accent">
                {formatPrice(expertProfile.hourlyRate)}/hr
              </span>
            )}
          </div>

          {showLocation && user.location.address && (
            <div className="flex items-center space-x-1 text-text-secondary">
              <MapPin className="w-4 h-4" />
              <span className="text-sm truncate max-w-32">
                {user.location.address}
              </span>
            </div>
          )}
        </div>

        {user.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {user.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" size="sm">
                {skill}
              </Badge>
            ))}
            {user.skills.length > 3 && (
              <Badge variant="secondary" size="sm">
                +{user.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
