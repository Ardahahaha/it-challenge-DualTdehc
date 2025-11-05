import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { XPLogCreateSchema, formatZodError } from "@/lib/validation/schemas"
import { withRateLimit, RateLimitPresets, getUserIdFromRequest } from "@/lib/rate-limit"
import { logger, recordLatency } from "@/lib/observability/logger"

export async function GET(req: NextRequest) {
  const endTimer = logger.startTimer()
  const supabase = await createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")
    
    const domain = req.nextUrl.searchParams.get("domain")
    
    let query = supabase
      .from("xp_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)
    
    if (domain) {
      query = query.eq("domain", domain)
    }
    
    const { data, error } = await query
    if (error) throw error
    
    const latency = endTimer()
    recordLatency("/api/supabase/xp-logs", latency)
    
    logger.info(
      { route: "/api/supabase/xp-logs", action: "fetch", method: "GET", user_id: user.id },
      { ok: true, latency_ms: latency, rows_affected: data?.length || 0 }
    )
    
    return NextResponse.json({ xp_logs: data || [] })
  } catch (error: any) {
    const latency = endTimer()
    logger.error(
      { route: "/api/supabase/xp-logs", action: "fetch", method: "GET" },
      { ok: false, latency_ms: latency, error: error.message }
    )
    
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Unauthorized" ? 401 : 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  return withRateLimit(
    req,
    {
      ...RateLimitPresets.XP_LOGS,
      keyGenerator: async (req) => {
        const userId = await getUserIdFromRequest(req)
        return `xp-${userId}`
      },
    },
    async () => {
      const endTimer = logger.startTimer()
      const supabase = await createClient()
      
      try {
        const body = await req.json()
        const validated = XPLogCreateSchema.parse(body)
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")
        
        // Call fn_add_xp function (auto-updates level)
        const { error: rpcError } = await supabase.rpc("fn_add_xp", {
          p_user: user.id,
          p_domain: validated.domain,
          p_delta: validated.delta,
          p_reason: validated.reason || "Manual XP award",
        })
        
        if (rpcError) throw rpcError
        
        // Create history entry
        await supabase.rpc("fn_write_history", {
          p_user: user.id,
          p_kind: "xp",
          p_ref: null, // XP logs don't have a ref_id
        })
        
        const latency = endTimer()
        recordLatency("/api/supabase/xp-logs", latency)
        
        logger.info(
          {
            route: "/api/supabase/xp-logs",
            action: "award_xp",
            method: "POST",
            user_id: user.id,
          },
          { ok: true, latency_ms: latency, rows_affected: 1 }
        )
        
        return NextResponse.json({ 
          success: true,
          message: `Awarded ${validated.delta} XP in ${validated.domain}`,
        })
      } catch (error: any) {
        const latency = endTimer()
        
        if (error.name === "ZodError") {
          logger.warn(
            { route: "/api/supabase/xp-logs", action: "validate", method: "POST" },
            { ok: false, latency_ms: latency, error: "Validation failed" }
          )
          
          return NextResponse.json(formatZodError(error), { status: 400 })
        }
        
        logger.error(
          { route: "/api/supabase/xp-logs", action: "award_xp", method: "POST" },
          { ok: false, latency_ms: latency, error: error.message }
        )
        
        return NextResponse.json(
          { error: error.message },
          { status: error.message === "Unauthorized" ? 401 : 500 }
        )
      }
    }
  )
}