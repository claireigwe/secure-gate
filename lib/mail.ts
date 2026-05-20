import sgMail from '@sendgrid/mail';

export async function sendVerificationEmail(email: string, token: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'somiigwe@gmail.com';
  const confirmLink = `${process.env.NEXTAUTH_URL}/verify-email/${token}`;

  if (!apiKey) {
    console.log(`[DEV] Verification link for ${email}: ${confirmLink}`);
    return;
  }

  sgMail.setApiKey(apiKey);

  try {
    await sgMail.send({
      to: email,
      from: fromEmail,
      subject: 'Confirm your email',
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    console.log(`[DEV] Verification link for ${email}: ${confirmLink}`);
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'somiigwe@gmail.com';
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  if (!apiKey) {
    console.log(`[DEV] Password reset link for ${email}: ${resetLink}`);
    return;
  }

  sgMail.setApiKey(apiKey);

  try {
    await sgMail.send({
      to: email,
      from: fromEmail,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    console.log(`[DEV] Password reset link for ${email}: ${resetLink}`);
  }
}
