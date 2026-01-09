import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';

const baseUrl = process.env.VERCEL_URL
  ? new URL(`https://${process.env.VERCEL_URL}`)
  : new URL('https://algorithm-complexity-visualizer-pi.vercel.app');

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: 'Algorithm Complexity Visualizer',
    template: '%s | Algorithm Complexity Visualizer',
  },
  description: 'Visualize sorting and searching algorithms step by step.',
  applicationName: 'Algorithm Complexity Visualizer',
  keywords: [
    'algorithm visualizer',
    'sorting algorithms',
    'search algorithms',
    'big o',
    'time complexity',
    'data structures',
  ],
  authors: [{ name: 'Algo Visualizer' }],
  creator: 'Algo Visualizer',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: 'Algorithm Complexity Visualizer',
    description: 'Visualize sorting and searching algorithms step by step.',
    url: baseUrl,
    siteName: 'Algorithm Complexity Visualizer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Algorithm Complexity Visualizer',
    description: 'Visualize sorting and searching algorithms step by step.',
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/icon.png', type: 'image/png' }],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QDTBFD1XJ8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QDTBFD1XJ8');
          `}
        </Script>
      </body>
    </html>
  );
}
