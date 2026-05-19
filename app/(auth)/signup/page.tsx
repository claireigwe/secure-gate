import { SignupForm } from '@/components/auth/SignupForm';
import styles from '../auth.module.css';

export default function SignupPage() {
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>Sign up to access the dashboard</p>
      </div>
      <SignupForm />
    </>
  );
}
