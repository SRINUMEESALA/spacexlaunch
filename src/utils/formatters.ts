export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
};

export const formatRelativeDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  } catch {
    return 'Invalid date';
  }
};

export const getLaunchStatus = (launch: {
  upcoming: boolean;
  success?: boolean;
  failures: unknown[];
}): { status: string; color: string } => {
  if (launch.upcoming) {
    return { status: 'Upcoming', color: '#007AFF' };
  }

  if (launch.success === true) {
    return { status: 'Successful', color: '#34C759' };
  }

  if (launch.success === false || launch.failures.length > 0) {
    return { status: 'Failed', color: '#FF3B30' };
  }

  return { status: 'Unknown', color: '#8E8E93' };
};

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};
