import { LoginForm } from '@/components/auth/LoginForm';
import styles from '../auth.module.css';

export default function LoginPage() {
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Enter your credentials to continue</p>
      </div>
      <LoginForm />
    </>
  );
}
