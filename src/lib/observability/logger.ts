/**
 * Structured logging utility for API routes
 * Logs: user_id, route, action, latency, result, error
 */

export interface LogContext {
  user_id?: string
  route: string
  action: string
  method?: string
  ip?: string
  user_agent?: string
}

export interface LogResult {
  ok: boolean
  latency_ms: number
  rows_affected?: number
  error?: string
  error_code?: string
  status_code?: number
}

export type LogLevel = "info" | "warn" | "error" | "debug"

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  /**
   * Log API request/response
   */
  log(level: LogLevel, context: LogContext, result: LogResult, message?: string) {
    const timestamp = new Date().toISOString()
    
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
      ...result,
      env: process.env.NODE_ENV,
    }

    // In development, pretty print
    if (this.isDevelopment) {
      const emoji = {
        info: "ℹ️",
        warn: "⚠️",
        error: "❌",
        debug: "🔍",
      }[level]

      console.log(
        `${emoji} [${level.toUpperCase()}] ${context.route} - ${context.action}`,
        `(${result.latency_ms}ms)`,
        result.ok ? "✓" : "✗"
      )

      if (!result.ok && result.error) {
        console.error("  Error:", result.error)
      }

      if (this.isDevelopment && level === "debug") {
        console.log("  Context:", logEntry)
      }
    } else {
      // In production, output structured JSON for log aggregation
      console.log(JSON.stringify(logEntry))
    }

    // TODO: Send to external logging service (DataDog, Sentry, etc.)
    // if (!result.ok && level === "error") {
    //   await sendToSentry(logEntry)
    // }
  }

  info(context: LogContext, result: LogResult, message?: string) {
    this.log("info", context, result, message)
  }

  warn(context: LogContext, result: LogResult, message?: string) {
    this.log("warn", context, result, message)
  }

  error(context: LogContext, result: LogResult, message?: string) {
    this.log("error", context, result, message)
  }

  debug(context: LogContext, result: LogResult, message?: string) {
    this.log("debug", context, result, message)
  }

  /**
   * Create timing function
   */
  startTimer(): () => number {
    const start = performance.now()
    return () => Math.round(performance.now() - start)
  }
}

export const logger = new Logger()

/**
 * Helper to log API route execution
 */
export async function withLogging<T>(
  context: LogContext,
  handler: () => Promise<T>
): Promise<T> {
  const endTimer = logger.startTimer()
  
  try {
    const result = await handler()
    
    logger.info(context, {
      ok: true,
      latency_ms: endTimer(),
    })
    
    return result
  } catch (error) {
    logger.error(context, {
      ok: false,
      latency_ms: endTimer(),
      error: error instanceof Error ? error.message : String(error),
      error_code: (error as any)?.code,
    })
    
    throw error
  }
}

/**
 * Metrics aggregation (in-memory for now)
 * Production: Use Prometheus, DataDog, etc.
 */
class MetricsCollector {
  private metrics = new Map<string, number[]>()

  record(metric: string, value: number) {
    const values = this.metrics.get(metric) || []
    values.push(value)
    
    // Keep last 1000 values
    if (values.length > 1000) {
      values.shift()
    }
    
    this.metrics.set(metric, values)
  }

  getStats(metric: string) {
    const values = this.metrics.get(metric) || []
    if (values.length === 0) return null

    const sorted = [...values].sort((a, b) => a - b)
    const p50 = sorted[Math.floor(values.length * 0.5)]
    const p95 = sorted[Math.floor(values.length * 0.95)]
    const p99 = sorted[Math.floor(values.length * 0.99)]
    const avg = values.reduce((a, b) => a + b, 0) / values.length

    return {
      count: values.length,
      avg: Math.round(avg),
      p50: Math.round(p50),
      p95: Math.round(p95),
      p99: Math.round(p99),
      min: Math.round(sorted[0]),
      max: Math.round(sorted[sorted.length - 1]),
    }
  }

  getAllStats() {
    const stats: Record<string, any> = {}
    for (const [metric, _] of this.metrics) {
      stats[metric] = this.getStats(metric)
    }
    return stats
  }
}

export const metrics = new MetricsCollector()

/**
 * Record latency metric
 */
export function recordLatency(route: string, latency_ms: number) {
  metrics.record(`${route}.latency`, latency_ms)
}

/**
 * Record error metric
 */
export function recordError(route: string) {
  metrics.record(`${route}.errors`, 1)
}
