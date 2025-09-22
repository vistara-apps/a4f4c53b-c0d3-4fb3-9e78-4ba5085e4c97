'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { SHAKE_THRESHOLD, SHAKE_TIMEOUT } from '@/lib/constants';
import { Smartphone, Zap } from 'lucide-react';

export interface ShakeDetectorProps {
  onShake: () => void;
  variant?: 'active' | 'inactive';
  disabled?: boolean;
}

export function ShakeDetector({ 
  onShake, 
  variant = 'active', 
  disabled = false 
}: ShakeDetectorProps) {
  const [isShaking, setIsShaking] = useState(false);
  const [lastShake, setLastShake] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const handleShake = useCallback(() => {
    const now = Date.now();
    if (now - lastShake < SHAKE_TIMEOUT) return;
    
    setLastShake(now);
    setIsShaking(true);
    onShake();
    
    setTimeout(() => setIsShaking(false), 500);
  }, [lastShake, onShake]);

  const handleDeviceMotion = useCallback((event: DeviceMotionEvent) => {
    if (disabled) return;
    
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const { x, y, z } = acceleration;
    const totalAcceleration = Math.sqrt(x! * x! + y! * y! + z! * z!);
    
    if (totalAcceleration > SHAKE_THRESHOLD) {
      handleShake();
    }
  }, [disabled, handleShake]);

  const requestPermission = async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
      // iOS 13+ permission request
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          setPermissionDenied(false);
        } else {
          setPermissionDenied(true);
        }
      } catch (error) {
        console.error('Error requesting device motion permission:', error);
        setPermissionDenied(true);
      }
    } else {
      // Android or older iOS - no permission needed
      setPermissionGranted(true);
    }
  };

  useEffect(() => {
    if (permissionGranted && !disabled) {
      window.addEventListener('devicemotion', handleDeviceMotion);
      return () => window.removeEventListener('devicemotion', handleDeviceMotion);
    }
  }, [permissionGranted, disabled, handleDeviceMotion]);

  // Auto-request permission on mount for non-iOS devices
  useEffect(() => {
    if (typeof DeviceMotionEvent === 'undefined') return;
    
    if (!('requestPermission' in DeviceMotionEvent)) {
      setPermissionGranted(true);
    }
  }, []);

  const handleManualShake = () => {
    if (!disabled) {
      handleShake();
    }
  };

  if (permissionDenied) {
    return (
      <div className="text-center space-y-4 p-6 bg-surface/50 rounded-lg">
        <Smartphone className="w-12 h-12 mx-auto text-text-secondary" />
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Motion Permission Required
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Enable device motion to use shake detection, or tap the button below to discover lessons.
          </p>
          <Button onClick={handleManualShake} variant="primary">
            <Zap className="w-4 h-4 mr-2" />
            Discover Lesson
          </Button>
        </div>
      </div>
    );
  }

  if (!permissionGranted) {
    return (
      <div className="text-center space-y-4 p-6 bg-surface/50 rounded-lg">
        <Smartphone className="w-12 h-12 mx-auto text-accent" />
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Enable Shake Detection
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Allow device motion access to discover lessons by shaking your phone.
          </p>
          <Button onClick={requestPermission} variant="primary">
            Enable Shake Detection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <div 
        className={`relative mx-auto w-32 h-32 rounded-full border-4 border-dashed transition-all duration-300 ${
          variant === 'active' 
            ? 'border-accent bg-accent/10' 
            : 'border-text-secondary bg-surface/50'
        } ${
          isShaking ? 'animate-shake scale-110' : ''
        } ${
          disabled ? 'opacity-50' : 'cursor-pointer hover:scale-105'
        }`}
        onClick={handleManualShake}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Smartphone 
            className={`w-12 h-12 transition-colors ${
              variant === 'active' ? 'text-accent' : 'text-text-secondary'
            } ${isShaking ? 'animate-pulse' : ''}`} 
          />
        </div>
        
        {variant === 'active' && !disabled && (
          <div className="absolute inset-0 rounded-full animate-pulse-slow">
            <div className="absolute inset-2 rounded-full border-2 border-accent/30"></div>
            <div className="absolute inset-4 rounded-full border-2 border-accent/20"></div>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {isShaking ? 'Discovering...' : 'Shake to Discover'}
        </h3>
        <p className="text-sm text-text-secondary">
          {disabled 
            ? 'Shake detection disabled'
            : isShaking 
              ? 'Finding perfect lessons nearby...'
              : 'Shake your phone or tap above to find random lessons'
          }
        </p>
      </div>
      
      <Button 
        onClick={handleManualShake}
        disabled={disabled}
        variant="secondary"
        size="sm"
      >
        <Zap className="w-4 h-4 mr-2" />
        Manual Discover
      </Button>
    </div>
  );
}
