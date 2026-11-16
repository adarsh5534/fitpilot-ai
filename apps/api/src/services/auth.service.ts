import { getSupabaseClient } from '../config/supabase';
import { signAccessToken, signRefreshToken } from '../config/jwt';
import { AppError } from '../middleware/error-handler';
import type { RegisterInput, LoginInput, AuthUser, UserProfile, AuthSession } from '@fitpilot/shared';

// ─── Auth Service ─────────────────────────────────────────────────────────────
// Pure business logic — no Express req/res here.
// Controllers call these functions and handle HTTP concerns.

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getOrCreateProfile(userId: string, displayName?: string): Promise<UserProfile> {
  const supabase = getSupabaseClient();

  // Try to find existing profile
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) return existing as UserProfile;

  // Create shell profile on first sign-in
  const { data: created, error } = await supabase
    .from('user_profiles')
    .insert({ user_id: userId, display_name: displayName ?? null })
    .select('*')
    .single();

  if (error || !created) {
    throw new AppError(500, 'PROFILE_CREATE_FAILED', 'Failed to create user profile');
  }

  return created as UserProfile;
}

function buildSession(
  user: AuthUser,
  profile: UserProfile,
): AuthSession {
  const tokenPayload = { sub: user.id, email: user.email };
  return {
    user,
    profile,
    tokens: {
      access_token: signAccessToken(tokenPayload),
      refresh_token: signRefreshToken(tokenPayload),
    },
    profile_complete: !!(profile.primary_goal && profile.height_cm && profile.weight_kg),
  };
}

// ── Public functions ──────────────────────────────────────────────────────────

export async function registerUser(input: RegisterInput): Promise<AuthSession> {
  const supabase = getSupabaseClient();

  // Create Supabase Auth user
  const { data, error } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,  // skip email verification in development
  });

  if (error) {
    // Map common Supabase errors to user-friendly messages
    if (error.message.includes('already registered')) {
      throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'An account with this email already exists');
    }
    throw new AppError(400, 'REGISTRATION_FAILED', error.message);
  }

  const user: AuthUser = { id: data.user.id, email: data.user.email! };
  const profile = await getOrCreateProfile(user.id, input.display_name);

  return buildSession(user, profile);
}

export async function loginUser(input: LoginInput): Promise<AuthSession> {
  const supabase = getSupabaseClient();

  // Verify credentials via Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.user) {
    // Always use a generic message — don't reveal whether the email exists
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const user: AuthUser = { id: data.user.id, email: data.user.email! };
  const profile = await getOrCreateProfile(user.id);

  return buildSession(user, profile);
}

export async function refreshUserTokens(
  userId: string,
  email: string,
): Promise<{ access_token: string; refresh_token: string }> {
  const tokenPayload = { sub: userId, email };
  return {
    access_token: signAccessToken(tokenPayload),
    refresh_token: signRefreshToken(tokenPayload),
  };
}
