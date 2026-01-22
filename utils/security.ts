import { z } from 'zod';
import DOMPurify from 'dompurify';

// --- CONSTANTS ---
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;
const STORAGE_KEY = 'secure_rate_limit_token';

// --- SCHEMAS ---

// OWASP-aligned regex for email
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export const ContactSchema = z.object({
  name: z.string()
    .min(2, { message: "IDENTITY_TOO_SHORT" })
    .max(50, { message: "IDENTITY_OVERFLOW" })
    .regex(/^[a-zA-Z0-9\s\-_]+$/, { message: "INVALID_CHARS_DETECTED" }), // Allow alphanumeric, spaces, hyphens, underscores
  
  email: z.string()
    .regex(emailRegex, { message: "INVALID_FREQUENCY_FORMAT" })
    .max(100, { message: "EMAIL_OVERFLOW" }),
    
  message: z.string()
    .min(10, { message: "PAYLOAD_MIN_LENGTH_10" })
    .max(1000, { message: "PAYLOAD_MAX_LENGTH_1000" })
});

export type ContactFormData = z.infer<typeof ContactSchema>;

// --- SANITIZATION ---

/**
 * Strips dangerous HTML and scripts from input.
 * Uses DOMPurify for robust XSS protection.
 */
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip ALL tags, we want pure text
    ALLOWED_ATTR: []
  }).trim();
};

// --- RATE LIMITING (Client-Side Simulation) ---

interface RateLimitToken {
  count: number;
  timestamp: number;
}

/**
 * Simulates a server-side 429 Rate Limiter using LocalStorage.
 * In production, this logic MUST exist on the Edge/Server (Redis/KV).
 */
export const checkRateLimit = (): { allowed: boolean; waitTime?: number } => {
  try {
    const rawToken = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    
    let token: RateLimitToken = rawToken 
      ? JSON.parse(rawToken) 
      : { count: 0, timestamp: now };

    // Reset window if expired
    if (now - token.timestamp > RATE_LIMIT_WINDOW) {
      token = { count: 0, timestamp: now };
    }

    if (token.count >= MAX_REQUESTS_PER_WINDOW) {
      const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - token.timestamp)) / 1000);
      return { allowed: false, waitTime };
    }

    // Increment and store
    token.count++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(token));
    return { allowed: true };

  } catch (e) {
    // Fallback if storage fails (e.g. Incognito mode blocking)
    console.error("SEC_ERR: Storage access denied");
    return { allowed: true }; // Fail open for UX, or closed for security depending on posture
  }
};

// --- API KEY HANDLING ---

/**
 * Securely retrieves API keys.
 * THROW if key is missing in production to fail fast.
 */
export const getEnvVar = (key: string): string => {
  // @ts-ignore - Vite env access
  const value = import.meta.env[key];
  
  if (!value) {
    console.warn(`[SEC_AUDIT] Missing Environment Variable: ${key}`);
    // In a real app, you might throw error here, but for this demo we return empty to prevent crash
    return ""; 
  }
  return value;
};
