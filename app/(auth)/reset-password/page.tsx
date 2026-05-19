import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import styles from '../auth.module.css';

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    return <div className={styles.subtitle}>Invalid or missing reset token.</div>;
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Set new password</h1>
        <p className={styles.subtitle}>Choose a new secure password</p>
      </div>
      <ResetPasswordForm token={token} />
    </>
  );
}
