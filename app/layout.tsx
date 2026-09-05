import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

/**
 * The design system ships Montserrat as a variable TTF in reference/_ds/fonts.
 * Next self-hosts the same family at build time, which preloads it and avoids
 * shipping the binaries; --font-montserrat feeds --font-base in the DS tokens.
 */
const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'English Studio',
  description: 'English and IELTS lessons with a personal account for every student.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#063417',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
