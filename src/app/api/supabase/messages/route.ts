import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { MessageCreateSchema, formatZodError, MessageFilterSchema } from "@/lib/validation/schemas"
import { withRateLimit, RateLimitPresets, getUserIdFromRequest } from "@/lib/rate-limit"
import { logger, recordLatency } from "@/lib/observability/logger"

export async function GET(req: NextRequest) {
  const endTimer = logger.startTimer()
  const supabase = await createClient()
  
  try {
    // Validate query params
    const searchParams = Object.fromEntries(req.nextUrl.searchParams)
    const validated = MessageFilterSchema.parse(searchParams)
    
    const { room_id, limit, before } = validated
    
    // Build query
    let query = supabase
      .from("messages")
      .select("*, author:profiles!author_id(id, username, avatar_url)")
      .eq("room_id", room_id)
      .order("created_at", { ascending: false })
      .limit(limit)
    
    if (before) {
      query = query.lt("created_at", before)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    const latency = endTimer()
    recordLatency("/api/supabase/messages", latency)
    
    logger.info(
      {
        route: "/api/supabase/messages",
        action: "fetch",
        method: "GET",
      },
      {
        ok: true,
        latency_ms: latency,
        rows_affected: data?.length || 0,
      }
    )
    
    return NextResponse.json({ messages: data || [] })
  } catch (error: any) {
    const latency = endTimer()
    
    if (error.name === "ZodError") {
      logger.warn(
        { route: "/api/supabase/messages", action: "validate", method: "GET" },
        { ok: false, latency_ms: latency, error: "Validation failed" }
      )
      
      return NextResponse.json(
        formatZodError(error),
        { status: 400 }
      )
    }
    
    logger.error(
      { route: "/api/supabase/messages", action: "fetch", method: "GET" },
      { ok: false, latency_ms: latency, error: error.message }
    )
    
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  return withRateLimit(
    req,
    {
      ...RateLimitPresets.CHAT,
      keyGenerator: async (req) => {
        const userId = await getUserIdFromRequest(req)
        return `chat-${userId}`
      },
    },
    async () => {
      const endTimer = logger.startTimer()
      const supabase = await createClient()
      
      try {
        const body = await req.json()
        
        // Validate input
        const validated = MessageCreateSchema.parse(body)
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          throw new Error("Unauthorized")
        }
        
        // Insert message
        const { data, error } = await supabase
          .from("messages")
          .insert({
            room_id: validated.room_id,
            author_id: user.id,
            content: validated.content,
          })
          .select("*, author:profiles!author_id(id, username, avatar_url)")
          .single()
        
        if (error) throw error
        
        const latency = endTimer()
        recordLatency("/api/supabase/messages", latency)
        
        logger.info(
          {
            route: "/api/supabase/messages",
            action: "create",
            method: "POST",
            user_id: user.id,
          },
          {
            ok: true,
            latency_ms: latency,
            rows_affected: 1,
          }
        )
        
        return NextResponse.json({ message: data })
      } catch (error: any) {
        const latency = endTimer()
        
        if (error.name === "ZodError") {
          logger.warn(
            { route: "/api/supabase/messages", action: "validate", method: "POST" },
            { ok: false, latency_ms: latency, error: "Validation failed" }
          )
          
          return NextResponse.json(
            formatZodError(error),
            { status: 400 }
          )
        }
        
        logger.error(
          { route: "/api/supabase/messages", action: "create", method: "POST" },
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