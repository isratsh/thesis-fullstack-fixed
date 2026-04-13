/**
 * Deadline Reminder & Alert System
 */

export const checkDeadlineStatus = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const daysUntil = (deadlineDate - now) / (1000 * 60 * 60 * 24);

  if (daysUntil < 0) {
    return { status: 'overdue', label: 'OVERDUE', color: '#f56565', days: Math.abs(daysUntil) };
  } else if (daysUntil <= 1) {
    return { status: 'urgent', label: 'DUE TODAY/TOMORROW', color: '#ed8936', days: daysUntil };
  } else if (daysUntil <= 7) {
    return { status: 'warning', label: 'DUE SOON', color: '#f59e0b', days: daysUntil };
  } else if (daysUntil <= 30) {
    return { status: 'alert', label: 'COMING UP', color: '#7c98ff', days: daysUntil };
  }
  return { status: 'ok', label: 'ON TRACK', color: '#48bb78', days: daysUntil };
};

export const getDeadlineReminders = (projects) => {
  const reminders = projects
    .map(p => ({
      ...p,
      deadlineInfo: checkDeadlineStatus(p.deadline)
    }))
    .filter(p => ['overdue', 'urgent', 'warning'].includes(p.deadlineInfo.status))
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  return reminders;
};

export const formatCountdown = (days) => {
  if (days < 0) {
    return `${Math.ceil(Math.abs(days))} days overdue`;
  } else if (days < 1) {
    const hours = Math.ceil(days * 24);
    return `${hours} hours left`;
  }
  return `${Math.ceil(days)} days left`;
};

export const shouldNotify = (project, lastNotified = null) => {
  const { status } = checkDeadlineStatus(project.deadline);
  
  if (status === 'overdue') return true;
  if (status === 'urgent') return true;
  if (status === 'warning' && !lastNotified) return true;
  
  const lastNotifyTime = lastNotified ? new Date(lastNotified) : null;
  const now = new Date();
  
  if (lastNotifyTime) {
    const hoursSinceNotify = (now - lastNotifyTime) / (1000 * 60 * 60);
    return hoursSinceNotify >= 24;
  }
  
  return true;
};

export const generateNotificationMessage = (project, userRole = 'student') => {
  const { status, days } = checkDeadlineStatus(project.deadline);
  const countdown = formatCountdown(days);

  const messages = {
    student: {
      overdue: `Your thesis "${project.title}" is ${countdown}. Submit immediately!`,
      urgent: `Submit your thesis "${project.title}" ${countdown}! ⏰`,
      warning: `Remember: "${project.title}" is due ${countdown}.`
    },
    supervisor: {
      overdue: `Student thesis "${project.title}" is ${countdown} overdue.`,
      urgent: `Review needed: "${project.title}" due ${countdown}.`,
      warning: `Upcoming: "${project.title}" due ${countdown}.`
    },
    admin: {
      overdue: `Project "${project.title}" is ${countdown} overdue.`,
      urgent: `Alert: "${project.title}" due ${countdown}.`,
      warning: `Monitoring: "${project.title}" due ${countdown}.`
    }
  };

  return messages[userRole]?.[status] || messages.student[status];
};

/**
 * Activity Timeline Component Data
 */
export const generateActivityLog = (events = []) => {
  return events
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map(event => ({
      ...event,
      timeAgo: getTimeAgo(event.timestamp),
      icon: getActivityIcon(event.type)
    }));
};

const getTimeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = (now - date) / 1000;

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
};

const getActivityIcon = (type) => {
  const icons = {
    'submission': '📤',
    'review': '📝',
    'comment': '💬',
    'status_change': '🔄',
    'deadline_set': '⏰',
    'approval': '✅',
    'rejection': '❌',
    'notification': '🔔',
    'meeting': '📅',
    'file_upload': '📎'
  };
  return icons[type] || '📌';
};
