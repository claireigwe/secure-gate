import sgMail from '@sendgrid/mail';

function emailTemplate(title: string, body: string, ctaText: string, ctaLink: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f6f9; font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f6f9;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 48px 40px 32px; text-align: center; background-color: #f8f9fc;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #18191a; letter-spacing: -1px; font-family: 'Instrument Sans', sans-serif;">
                SecureGate
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 40px;">
              <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 600; color: #18191a; letter-spacing: -0.5px; font-family: 'Instrument Sans', sans-serif;">
                ${title}
              </h2>
              <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.5; color: #424446; font-family: 'Instrument Sans', sans-serif;">
                ${body}
              </p>
              <p style="margin: 0 0 24px; font-size: 13px; line-height: 1.4; color: #6b6d70; font-family: 'Instrument Sans', sans-serif;">
                This link expires in 1 hour.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="background-color: #1a73e8; border-radius: 8px;">
                    <a href="${ctaLink}" target="_blank" style="display: inline-block; padding: 12px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; font-family: 'Instrument Sans', sans-serif;">
                      ${ctaText}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e4e5e7;">
              <p style="margin: 0; font-size: 12px; color: #6b6d70; text-align: center; font-family: 'Instrument Sans', sans-serif;">
                If you did not request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

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
      html: emailTemplate(
        'Confirm your email',
        'Thanks for creating an account. Click the button below to verify your email address and get started.',
        'Confirm email',
        confirmLink,
      ),
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
      html: emailTemplate(
        'Reset your password',
        'You requested a password reset. Click the button below to create a new password for your account.',
        'Reset password',
        resetLink,
      ),
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    console.log(`[DEV] Password reset link for ${email}: ${resetLink}`);
  }
}
