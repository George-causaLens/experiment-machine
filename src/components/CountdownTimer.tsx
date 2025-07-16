import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { 
  shouldShowCountdown, 
  getCountdownText, 
  getCountdownColor 
} from '../utils/dateUtils';

interface CountdownTimerProps {
  endDate: Date;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate, className = '' }) => {
  if (!shouldShowCountdown(endDate)) {
    return null;
  }

  return (
    <div className={`flex items-center text-sm font-medium ${getCountdownColor(endDate)} ${className}`}>
      <ClockIcon className="w-4 h-4 mr-1" />
      {getCountdownText(endDate)}
    </div>
  );
};

export default CountdownTimer; 