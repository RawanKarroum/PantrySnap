'use client';

import { Inter } from 'next/font/google';
import Head from 'next/head'; 
import './globals.css';
import { FirebaseAppProvider } from 'reactfire';
import { firebaseConfig } from './config/Firebase';
import { UserProvider } from './context/UserContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <UserProvider>
        <html lang="en">
          <body className={inter.className} style={{ overflow: 'hidden', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            {children}
          </body>
        </html>
      </UserProvider>
    </FirebaseAppProvider>
  );
}
