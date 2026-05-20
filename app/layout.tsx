import '@/tokens/tokens.css';
import './globals.css';

export const metadata = {
  title: 'SecureGate',
  description: 'Production-ready authentication system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
