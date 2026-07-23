import type { Metadata } from 'next';
import Script from 'next/script';
import { Providers } from '@/lib/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'MATHO — One Live. Global Market.',
  description:
    'MATHO is the AI-powered global live social commerce platform for the Pi ecosystem.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Foundational Pi SDK — must load before Pi.init()/Pi.authenticate() are called. */}
        <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="beforeInteractive" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
