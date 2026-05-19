import { Resend } from 'resend';

let resend: Resend | undefined;

try {
  resend = new Resend(process.env.RESEND_API_KEY);
} catch {
  console.error('Failed to initialize Resend client');
}

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXTAUTH_URL}/verify-email/${token}`;

  if (!resend) {
    console.log(`[DEV] Verification link for ${email}: ${confirmLink}`);
    return;
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Confirm your email',
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    console.log(`[DEV] Verification link for ${email}: ${confirmLink}`);
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  if (!resend) {
    console.log(`[DEV] Password reset link for ${email}: ${resetLink}`);
    return;
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    console.log(`[DEV] Password reset link for ${email}: ${resetLink}`);
  }
}
