import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Automatically locate and load .env from the API root regardless of where command is run
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ─── Environment variable schema ──────────────────────────────────────────────
// Zod validates env at startup. If a required variable is missing, the server
// refuses to start with a clear error message — no silent runtime failures.
//
// Security note: Never log this object; it contains secrets.

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z
    .string()
    .regex(/^\d+$/, 'PORT must be a number')
    .transform(Number)
    .default('3000'),

  // Supabase — required for database connectivity
  SUPABASE_URL: z
    .string()
    .url('SUPABASE_URL must be a valid URL')
    .min(1, 'SUPABASE_URL is required'),

  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),

  // JWT — used to sign our own access and refresh tokens
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters for security'),

  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // OpenAI — optional in Phase 1, required in Phase 5
  OPENAI_API_KEY: z.string().optional(),
});

// Validate on import — throw immediately if anything is wrong
const parseResult = EnvSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parseResult.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parseResult.data;
export type Env = typeof env;
