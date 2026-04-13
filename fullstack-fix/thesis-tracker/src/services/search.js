/**
 * Global Search & Filter Service
 * Provides search functionality across the application
 */

export const searchProjects = (projects, query) => {
  if (!query) return projects;
  
  const lower = query.toLowerCase();
  return projects.filter(p => 
    p.title?.toLowerCase().includes(lower) ||
    p.description?.toLowerCase().includes(lower) ||
    p.studentName?.toLowerCase().includes(lower) ||
    p.status?.toLowerCase().includes(lower)
  );
};

export const searchUsers = (users, query) => {
  if (!query) return users;
  
  const lower = query.toLowerCase();
  return users.filter(u =>
    u.name?.toLowerCase().includes(lower) ||
    u.email?.toLowerCase().includes(lower) ||
    u.role?.toLowerCase().includes(lower)
  );
};

export const filterByStatus = (items, status) => {
  if (!status) return items;
  return items.filter(i => i.status === status);
};

export const filterByDateRange = (items, startDate, endDate) => {
  if (!startDate || !endDate) return items;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return items.filter(i => {
    const itemDate = new Date(i.deadline || i.createdAt);
    return itemDate >= start && itemDate <= end;
  });
};

export const sortBy = (items, key, order = 'asc') => {
  return [...items].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const getSearchStats = (items, query) => {
  const filtered = searchProjects(items, query);
  return {
    total: items.length,
    found: filtered.length,
    percentage: Math.round((filtered.length / items.length) * 100)
  };
};

export const highlightSearchText = (text, query) => {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};
