'use client';

import React from 'react';
import styles from './SignupForm.module.css';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signupAction } from '@/app/(auth)/signup/actions';
import { SignupSchema } from '@/lib/validations';

export function SignupForm() {
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const parsed = SignupSchema.safeParse(data);
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
      const result = await signupAction(data);
      if (!result.ok) {
        setError(result.error?.message || 'Something went wrong');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit} noValidate>
      <Input
        name="name"
        type="text"
        label="Full Name"
        placeholder="John Doe"
        error={fieldErrors.name}
        required
      />
      <Input
        name="email"
        type="email"
        label="Email address"
        placeholder="Enter your email"
        error={fieldErrors.email}
        required
      />
      <Input
        name="password"
        type="password"
        label="Password"
        placeholder="Create a password"
        error={fieldErrors.password}
        required
      />
      {error && <div className={styles.error}>{error}</div>}
      <Button type="submit" isLoading={isLoading}>
        Sign Up
      </Button>
    </form>
  );
}
