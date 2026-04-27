export const formatDateTime = (dateString) => {
  const formatted = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(dateString));

  return formatted.replace(/\b(am|pm)\b/i, (match) => match.toUpperCase());
};
