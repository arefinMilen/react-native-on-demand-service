import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Admin Web Portal | On-Demand Service Platform',
  description: 'Operations, KYC Verification & Commission Management Console',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-black text-sky-400 tracking-wider">ON-DEMAND</span>
            <span className="bg-sky-950 text-sky-300 text-xs font-bold px-2.5 py-1 rounded border border-sky-800">
              ADMIN CONSOLE
            </span>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-semibold">
            <a href="/" className="hover:text-sky-400 transition-colors">Overview</a>
            <a href="/kyc" className="hover:text-sky-400 transition-colors">KYC Verification</a>
            <a href="/categories" className="hover:text-sky-400 transition-colors">Categories & Pricing</a>
          </nav>
        </header>

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
