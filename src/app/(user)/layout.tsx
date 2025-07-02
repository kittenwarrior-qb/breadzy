import '../globals.css';

import { Assistant } from 'next/font/google'

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
      <body className="font-assistant">
        <Header></Header>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
