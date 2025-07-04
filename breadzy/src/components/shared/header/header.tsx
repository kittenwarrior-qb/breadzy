'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, User, Heart, ShoppingCart, Menu  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/assets/img/logo.png';

export function Header() {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`w-full sticky top-0 z-50 bg-white ${isAtTop ? 'shadow-none' : 'shadow-sm'}`}>
      <div className="w-full max-w-[1280px] mx-auto flex flex-row items-center justify-between p-4 gap-5 text-sm font-medium">
        
        <Button className="md:hidden bg-white text-black">
          <Menu size={24} />
        </Button>

        <div className="hidden md:flex flex-row items-center gap-5">
          <Link href="/shop"><span>SHOP</span></Link>
          <Link href="/recipes"><span>RECIPES</span></Link>
          <Link href="/sourdough"><span>SOURDOUGH</span></Link>
          <Link href="/blog"><span>BLOG</span></Link>
          <Link href="/faq"><span>FAQ</span></Link>
        </div>

        <div className="flex items-center justify-center flex-1 md:flex-none transition-all duration-300">
          <Link href="/">
            <img
              src={Logo.src}
              alt="Logo"
              className={`transition-all duration-300 ${isAtTop ? 'w-[350px]' : 'w-[200px]'}`}
            />
          </Link>
        </div>

        <div className="flex flex-row items-center gap-4 md:gap-5">
          <div className="hidden md:flex flex-row items-center gap-5">
            <Link href="/connect"><span>CONNECT</span></Link>
            <Link href="/account"><span>MY ACCOUNT</span></Link>
          </div>

          <Link href="/search">
            <Search size={15} />
          </Link>
          <Link href="/user" className="hidden md:inline">
            <User size={15} />
          </Link>
          <Link href="/wishlist" className="hidden md:inline">
            <Heart size={15} />
          </Link>
          <Link href="/cart">
            <ShoppingCart size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}
