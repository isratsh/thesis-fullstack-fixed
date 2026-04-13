/**
 * Components Integration Index
 * Central registry of all new feature components
 * 
 * Usage:
 * import { getComponent, getAllComponents, getComponentsByCategory } from './components/index';
 * 
 * const DocumentTracker = getComponent('DocumentStatusTracker');
 * const allComponents = getAllComponents();
 */

export const COMPONENTS_REGISTRY = {
  // Document Management
  DocumentStatusTracker: {
    name: 'DocumentStatusTracker',
    path: './DocumentStatusTracker',
    category: 'document-management',
    icon: '📄',
    description: 'Track document status, progress, reviews, and feedback',
    features: ['progress-tracking', 'status-management', 'version-control', 'feedback-system'],
    props: {
      documents: 'Array of document objects',
      onUpdateStatus: 'Callback when status changes'
    },
    dependencies: []
  },

  // Notifications & Alerts
  NotificationCenter: {
    name: 'NotificationCenter',
    path: './NotificationCenter',
    category: 'notifications',
    icon: '🔔',
    description: 'Comprehensive notification management with filtering and categories',
    features: ['notification-filtering', 'priority-sorting', 'read-tracking', 'action-buttons'],
    props: {
      notifications: 'Array of notification objects',
      onMarkAsRead: 'Callback for marking notifications'
    },
    dependencies: []
  },

  // Meeting Management
  AdvancedMeetingManager: {
    name: 'AdvancedMeetingManager',
    path: './AdvancedMeetingManager',
    category: 'meetings',
    icon: '📅',
    description: 'Schedule and manage meetings with attendees and agendas',
    features: ['meeting-scheduling', 'attendee-management', 'agenda-setting', 'meeting-types'],
    props: {
      meetings: 'Array of meeting objects',
      onScheduleMeeting: 'Callback when meeting is scheduled'
    },
    dependencies: []
  },

  // Analytics & Statistics
  DetailedProjectAnalytics: {
    name: 'DetailedProjectAnalytics',
    path: './DetailedProjectAnalytics',
    category: 'analytics',
    icon: '📊',
    description: 'Advanced analytics with charts, statistics, and project insights',
    features: ['bar-charts', 'pie-charts', 'trend-analysis', 'kpi-metrics'],
    props: {
      projectStats: 'Object with project statistics'
    },
    dependencies: []
  },

  // Task Management
  TaskManager: {
    name: 'TaskManager',
    path: './TaskManager',
    category: 'task-management',
    icon: '✅',
    description: 'Create, manage, and track tasks with priorities and categories',
    features: ['task-creation', 'priority-management', 'category-filtering', 'progress-tracking'],
    props: {
      tasks: 'Array of task objects',
      onAddTask: 'Callback when task is added',
      onUpdateTask: 'Callback when task is updated',
      onCompleteTask: 'Callback when task is completed'
    },
    dependencies: []
  },

  // Resource Library
  ResourceLibrary: {
    name: 'ResourceLibrary',
    path: './ResourceLibrary',
    category: 'resources',
    icon: '📚',
    description: 'Browse and manage research resources, tutorials, and materials',
    features: ['resource-search', 'category-filtering', 'popularity-rating', 'tagging'],
    props: {
      resources: 'Array of resource objects'
    },
    dependencies: []
  },

  // Collaboration
  CollaborationBoard: {
    name: 'CollaborationBoard',
    path: './CollaborationBoard',
    category: 'collaboration',
    icon: '🤝',
    description: 'Collaborate with team members, view activity, and discuss projects',
    features: ['member-management', 'activity-tracking', 'discussion-board', 'role-assignment'],
    props: {
      collaborators: 'Array of collaborator objects',
      tasks: 'Array of task objects',
      onAddComment: 'Callback when comment is added'
    },
    dependencies: []
  },

  // Performance Metrics
  PerformanceMetrics: {
    name: 'PerformanceMetrics',
    path: './PerformanceMetrics',
    category: 'performance',
    icon: '📈',
    description: 'Monitor performance metrics, scores, and trends',
    features: ['score-tracking', 'trend-analysis', 'category-breakdown', 'grade-system'],
    props: {
      metrics: 'Object with performance metrics'
    },
    dependencies: []
  },

  // Search & Filter
  SearchService: {
    name: 'SearchService',
    path: '../services/search',
    category: 'utilities',
    icon: '🔍',
    description: 'Global search and filtering utilities for projects and users',
    features: ['project-search', 'user-search', 'filtering', 'sorting'],
    isService: true,
    methods: ['searchProjects', 'searchUsers', 'filterByStatus', 'filterByDateRange', 'sortBy']
  },

  // Export & Reports
  ExportService: {
    name: 'ExportService',
    path: '../services/export',
    category: 'utilities',
    icon: '📥',
    description: 'Export project data to PDF and CSV formats',
    features: ['pdf-export', 'csv-export', 'report-generation'],
    isService: true,
    methods: ['generatePDFContent', 'downloadPDF', 'exportToCSV', 'generateReport']
  },

  // Reminders & Notifications
  RemindersService: {
    name: 'RemindersService',
    path: '../services/reminders',
    category: 'utilities',
    icon: '⏰',
    description: 'Manage deadline tracking, notifications, and activity logging',
    features: ['deadline-tracking', 'notifications', 'activity-logging', 'countdown-formatting'],
    isService: true,
    methods: ['checkDeadlineStatus', 'getDeadlineReminders', 'shouldNotify', 'generateActivityLog']
  }
};

/**
 * Get a component from registry
 * @param {string} componentName - Name of the component
 * @returns {object} Component configuration
 */
