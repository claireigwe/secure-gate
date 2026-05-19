'use server';

import { prisma } from '@/lib/prisma';
import { generatePasswordResetToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/mail';
import { z } from 'zod';
import { ForgotPasswordSchema } from '@/lib/validations';

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
    return {
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }
}
