'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import { z } from 'zod';
import { SignupSchema } from '@/lib/validations';

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
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Return a generic error to prevent email enumeration
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
    await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

    return {
      ok: true,
      data: { message: 'Confirmation email sent!' },
    };
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
