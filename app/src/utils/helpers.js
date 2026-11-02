/**
 * Utility helpers for safe parsing and sanitization
 */

export function safeJsonParse(jsonString, fallback = null) {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('Failed to parse JSON safely:', err);
    return fallback;
  }
}

/**
 * Remove sensitive attributes from user object before returning to client/state
 */
export function sanitizeUser(user) {
  if (!user || typeof user !== 'object') return null;
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

/**
 * Sanitize search query to prevent PostgREST syntax injection
 */
export function sanitizeSearchQuery(query) {
  if (!query || typeof query !== 'string') return '';
  // Strip characters with special PostgREST / regex meaning like commas, parentheses, colons, percent signs
  return query.replace(/[,():%*"]/g, '').trim();
}
