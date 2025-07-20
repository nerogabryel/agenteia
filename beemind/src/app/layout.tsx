import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BeeMind',
  description: 'Sistema de saúde mental respaldado pela Dra. Ana Beatriz.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="bg-neutralBg text-neutralText">
      <body className={inter.className}>{children}</body>
    </html>
  );
}