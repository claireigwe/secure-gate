'use client';

import React from 'react';
import Link from 'next/link';
import styles from './ForgotPasswordForm.module.css';
import headerStyles from '@/app/(auth)/auth.module.css';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { forgotPasswordAction } from '@/app/(auth)/forgot-password/actions';
import { ForgotPasswordSchema } from '@/lib/validations';

export function ForgotPasswordForm() {
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const parsed = ForgotPasswordSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message;
      });
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await forgotPasswordAction(data);
      if (!result.ok) {
        setError(result.error?.message || 'Something went wrong');
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.success}>
        <p>If an account exists, a password reset link has been sent to your email.</p>
        <div className={styles.footer}>
          <Link href="/login" className={styles.link}>
            Back to Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={headerStyles.header}>
        <h1 className={headerStyles.title}>Reset password</h1>
        <p className={headerStyles.subtitle}>Enter your email to receive a reset link</p>
      </div>
      <form className={styles.root} onSubmit={handleSubmit} noValidate>
        <Input
          name="email"
          type="email"
          label="Email address"
          placeholder="Enter your email"
          error={fieldErrors.email}
          required
        />
        {error && <div className={styles.error}>{error}</div>}
        <Button type="submit" isLoading={isLoading}>
          Reset Password
        </Button>
        <div className={styles.footer}>
          <Link href="/login" className={styles.link}>
            Back to Log in
          </Link>
        </div>
      </form>
    </>
  );
}
