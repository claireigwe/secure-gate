type RateLimitRecord = {
  timestamps: number[];
};

const rateLimitMap = new Map<string, RateLimitRecord>();

function cleanup() {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [key, record] of Array.from(rateLimitMap.entries())) {
    const validTimestamps = record.timestamps.filter(t => t > tenMinutesAgo);
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

try {
  setInterval(cleanup, 60 * 1000);
} catch {
  // setInterval may not be available in some serverless environments
}

export async function rateLimit(identifier: string) {
  const now = Date.now();
  const tenMinutesAgo = now - 10 * 60 * 1000;

  let record = rateLimitMap.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(identifier, record);
  }

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
