import { z } from 'zod';

// ─── Auth Schemas ─────────────────────────────────────────────────────────────
// Defined once here, used by both backend (validation) and mobile (form types).

export const RegisterSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password is too long'),       // bcrypt max is 72 bytes
  display_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50)
    .trim()
    .optional(),
});

export const LoginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const RefreshSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

// Inferred TypeScript types
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshInput = z.infer<typeof RefreshSchema>;
