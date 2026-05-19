'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './LoginForm.module.css';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoginSchema } from '@/lib/validations';

export function LoginForm() {
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const parsed = LoginSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message;
      });
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    const { email, password } = parsed.data;

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
        router.refresh();
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
        name="email"
        type="email"
        label="Email address"
        placeholder="Enter your email"
        error={fieldErrors.email}
        required
      />
      <div className={styles.passwordFieldContainer}>
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          error={fieldErrors.password}
          required
        />
        <div className={styles.forgotPasswordContainer}>
          <Link href="/forgot-password" className={styles.link}>
            Forgot password?
          </Link>
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <Button type="submit" isLoading={isLoading}>
        Log In
      </Button>
      <div className={styles.footer}>
        Don't have an account?{' '}
        <Link href="/signup" className={styles.link}>
          Sign up
        </Link>
      </div>
    </form>
  );
}
