export const calculateDaysRemaining = (endDate: Date): number => {
  const today = new Date();
  const end = new Date(endDate);
  
  // Reset time to start of day for accurate day calculation
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const timeDiff = end.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return daysRemaining;
};

export const shouldShowCountdown = (endDate: Date): boolean => {
  const daysRemaining = calculateDaysRemaining(endDate);
  return daysRemaining <= 5 && daysRemaining >= 0;
};

export const getCountdownText = (endDate: Date): string => {
  const daysRemaining = calculateDaysRemaining(endDate);
  
  if (daysRemaining < 0) {
    return 'Ended';
  } else if (daysRemaining === 0) {
    return 'Ends today';
  } else if (daysRemaining === 1) {
    return 'Ends tomorrow';
  } else {
    return `${daysRemaining} days left`;
  }
};

export const getCountdownColor = (endDate: Date): string => {
  const daysRemaining = calculateDaysRemaining(endDate);
  
  if (daysRemaining < 0) {
    return 'text-gray-500';
  } else if (daysRemaining === 0) {
    return 'text-red-600';
  } else if (daysRemaining <= 2) {
    return 'text-orange-600';
  } else {
    return 'text-yellow-600';
  }
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

export const formatDateWithTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}; 