import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from '../../(auth)/auth.module.css';

export default async function VerifyEmailPage({
  params,
}: {
  params: { token: string };
}) {
  const token = params.token;
  let message = 'Verifying your email...';
  let isSuccess = false;

  try {
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      message = 'This verification link is invalid or has expired.';
    } else {
      const hasExpired = new Date(existingToken.expires) < new Date();

      if (hasExpired) {
        await prisma.verificationToken.delete({ where: { token } });
        message = 'This verification link has expired. Please sign up again or request a new link.';
      } else {
        await prisma.user.update({
          where: { email: existingToken.identifier },
          data: { emailVerified: true },
        });

        await prisma.verificationToken.delete({
          where: { token },
        });

        message = 'Your email has been successfully verified!';
        isSuccess = true;
      }
    }
  } catch (error) {
    message = 'An unexpected error occurred during verification.';
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Email Verification</h1>
        <p className={styles.subtitle}>{message}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
        <Link href="/login">
          <Button>{isSuccess ? 'Continue to Login' : 'Back to Login'}</Button>
        </Link>
      </div>
    </>
  );
}
