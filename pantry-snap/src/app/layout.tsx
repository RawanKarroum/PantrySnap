'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { FirebaseAppProvider } from 'reactfire';
import { firebaseConfig } from './config/Firebase';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </FirebaseAppProvider>
  );
}
