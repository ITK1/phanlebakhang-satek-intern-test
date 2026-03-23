export const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date().setHours(0, 0, 0, 0);
};

export const isNearDeadline = (dateStr) => {
  if (!dateStr) return false;
  const diff = new Date(dateStr) - new Date();
  return diff > 0 && diff < 86400000; // Dưới 24h
};
