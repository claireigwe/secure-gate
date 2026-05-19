'use server';

import { z } from 'zod';
import { LoginSchema } from '@/lib/validations';

export async function loginAction(data: unknown) {
  const parsed = LoginSchema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Invalid credentials',
      },
    };
  }

  // TODO: Authenticate using next-auth/credentials provider
  // Do not implement fake auth logic
  return {
    ok: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Login logic not yet implemented',
    },
  };
}
