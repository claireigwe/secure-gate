// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  // const session = await getServerSession(authOptions);

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome to the protected dashboard.</p>
      {/* TODO: Implement secure logout button */}
    </main>
  );
}
