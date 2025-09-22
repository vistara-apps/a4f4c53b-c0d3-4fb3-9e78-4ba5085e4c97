import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { HTMLAttributes } from 'react';

export interface ActionCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'lesson' | 'expert' | 'neutral';
  title: string;
  description: string;
  action: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export function ActionCard({
  className,
  variant = 'neutral',
  title,
  description,
  action,
  icon,
  badge,
  ...props
}: ActionCardProps) {
  const variants = {
    lesson: 'border-accent/30 bg-accent/5',
    expert: 'border-primary/30 bg-primary/5',
    neutral: 'border-surface',
  };

  return (
    <Card
      className={cn(
        'transition-smooth hover:shadow-card cursor-pointer',
        variants[variant],
        className
      )}
      {...props}
    >
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="flex-shrink-0 text-2xl">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text-primary truncate">
                {title}
              </h3>
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
          {badge && (
            <div className="flex-shrink-0 ml-2">
              {badge}
            </div>
          )}
        </div>
        
        <Button
          onClick={action.onClick}
          loading={action.loading}
          className="w-full"
          variant="primary"
        >
          {action.label}
        </Button>
      </CardContent>
    </Card>
  );
}
