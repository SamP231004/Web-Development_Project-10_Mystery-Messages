import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Mystery Messages',
  description: 'Unmask the Message, Not the Messenger.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
