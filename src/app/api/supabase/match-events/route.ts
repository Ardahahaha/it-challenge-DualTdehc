import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { MatchEventCreateSchema, formatZodError } from "@/lib/validation/schemas"
import { withRateLimit, RateLimitPresets, getUserIdFromRequest } from "@/lib/rate-limit"
import { logger, recordLatency } from "@/lib/observability/logger"

export async function GET(req: NextRequest) {
  const endTimer = logger.startTimer()
  const supabase = await createClient()
  
  try {
    const match_id = req.nextUrl.searchParams.get("match_id")
    if (!match_id) {
      throw new Error("match_id is required")
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")
    
    const { data, error } = await supabase
      .from("match_events")
      .select("*")
      .eq("match_id", match_id)
      .order("at", { ascending: true })
    
    if (error) throw error
    
    const latency = endTimer()
    recordLatency("/api/supabase/match-events", latency)
    
    logger.info(
      { route: "/api/supabase/match-events", action: "fetch", method: "GET", user_id: user.id },
      { ok: true, latency_ms: latency, rows_affected: data?.length || 0 }
    )
    
    return NextResponse.json({ events: data || [] })
  } catch (error: any) {
    const latency = endTimer()
    logger.error(
      { route: "/api/supabase/match-events", action: "fetch", method: "GET" },
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
      ...RateLimitPresets.MATCH_EVENTS,
      keyGenerator: async (req) => {
        const body = await req.json()
        return `match-events-${body.match_id}`
      },
    },
    async () => {
      const endTimer = logger.startTimer()
      const supabase = await createClient()
      
      try {
        const body = await req.json()
        const validated = MatchEventCreateSchema.parse(body)
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")
        
        // Insert match event
        const { data, error } = await supabase
          .from("match_events")
          .insert({
            match_id: validated.match_id,
            type: validated.type,
            payload: validated.payload,
          })
          .select()
          .single()
        
        if (error) throw error
        
        // Award XP on match finish
        if (validated.type === "finish" && validated.payload.winner_id) {
          const winnerId = validated.payload.winner_id
          await supabase.rpc("fn_add_xp", {
            p_user: winnerId,
            p_domain: "matches",
            p_delta: 50,
            p_reason: "Match victory",
          })
        }
        
        const latency = endTimer()
        recordLatency("/api/supabase/match-events", latency)
        
        logger.info(
          {
            route: "/api/supabase/match-events",
            action: "create",
            method: "POST",
            user_id: user.id,
          },
          { ok: true, latency_ms: latency, rows_affected: 1 }
        )
        
        return NextResponse.json({ event: data })
      } catch (error: any) {
        const latency = endTimer()
        
        if (error.name === "ZodError") {
          logger.warn(
            { route: "/api/supabase/match-events", action: "validate", method: "POST" },
            { ok: false, latency_ms: latency, error: "Validation failed" }
          )
          
          return NextResponse.json(formatZodError(error), { status: 400 })
        }
        
        logger.error(
          { route: "/api/supabase/match-events", action: "create", method: "POST" },
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