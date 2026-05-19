type RateLimitRecord = {
  timestamps: number[];
};

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up old entries periodically to prevent memory leaks in development
const globalObj = global as any;
if (globalObj.rateLimitInterval) {
  clearInterval(globalObj.rateLimitInterval);
}
globalObj.rateLimitInterval = setInterval(() => {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [key, record] of Array.from(rateLimitMap.entries())) {
    const validTimestamps = record.timestamps.filter(t => t > tenMinutesAgo);
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}, 60 * 1000);

/**
 * Rates limits requests based on an identifier (e.g. IP or email)
 * Policy: maximum 5 requests per identifier within 10 minutes
 */
export async function rateLimit(identifier: string) {
  const now = Date.now();
  const tenMinutesAgo = now - 10 * 60 * 1000;

  let record = rateLimitMap.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(identifier, record);
  }

  // Filter timestamps to last 10 minutes
  record.timestamps = record.timestamps.filter(t => t > tenMinutesAgo);

  if (record.timestamps.length >= 5) {
    const oldestTimestamp = record.timestamps[0];
    const reset = oldestTimestamp + 10 * 60 * 1000;
    return {
      success: false,
      limit: 5,
      remaining: 0,
      reset,
    };
  }

  record.timestamps.push(now);

  return {
    success: true,
    limit: 5,
    remaining: 5 - record.timestamps.length,
    reset: now + 10 * 60 * 1000,
  };
}
