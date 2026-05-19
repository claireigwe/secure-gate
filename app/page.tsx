import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect root to signup page for new users
  redirect('/signup');
}
