'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import styles from '@/app/(protected)/dashboard/dashboard.module.css';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await signOut({ callbackUrl: '/login' });
  }

  return (
    <button
      className={styles.logoutButton}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </button>
  );
}
