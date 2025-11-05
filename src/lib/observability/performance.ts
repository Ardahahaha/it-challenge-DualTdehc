/**
 * Performance monitoring and metrics collection
 */

interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'count' | 'bytes'
  timestamp: string
  tags?: Record<string, string>
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private timers: Map<string, number> = new Map()

  /**
   * Start a performance timer
   */
  startTimer(name: string): void {
    this.timers.set(name, performance.now())
  }

  /**
   * End a performance timer and record metric
   */
  endTimer(name: string, tags?: Record<string, string>): number {
    const startTime = this.timers.get(name)
    if (!startTime) {
      console.warn(`Timer "${name}" not found`)
      return 0
    }

    const duration = performance.now() - startTime
    this.timers.delete(name)

    this.recordMetric({
      name,
      value: Math.round(duration),
      unit: 'ms',
      timestamp: new Date().toISOString(),
      tags
    })

    return duration
  }

  /**
   * Record a custom metric
   */
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric)

    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics.shift()
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(metric)
    }
  }

  /**
   * Get metrics summary
   */
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(m => m.name === name)
    }
    return this.metrics
  }

  /**
   * Calculate percentiles for a metric
   */
  getPercentiles(name: string, percentiles: number[] = [50, 95, 99]): Record<string, number> {
    const values = this.metrics
      .filter(m => m.name === name && m.unit === 'ms')
      .map(m => m.value)
      .sort((a, b) => a - b)

    if (values.length === 0) {
      return {}
    }

    const result: Record<string, number> = {}
    for (const p of percentiles) {
      const index = Math.ceil((p / 100) * values.length) - 1
      result[`p${p}`] = values[Math.max(0, index)]
    }

    return result
  }

  /**
   * Get average latency for a metric
   */
  getAverageLatency(name: string): number {
    const values = this.metrics
      .filter(m => m.name === name && m.unit === 'ms')
      .map(m => m.value)

    if (values.length === 0) {
      return 0
    }

    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = []
    this.timers.clear()
  }

  /**
   * Send metric to monitoring service (placeholder)
   */
  private sendToMonitoringService(metric: PerformanceMetric): void {
    // TODO: Integrate with monitoring service (e.g., Datadog, New Relic, etc.)
    // For now, just log to console in production
    console.log('METRIC:', JSON.stringify(metric))
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * Decorator to measure function execution time
 */
export function measurePerformance(name: string, tags?: Record<string, string>) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      performanceMonitor.startTimer(name)
      try {
        const result = await originalMethod.apply(this, args)
        performanceMonitor.endTimer(name, tags)
        return result
      } catch (error) {
        performanceMonitor.endTimer(name, { ...tags, error: 'true' })
        throw error
      }
    }

    return descriptor
  }
}

/**
 * Helper to measure async operations
 */
export async function measureAsync<T>(
  name: string,
  operation: () => Promise<T>,
  tags?: Record<string, string>
): Promise<T> {
  performanceMonitor.startTimer(name)
  try {
    const result = await operation()
    const duration = performanceMonitor.endTimer(name, tags)
    
    // Warn if operation is slow
    if (duration > 300) {
      console.warn(`Slow operation detected: ${name} took ${duration}ms`)
    }
    
    return result
  } catch (error) {
    performanceMonitor.endTimer(name, { ...tags, error: 'true' })
    throw error
  }
}

/**
 * Client-side performance measurement for realtime events
 */
export function measureRealtimeLatency(
  eventType: string,
  sentAt: string | number
): number {
  const sentTime = typeof sentAt === 'string' ? new Date(sentAt).getTime() : sentAt
  const receivedTime = Date.now()
  const latency = receivedTime - sentTime

  performanceMonitor.recordMetric({
    name: 'realtime_latency',
    value: latency,
    unit: 'ms',
    timestamp: new Date().toISOString(),
    tags: { event_type: eventType }
  })

  // Warn if latency exceeds target
  if (latency > 150) {
    console.warn(`High realtime latency: ${eventType} took ${latency}ms (target: <150ms)`)
  }

  return latency
}

/**
 * Track error rates
 */
export function trackError(context: {
  route: string
  error: string
  user_id?: string
}): void {
  performanceMonitor.recordMetric({
    name: 'error_count',
    value: 1,
    unit: 'count',
    timestamp: new Date().toISOString(),
    tags: context
  })
}

/**
 * Get performance summary
 */
export function getPerformanceSummary(): {
  avgLatencies: Record<string, number>
  percentiles: Record<string, Record<string, number>>
  errorCounts: number
} {
  const routeMetrics = performanceMonitor.getMetrics().filter(m => m.unit === 'ms')
  const uniqueRoutes = [...new Set(routeMetrics.map(m => m.name))]

  const avgLatencies: Record<string, number> = {}
  const percentiles: Record<string, Record<string, number>> = {}

  for (const route of uniqueRoutes) {
    avgLatencies[route] = performanceMonitor.getAverageLatency(route)
    percentiles[route] = performanceMonitor.getPercentiles(route)
  }

  const errorCounts = performanceMonitor
    .getMetrics()
    .filter(m => m.name === 'error_count')
    .reduce((sum, m) => sum + m.value, 0)

  return {
    avgLatencies,
    percentiles,
    errorCounts
  }
}