export const getComponent = (componentName) => {
  return COMPONENTS_REGISTRY[componentName] || null;
};

/**
 * Get all components
 * @returns {array} Array of all component configurations
 */
export const getAllComponents = () => {
  return Object.values(COMPONENTS_REGISTRY);
};

/**
 * Get components by category
 * @param {string} category - Category name
 * @returns {array} Filtered components
 */
export const getComponentsByCategory = (category) => {
  return Object.values(COMPONENTS_REGISTRY).filter(comp => comp.category === category);
};

/**
 * Get all categories
 * @returns {array} Unique category names
 */
export const getCategories = () => {
  return [...new Set(Object.values(COMPONENTS_REGISTRY).map(comp => comp.category))];
};

/**
 * Get components by feature
 * @param {string} feature - Feature name
 * @returns {array} Components with this feature
 */
export const getComponentsByFeature = (feature) => {
  return Object.values(COMPONENTS_REGISTRY).filter(comp =>
    comp.features && comp.features.includes(feature)
  );
};

/**
 * Display component information
 * @param {string} componentName - Component name
 */
export const displayComponentInfo = (componentName) => {
  const component = getComponent(componentName);
  if (!component) {
    console.log(`Component '${componentName}' not found`);
    return;
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`${component.icon} ${component.name}`);
  console.log(`${'='.repeat(50)}`);
  console.log(`📝 Description: ${component.description}`);
  console.log(`📂 Category: ${component.category}`);

  if (component.features) {
    console.log(`✨ Features:`);
    component.features.forEach(f => console.log(`   • ${f}`));
  }

  if (component.methods) {
    console.log(`🔧 Methods:`);
    component.methods.forEach(m => console.log(`   • ${m}()`));
  }

  if (component.props) {
    console.log(`📦 Props:`);
    Object.entries(component.props).forEach(([prop, desc]) => {
      console.log(`   • ${prop}: ${desc}`);
    });
  }

  console.log(`${'='.repeat(50)}\n`);
};

/**
 * Display all components summary
 */
export const displayAllComponentsSummary = () => {
  const components = getAllComponents();
  const categories = getCategories();

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 COMPONENTS INTEGRATION SUMMARY`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total Components: ${components.length}`);
  console.log(`Total Categories: ${categories.length}\n`);

  categories.forEach(category => {
    const comps = getComponentsByCategory(category);
    console.log(`${category.toUpperCase()}: (${comps.length})`);
    comps.forEach(comp => {
      console.log(`  ${comp.icon} ${comp.name}`);
    });
    console.log();
  });

  console.log(`${'='.repeat(60)}\n`);
};

/**
 * Get import statements for all components
 * @returns {string} Import statements
 */
export const getImportStatements = () => {
  const statements = [];
  Object.values(COMPONENTS_REGISTRY).forEach(comp => {
    if (!comp.isService) {
      statements.push(`import ${comp.name} from '.${comp.path}';`);
    } else {
      statements.push(`import * as ${comp.name.replace('Service', '')} from '.${comp.path}';`);
    }
  });
  return statements.join('\n');
};

/**
 * Get usage examples
 * @returns {string} Usage examples
 */
export const getUsageExamples = () => {
  return `
// Usage Examples for New Components

// 1. Document Status Tracker
import DocumentStatusTracker from './components/DocumentStatusTracker';

<DocumentStatusTracker 
  documents={projectDocuments}
  onUpdateStatus={(docId, status) => updateDocStatus(docId, status)}
/>

// 2. Notification Center
import NotificationCenter from './components/NotificationCenter';

<NotificationCenter 
  notifications={userNotifications}
/>

// 3. Advanced Meeting Manager
import AdvancedMeetingManager from './components/AdvancedMeetingManager';

<AdvancedMeetingManager 
  meetings={scheduledMeetings}
  onScheduleMeeting={(meeting) => saveMeeting(meeting)}
/>

// 4. Detailed Project Analytics
import DetailedProjectAnalytics from './components/DetailedProjectAnalytics';

<DetailedProjectAnalytics 
  projectStats={projectStatistics}
/>

// 5. Task Manager
import TaskManager from './components/TaskManager';

<TaskManager 
  tasks={userTasks}
  onAddTask={(task) => createTask(task)}
  onUpdateTask={(taskId, updates) => updateTask(taskId, updates)}
  onCompleteTask={(taskId) => completeTask(taskId)}
/>

// 6. Resource Library
import ResourceLibrary from './components/ResourceLibrary';

<ResourceLibrary 
  resources={availableResources}
/>

// 7. Collaboration Board
import CollaborationBoard from './components/CollaborationBoard';

<CollaborationBoard 
  collaborators={teamMembers}
  tasks={projectTasks}
  onAddComment={(comment) => saveComment(comment)}
/>

// 8. Performance Metrics
import PerformanceMetrics from './components/PerformanceMetrics';

<PerformanceMetrics 
  metrics={userMetrics}
/>

// Service Usage Examples

// Search & Filter Service
import * as SearchUtils from './services/search';

const results = SearchUtils.searchProjects('machine learning');
const filtered = SearchUtils.filterByStatus(projects, 'active');

// Export Service
import * as ExportUtils from './services/export';

ExportUtils.downloadPDF(projectData, 'project-report.pdf');
ExportUtils.exportToCSV(projects, 'projects.csv');

// Reminders Service
import * as RemindersUtils from './services/reminders';

const reminders = RemindersUtils.getDeadlineReminders(projects);
const status = RemindersUtils.checkDeadlineStatus(project);
  `;
};

// Export default registry
export default COMPONENTS_REGISTRY;
