import React from 'react';
import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import 'semantic-ui-css/semantic.min.css';

const inter = Inter({ subsets: ['latin'] });
const appName = 'Cointribute';

export const metadata: Metadata = {
  title: appName,
  description: 'A blockchain based crowdfunding platform for open-source projects.',
  applicationName: appName,
  authors: {
    name: appName,
    url: 'https://cointribute.com'
  },
  keywords: ['blockchain', 'crowdfunding', 'open-source', 'projects'],
  creator: appName
};

export const viewport: Viewport = {
  themeColor: 'black'
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <html lang="en">
    <body className={inter.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
