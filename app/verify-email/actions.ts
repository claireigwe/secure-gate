'use server';

import { prisma } from '@/lib/prisma';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';

export async function resendVerificationAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return { ok: false, error: { message: 'Unauthorized' } };
    }

    const email = session.user.email;

    // Rate Limiting: 5 attempts per IP in 10 minutes
    const ip = headers().get('x-forwarded-for') || '127.0.0.1';
    const limitCheck = await rateLimit(`resend-verification:${ip}`);
    if (!limitCheck.success) {
      return {
        ok: false,
        error: {
          message: 'Too many verification attempts. Please try again later.',
        },
      };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { ok: false, error: { message: 'User not found' } };
    }

    if (user.emailVerified) {
      return { ok: false, error: { message: 'Email already verified' } };
    }

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

    console.log(`[DEVELOPMENT] Verification token resent for ${email}: ${verificationToken.token}`);

    return { ok: true };
  } catch (error) {
    console.error('Failed to resend verification:', error);
    return { ok: false, error: { message: 'An unexpected error occurred' } };
  }
}
