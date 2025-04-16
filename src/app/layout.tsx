import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Logo } from '@/components/logo';
import { createClient } from '@/utils/supabase/server';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MYBUCKS - Group Expense & Personal Finance Manager',
  description: 'Track group expenses and manage personal finances in one place',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {session && (
          <header className="border-b bg-white dark:bg-gray-800">
            <div className="container flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <Logo />
              </div>
            </div>
          </header>
        )}
        <main className={session ? 'container mx-auto px-4 py-8' : 'h-screen'}>{children}</main>
      </body>
    </html>
  );
}
