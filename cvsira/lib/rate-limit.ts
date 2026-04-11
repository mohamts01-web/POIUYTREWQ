import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only create Redis connection if ENV variables are provided
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Dummy implementation for development if Upstash isn't configured
class DummyRatelimit {
    async limit(identifier: string) {
        return { success: true, remaining: 100 };
    }
}

// Fallback to dummy if no redis configured to not break local dev
const getLimiter = (tokens: number, window: '1 h' | '1 m') => {
    if (!redisUrl || !redisToken) {
        console.warn('⚠️ UPSTASH credentials missing. Rate limiting bypassed.');
        return new DummyRatelimit() as any;
    }
    
    const redis = new Redis({ url: redisUrl, token: redisToken });
    return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(tokens, window),
        ephemeralCache: new Map(),
    });
};

export const rateLimiters = {
    cv_generate: getLimiter(10, '1 h'),
    cv_download: getLimiter(5, '1 h'),
    ai_text: getLimiter(30, '1 h'),
    certificate_generate: getLimiter(20, '1 h'),
};

export async function checkRateLimit(
    limiter: Ratelimit,
    userId: string
) {
    const { success, remaining } = await limiter.limit(userId);
    if (!success) {
        throw new Error(`RATE_LIMIT_EXCEEDED:${remaining}`);
    }
}
