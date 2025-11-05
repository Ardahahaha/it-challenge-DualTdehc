import { z } from "zod"

// =====================================================
// MESSAGES VALIDATION
// =====================================================

export const MessageCreateSchema = z.object({
  room_id: z.string().uuid("Invalid room ID format"),
  content: z.string()
    .min(1, "Message cannot be empty")
    .max(4000, "Message too long (max 4000 characters)")
    .trim(),
})

export type MessageCreateInput = z.infer<typeof MessageCreateSchema>

// =====================================================
// MATCHES VALIDATION
// =====================================================

export const MatchCreateSchema = z.object({
  invited_id: z.string().uuid("Invalid user ID format"),
  mode: z.enum(["online", "irl"], {
    errorMap: () => ({ message: "Mode must be 'online' or 'irl'" }),
  }),
})

export const MatchUpdateSchema = z.object({
  status: z.enum(["pending", "active", "finished"], {
    errorMap: () => ({ message: "Invalid status value" }),
  }).optional(),
  started_at: z.string().datetime().optional(),
  finished_at: z.string().datetime().optional(),
})

export type MatchCreateInput = z.infer<typeof MatchCreateSchema>
export type MatchUpdateInput = z.infer<typeof MatchUpdateSchema>

// =====================================================
// MATCH EVENTS VALIDATION
// =====================================================

export const MatchEventCreateSchema = z.object({
  match_id: z.string().uuid("Invalid match ID format"),
  type: z.enum([
    "score_update",
    "round_start",
    "round_end",
    "pause",
    "resume",
    "finish",
    "system",
    "chat"
  ], {
    errorMap: () => ({ message: "Invalid event type" }),
  }),
  payload: z.record(z.any()).default({}),
})

export type MatchEventCreateInput = z.infer<typeof MatchEventCreateSchema>

// =====================================================
// XP LOGS VALIDATION
// =====================================================

export const XPLogCreateSchema = z.object({
  domain: z.string()
    .min(1, "Domain is required")
    .max(100, "Domain name too long")
    .regex(/^[a-z0-9_-]+$/, "Domain must contain only lowercase letters, numbers, hyphens, and underscores"),
  delta: z.number()
    .int("XP delta must be an integer")
    .min(-1000, "XP delta too negative")
    .max(1000, "XP delta too large"),
  reason: z.string()
    .min(1, "Reason is required")
    .max(500, "Reason too long")
    .optional(),
})

export type XPLogCreateInput = z.infer<typeof XPLogCreateSchema>

// =====================================================
// USER SKILLS VALIDATION
// =====================================================

export const UserSkillUpdateSchema = z.object({
  skill_id: z.number()
    .int("Skill ID must be an integer")
    .positive("Skill ID must be positive"),
  level: z.number()
    .int("Level must be an integer")
    .min(0, "Level cannot be negative")
    .max(10, "Level cannot exceed 10"),
})

export type UserSkillUpdateInput = z.infer<typeof UserSkillUpdateSchema>

// =====================================================
// PROFILES VALIDATION
// =====================================================

export const ProfileUpdateSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username too long")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores")
    .optional(),
  bio: z.string()
    .max(500, "Bio too long")
    .optional(),
  avatar_url: z.string()
    .url("Invalid avatar URL")
    .optional()
    .or(z.literal("")),
  domains: z.array(z.string()).optional(),
  is_public: z.boolean().optional(),
})

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>

// =====================================================
// QUERY PARAMS VALIDATION
// =====================================================

export const PaginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

export const MatchFilterSchema = z.object({
  status: z.enum(["pending", "active", "finished"]).optional(),
  mode: z.enum(["online", "irl"]).optional(),
})

export const MessageFilterSchema = z.object({
  room_id: z.string().uuid("Invalid room ID"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  before: z.string().datetime().optional(),
})

export type PaginationInput = z.infer<typeof PaginationSchema>
export type MatchFilterInput = z.infer<typeof MatchFilterSchema>
export type MessageFilterInput = z.infer<typeof MessageFilterSchema>

// =====================================================
// HELPER: Validation Error Formatter
// =====================================================

export function formatZodError(error: z.ZodError) {
  return {
    message: "Validation failed",
    errors: error.errors.map(err => ({
      field: err.path.join("."),
      message: err.message,
    })),
  }
}
