import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { VerifyEmailClient } from '@/components/auth/VerifyEmailClient';
import styles from '../(auth)/auth.module.css';

export default async function VerifyPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // If already verified, direct to dashboard
  if ((session.user as any).emailVerified) {
    redirect('/dashboard');
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Verify your email</h1>
        <p className={styles.subtitle}>Let's verify your identity</p>
      </div>
      <VerifyEmailClient email={session.user.email || ''} />
    </>
  );
}
