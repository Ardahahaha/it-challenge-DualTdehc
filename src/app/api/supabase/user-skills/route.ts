import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { UserSkillUpdateSchema, formatZodError } from "@/lib/validation/schemas"
import { withRateLimit, RateLimitPresets, getUserIdFromRequest } from "@/lib/rate-limit"
import { logger, recordLatency } from "@/lib/observability/logger"

export async function GET(req: NextRequest) {
  const endTimer = logger.startTimer()
  const supabase = await createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")
    
    const { data, error } = await supabase
      .from("user_skills")
      .select("*, skill:skills!skill_id(*)")
      .eq("user_id", user.id)
      .order("last_updated", { ascending: false })
    
    if (error) throw error
    
    const latency = endTimer()
    recordLatency("/api/supabase/user-skills", latency)
    
    logger.info(
      { route: "/api/supabase/user-skills", action: "fetch", method: "GET", user_id: user.id },
      { ok: true, latency_ms: latency, rows_affected: data?.length || 0 }
    )
    
    return NextResponse.json({ user_skills: data || [] })
  } catch (error: any) {
    const latency = endTimer()
    logger.error(
      { route: "/api/supabase/user-skills", action: "fetch", method: "GET" },
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
      ...RateLimitPresets.PROFILE_UPDATE,
      keyGenerator: async (req) => {
        const userId = await getUserIdFromRequest(req)
        return `user-skills-${userId}`
      },
    },
    async () => {
      const endTimer = logger.startTimer()
      const supabase = await createClient()
      
      try {
        const body = await req.json()
        const validated = UserSkillUpdateSchema.parse(body)
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")
        
        // Call fn_set_skill_level function
        const { error: rpcError } = await supabase.rpc("fn_set_skill_level", {
          p_user: user.id,
          p_skill: validated.skill_id,
          p_level: validated.level,
        })
        
        if (rpcError) throw rpcError
        
        // Award XP for skill updates
        await supabase.rpc("fn_add_xp", {
          p_user: user.id,
          p_domain: "skills",
          p_delta: 10,
          p_reason: `Updated skill level to ${validated.level}`,
        })
        
        const latency = endTimer()
        recordLatency("/api/supabase/user-skills", latency)
        
        logger.info(
          {
            route: "/api/supabase/user-skills",
            action: "update",
            method: "POST",
            user_id: user.id,
          },
          { ok: true, latency_ms: latency, rows_affected: 1 }
        )
        
        return NextResponse.json({ 
          success: true,
          message: "Skill level updated",
        })
      } catch (error: any) {
        const latency = endTimer()
        
        if (error.name === "ZodError") {
          logger.warn(
            { route: "/api/supabase/user-skills", action: "validate", method: "POST" },
            { ok: false, latency_ms: latency, error: "Validation failed" }
          )
          
          return NextResponse.json(formatZodError(error), { status: 400 })
        }
        
        logger.error(
          { route: "/api/supabase/user-skills", action: "update", method: "POST" },
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