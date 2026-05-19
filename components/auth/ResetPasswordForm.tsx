'use client';

import React from 'react';
import styles from './ResetPasswordForm.module.css';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { resetPasswordAction } from '@/app/(auth)/reset-password/actions';
import { ResetPasswordSchema } from '@/lib/validations';

export function ResetPasswordForm({ token }: { token: string }) {
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

    const parsed = ResetPasswordSchema.safeParse(data);
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
      const result = await resetPasswordAction(token, data);
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
        <p>Password successfully reset. You can now log in.</p>
        <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
      </div>
    );
  }

  return (
    <form className={styles.root} onSubmit={handleSubmit} noValidate>
      <Input
        name="password"
        type="password"
        label="New Password"
        placeholder="Enter your new password"
        error={fieldErrors.password}
        required
      />
      {/* TODO: Add password strength indicator */}
      {error && <div className={styles.error}>{error}</div>}
      <Button type="submit" isLoading={isLoading}>
        Update Password
      </Button>
    </form>
  );
}
