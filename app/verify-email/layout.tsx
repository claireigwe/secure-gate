import React from 'react';
import styles from '../(auth)/layout.module.css';

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>{children}</div>
    </div>
  );
}
