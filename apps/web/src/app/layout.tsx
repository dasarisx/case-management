import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/cases" className="text-lg font-semibold">
              Collections Manager
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-600">
              <Link href="/cases" className="hover:text-slate-900">
                Cases
              </Link>
            </nav>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
