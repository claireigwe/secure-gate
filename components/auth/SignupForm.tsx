'use client';

import React from 'react';
import Link from 'next/link';
import styles from './SignupForm.module.css';
import pageStyles from '@/app/(auth)/auth.module.css';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signupAction } from '@/app/(auth)/signup/actions';
import { SignupSchema } from '@/lib/validations';

export function SignupForm() {
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [password, setPassword] = React.useState('');

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'transparent' };
    
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    let label: 'Weak' | 'Fair' | 'Strong' = 'Weak';
    let color = 'var(--color-error)'; // red

    if (score === 2) {
      label = 'Fair';
      color = '#f97316'; // sleek orange
    } else if (score === 3) {
      label = 'Strong';
      color = '#10b981'; // sleek green
    }

    return { score, label, color };
  };

  const strength = getPasswordStrength(password);

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
      <div className={styles.root}>
        <div className={styles.success}>
          <h2 className={styles.successTitle}>Account created successfully!</h2>
          <p className={styles.successText}>
            We sent a confirmation email. Please check your inbox and click the link to verify your account.
          </p>
        </div>
        <div className={styles.footer}>
          <Link href="/login" className={styles.link}>
            Go to Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={pageStyles.header}>
        <h1 className={pageStyles.title}>Create an account</h1>
        <p className={pageStyles.subtitle}>Sign up to access the dashboard</p>
      </div>
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
      <div className={styles.passwordFieldContainer}>
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          error={fieldErrors.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {password && (
          <div className={styles.strengthContainer}>
            <div className={styles.strengthLabel}>
              <span>Password strength</span>
              <span className={styles.strengthValue} style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
            <div className={styles.strengthBars}>
              <div 
                className={styles.strengthBar} 
                style={{ backgroundColor: strength.score >= 1 ? strength.color : undefined }}
              />
              <div 
                className={styles.strengthBar} 
                style={{ backgroundColor: strength.score >= 2 ? strength.color : undefined }}
              />
              <div 
                className={styles.strengthBar} 
                style={{ backgroundColor: strength.score >= 3 ? strength.color : undefined }}
              />
            </div>
          </div>
        )}
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <Button type="submit" isLoading={isLoading}>
        Sign Up
      </Button>
      <div className={styles.footer}>
        Already have an account?{' '}
        <Link href="/login" className={styles.link}>
          Log in
        </Link>
      </div>
    </form>
    </>
  );
}
