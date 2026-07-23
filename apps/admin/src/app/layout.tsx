import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MATHO Admin',
  description: 'Internal operations console for the MATHO platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
