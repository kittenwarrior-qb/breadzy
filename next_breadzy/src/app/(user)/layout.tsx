import '../globals.css';

import { Assistant } from 'next/font/google'
import { Alegreya } from 'next/font/google';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

const alegreya = Alegreya({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'], 
  variable: '--font-alegreya',
  display: 'swap',
})

const assistant = Assistant({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'], 
  variable: '--font-assistant',
  display: 'swap',
})

import { Header } from '@/components/shared/header/header';
import { Footer } from '@/components/shared/footer/footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Header></Header>
        <Toaster richColors position="top-center" />

        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
