import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import styles from '../auth.module.css';

export default function ForgotPasswordPage() {
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Reset password</h1>
        <p className={styles.subtitle}>Enter your email to receive a reset link</p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
