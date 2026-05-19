'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { resendVerificationAction } from '@/app/verify-email/actions';
import styles from './VerifyEmailClient.module.css';

export function VerifyEmailClient({ email }: { email: string }) {
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleResend = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await resendVerificationAction();
      if (result.ok) {
        setSuccess('Verification link resent! Please check your email inbox.');
      } else {
        setError(result.error?.message || 'Failed to resend verification link');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <p className={styles.description}>
        We sent a verification email to <strong className={styles.email}>{email}</strong>.
        Please click the link in the email to verify and unlock your account.
      </p>

      {success && <div className={styles.success}>{success}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <Button onClick={handleResend} isLoading={isLoading} className={styles.button}>
          Resend Verification Email
        </Button>
        
        <Button onClick={() => signOut({ callbackUrl: '/login' })} className={styles.button}>
          Log Out
        </Button>
      </div>
    </div>
  );
}
