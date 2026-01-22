import { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
