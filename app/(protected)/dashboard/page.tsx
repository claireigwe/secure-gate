import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/LogoutButton';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user as {
    name?: string | null;
    email?: string | null;
    emailVerified?: boolean;
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>SecureGate</span>
        <span className={styles.badge}>
          <span className={styles.dot} />
          Authenticated
        </span>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.greeting}>
            <h1 className={styles.name}>
              {user.name ?? 'User'}
            </h1>
            <p className={styles.email}>{user.email}</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Session</h2>
            <div className={styles.row}>
              <span className={styles.label}>Status</span>
              <span className={`${styles.tag} ${styles.tagActive}`}>
                Active
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Type</span>
              <span className={styles.value}>JWT</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{user.email}</span>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Security</h2>
            <div className={styles.row}>
              <span className={styles.label}>Verification</span>
              {user.emailVerified ? (
                <span className={`${styles.tag} ${styles.tagVerified}`}>
                  Verified
                </span>
              ) : (
                <span className={`${styles.tag} ${styles.tagUnverified}`}>
                  Unverified
                </span>
              )}
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Connection</span>
              <span className={`${styles.tag} ${styles.tagSecure}`}>
                Encrypted
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Route</span>
              <span className={`${styles.tag} ${styles.tagActive}`}>
                Protected
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <LogoutButton />
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          SecureGate — Production-ready authentication
        </p>
      </footer>
    </div>
  );
}
