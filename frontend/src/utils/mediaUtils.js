/**
 * Universal utility to get the correct URL for media assets (images, etc.)
 * Handles both absolute URLs (e.g. Supabase Storage) and relative paths (local media).
 */
export const getMediaUrl = (path) => {
  if (!path) return '/placeholder.png';
  
  // If it's already an absolute URL, return it
  if (path.startsWith('http')) return path;
  
  // For relative paths, prepend the API URL
  // If the path starts with /media/, we assume it's a Django media file
  const baseUrl = import.meta.env.VITE_API_URL || '';
  
  // Ensure we don't double slash if baseUrl ends with / and path starts with /
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBase}${cleanPath}`;
};

export const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = '/placeholder.png';
};
