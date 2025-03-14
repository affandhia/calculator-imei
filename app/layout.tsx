import React from 'react';
import './globals.css';
import type { Metadata, Viewport } from 'next';

const APP_NAME = 'IMEI Tax Calculator';
const APP_DEFAULT_TITLE =
  'IMEI Tax Calculator | Calculate Import Taxes in Multiple Currencies';
const APP_TITLE_TEMPLATE = '%s | IMEI Tax Calculator';
const APP_DESCRIPTION =
  'Calculate import taxes for devices with IMEI numbers in SGD, USD, and IDR currencies with custom exchange rates, tax relieves, and buffer options.';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  keywords: [
    'tax calculator',
    'IMEI tax',
    'import tax',
    'IDR tax',
    'SGD tax',
    'USD tax',
    'PPH tax',
    'PPN tax',
  ],
  authors: [{ name: 'Project Symbiosis Team' }],
  creator: 'Project Symbiosis',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IMEI Tax Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: ['/twitter-image.png'],
    creator: '@projectsymbiosis',
  },
  category: 'Finance',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
