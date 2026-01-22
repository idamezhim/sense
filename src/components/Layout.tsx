import { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1A1A1A]">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
