'use server';

import { prisma } from '@/lib/prisma';
import { generatePasswordResetToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/mail';
import { z } from 'zod';
import { ForgotPasswordSchema } from '@/lib/validations';
import { headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';

export async function forgotPasswordAction(data: unknown) {
  const parsed = ForgotPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Invalid email address',
      },
    };
  }

  // Rate Limiting: 5 attempts per IP in 10 minutes
  const ip = headers().get('x-forwarded-for') || '127.0.0.1';
  const limitCheck = await rateLimit(`forgot-password:${ip}`);
  if (!limitCheck.success) {
    return {
      ok: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
      },
    };
  }

  const { email } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const passwordResetToken = await generatePasswordResetToken(email);
      await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);
    }

    // Always return success even if email doesn't exist (prevent enumeration)
    return { ok: true };
  } catch (error) {
    console.error('Forgot Password Action Error:', error);
    return {
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }
}
