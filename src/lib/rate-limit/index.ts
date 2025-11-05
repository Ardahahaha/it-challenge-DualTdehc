import { NextRequest, NextResponse } from "next/server"

// =====================================================
// IN-MEMORY RATE LIMITER
// Production: Use Redis or Upstash Rate Limit
// =====================================================

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Store: Map<identifier, RateLimitEntry>
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 60 seconds
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000)

export interface RateLimitConfig {
  maxRequests: number // Max requests per window
  windowMs: number // Time window in milliseconds
  message?: string
  keyGenerator?: (req: NextRequest) => string | Promise<string>
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
  error?: string
}

/**
 * Rate limiter function
 * @param identifier - Unique identifier (user ID, IP, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // No entry or expired - create new
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + config.windowMs,
    })
    
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    }
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
      error: config.message || "Rate limit exceeded. Please try again later.",
    }
  }

  // Increment count
  entry.count++
  
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  }
}

/**
 * Rate limit middleware for API routes
 */
export async function withRateLimit(
  req: NextRequest,
  config: RateLimitConfig,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  // Generate identifier
  const identifier = config.keyGenerator 
    ? await config.keyGenerator(req)
    : getDefaultIdentifier(req)

  // Check rate limit
  const result = rateLimit(identifier, config)

  // Add rate limit headers
  const headers = new Headers()
  headers.set("X-RateLimit-Limit", config.maxRequests.toString())
  headers.set("X-RateLimit-Remaining", result.remaining.toString())
  headers.set("X-RateLimit-Reset", new Date(result.resetAt).toISOString())

  // Rate limit exceeded
  if (!result.success) {
    return NextResponse.json(
      {
        error: result.error,
        resetAt: new Date(result.resetAt).toISOString(),
      },
      { status: 429, headers }
    )
  }

  // Execute handler and add headers
  const response = await handler()
  
  // Copy headers to response
  headers.forEach((value, key) => {
    response.headers.set(key, value)
  })

  return response
}

/**
 * Get default identifier from request (IP + User-Agent)
 */
function getDefaultIdentifier(req: NextRequest): string {
  const ip = req.headers.get("x-forwarded-for") || 
             req.headers.get("x-real-ip") || 
             "unknown"
  const userAgent = req.headers.get("user-agent") || "unknown"
  
  // Create hash for privacy
  return `${ip}-${userAgent.slice(0, 50)}`
}

// =====================================================
// PRESET CONFIGURATIONS
// =====================================================

export const RateLimitPresets = {
  // Chat: 30 messages per minute per user
  CHAT: {
    maxRequests: 30,
    windowMs: 60 * 1000,
    message: "Too many messages. Please slow down.",
  },
  
  // Match events: 60 events per minute per match
  MATCH_EVENTS: {
    maxRequests: 60,
    windowMs: 60 * 1000,
    message: "Too many match events. Please slow down.",
  },
  
  // XP awards: 20 per minute per user
  XP_LOGS: {
    maxRequests: 20,
    windowMs: 60 * 1000,
    message: "Too many XP operations. Please try again later.",
  },
  
  // Match creation: 5 per minute per user
  MATCH_CREATE: {
    maxRequests: 5,
    windowMs: 60 * 1000,
    message: "Too many match creation attempts. Please wait.",
  },
  
  // Profile updates: 10 per minute per user
  PROFILE_UPDATE: {
    maxRequests: 10,
    windowMs: 60 * 1000,
    message: "Too many profile updates. Please slow down.",
  },
  
  // General API: 100 requests per minute per IP
  GENERAL: {
    maxRequests: 100,
    windowMs: 60 * 1000,
    message: "Too many requests. Please try again later.",
  },
} as const

// =====================================================
// HELPER: Get user ID from request
// =====================================================

export async function getUserIdFromRequest(req: NextRequest): Promise<string> {
  // Get from Authorization header
  const authHeader = req.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7)
    // In production, validate JWT and extract user ID
    // For now, use token as identifier
    return `user-${token.slice(0, 20)}`
  }

  // Fallback to IP
  return getDefaultIdentifier(req)
}
