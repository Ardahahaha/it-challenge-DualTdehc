import { authClient } from "@/lib/auth-client"
import { createClient } from "./server"
import { createServiceClient } from "./server"
import { Database } from "@/types/supabase"

/**
 * Get Supabase client with Better Auth user context
 * Sets app.current_user_id for RLS policies
 */
export async function getAuthenticatedSupabaseClient() {
  const supabase = await createClient()
  
  // Get Better Auth session
  const session = await authClient.getSession()
  
  if (!session?.user) {
    throw new Error("Unauthorized - No active session")
  }

  // Get or create Supabase profile for this Better Auth user
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', session.user.id)
    .single()

  if (!profile) {
    throw new Error("Profile not found - Please complete registration")
  }

  // Set RLS context (used by policies)
  await supabase.rpc('set_config', {
    name: 'app.current_user_id',
    value: profile.id
  } as any)

  return {
    supabase,
    userId: profile.id,
    betterAuthUserId: session.user.id,
    session
  }
}

/**
 * Get or create Supabase profile for Better Auth user
 */
export async function getOrCreateProfile(betterAuthUserId: string, username: string) {
  const supabase = createServiceClient() // Use service role to bypass RLS

  // Check if profile exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', betterAuthUserId)
    .single()

  if (existing) {
    return existing
  }

  // Create new profile
  const { data: newProfile, error } = await supabase
    .from('profiles')
    .insert({
      user_id: betterAuthUserId,
      username: username || `user_${Date.now()}`,
      level: 1,
      is_public: true,
      domains: []
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create profile:', error)
    throw new Error('Failed to create user profile')
  }

  return newProfile
}

/**
 * Verify user has access to a resource
 */
export async function verifyResourceAccess(
  resourceType: 'profile' | 'match' | 'message',
  resourceId: string
) {
  const { supabase, userId } = await getAuthenticatedSupabaseClient()

  switch (resourceType) {
    case 'profile':
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, is_public')
        .eq('id', resourceId)
        .single()
      
      return profile?.is_public || profile?.id === userId

    case 'match':
      const { data: match } = await supabase
        .from('matches')
        .select('created_by, invited_id')
        .eq('id', resourceId)
        .single()
      
      return match?.created_by === userId || match?.invited_id === userId

    case 'message':
      const { data: message } = await supabase
        .from('messages')
        .select('author_id')
        .eq('id', resourceId)
        .single()
      
      return message?.author_id === userId

    default:
      return false
  }
}
