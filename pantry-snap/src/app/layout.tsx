// src/pages/_app.tsx or src/pages/_document.tsx
'use client';

import { Inter } from 'next/font/google';
import Head from 'next/head';
import Script from 'next/script';
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
          <head>
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-ZMEH4KSLPX"></Script>
            <Script id="google-analytics">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-ZMEH4KSLPX');
              `}
            </Script>
          </head>
          <body className={inter.className} style={{ overflow: 'hidden', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            {children}
          </body>
        </html>
      </UserProvider>
    </FirebaseAppProvider>
  );
}
