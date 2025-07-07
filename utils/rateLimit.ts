import { NextRequest } from 'next/server';

const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;

const requestCounts = new Map<string, {count: number, lastRequest: number}>();

export function rateLimit(request: NextRequest) {
  const ip = request.headers.get('x-real-ip') || 
             request.headers.get('x-forwarded-for')?.split(',')[0] || 
             'unknown';
  
  const currentTime = Date.now();
  const record = requestCounts.get(ip);

  if (!record) {
    requestCounts.set(ip, { count: 1, lastRequest: currentTime });
    return { limited: false };
  }

  if (currentTime - record.lastRequest > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, lastRequest: currentTime });
    return { limited: false };
  }

  record.count++;
  record.lastRequest = currentTime;

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return { 
      limited: true,
      remainingTime: Math.ceil((RATE_LIMIT_WINDOW - (currentTime - record.lastRequest)) / 1000)
    };
  }

  return { limited: false };
}
