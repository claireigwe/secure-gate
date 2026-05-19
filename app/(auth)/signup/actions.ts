'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import { z } from 'zod';
import { SignupSchema } from '@/lib/validations';
import { headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';

export async function signupAction(data: unknown) {
  const parsed = SignupSchema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Invalid input data',
      },
    };
  }

  const { email, password, name } = parsed.data;

  try {
    const ip = headers().get('x-forwarded-for') || '127.0.0.1';
    const limitCheck = await rateLimit(`signup:${ip}`);
    if (!limitCheck.success) {
      return {
        ok: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
        },
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        ok: false,
        error: {
          code: 'ACCOUNT_EXISTS',
          message: 'Unable to create account',
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const verificationToken = await generateVerificationToken(email);
    const confirmLink = `${process.env.NEXTAUTH_URL}/verify-email/${verificationToken.token}`;
    console.log(`[DEV] Verification link for ${email}: ${confirmLink}`);

    await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

    return {
      ok: true,
      data: { message: 'Confirmation email sent!' },
    };
  } catch (error) {
    console.error('Signup Action Error:', error);
    return {
      ok: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }
}
