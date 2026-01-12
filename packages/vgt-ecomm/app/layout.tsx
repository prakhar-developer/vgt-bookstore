import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'VGT Bookstore - Your Trusted Source for Quality Books',
  description: 'Discover and order books from our vast collection at VGT Bookstore',
  icons: {
    icon: '/vgt.png',
    shortcut: '/vgt.png',
    apple: '/vgt.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
