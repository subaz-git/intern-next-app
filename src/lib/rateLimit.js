// Simple in-memory rate limiter
const requestMap = new Map();

export function rateLimit(identifier, maxRequests = 5, windowMs = 60000) {
  const now = Date.now();
  const key = identifier;

  if (!requestMap.has(key)) {
    requestMap.set(key, []);
  }

  const requests = requestMap.get(key);

  // Remove old requests outside the window
  const recentRequests = requests.filter((time) => now - time < windowMs);
  requestMap.set(key, recentRequests);

  if (recentRequests.length >= maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000),
    };
  }

  recentRequests.push(now);
  return { allowed: true };
}
