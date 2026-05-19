'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { ResetPasswordSchema } from '@/lib/validations';

export async function resetPasswordAction(token: string, data: unknown) {
  const parsed = ResetPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Invalid input data',
      },
    };
  }

  try {
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return {
        ok: false,
        error: { code: 'INVALID_TOKEN', message: 'This reset link has expired' },
      };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return {
        ok: false,
        error: { code: 'EXPIRED_TOKEN', message: 'This reset link has expired' },
      };
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

    await prisma.user.update({
      where: { email: existingToken.email },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { token },
    });

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
